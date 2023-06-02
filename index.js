"use strict";

const os = require("os");

const { Bonjour } = require("bonjour-service");

const WebSocket = require("ws");
const EventEmitter = require("events");
const fs = require("fs");

const uc = require("./lib/api_definitions");
const Entities = require("./lib/entities/entities");

function log(message) {
  console.log(`[UC Integration API] ${message}`);
}

class IntegrationAPI extends EventEmitter {
  #driverPath;
  #driverInfo;
  #state;
  #server;
  #clients;

  constructor() {
    super();

    this.#driverPath = "driver.json";

    // directory to store configuration files
    this.configDirPath = process.env.UC_CONFIG_HOME;

    // set default state to connected
    this.#state = uc.DEVICE_STATES.DISCONNECTED;

    this.#clients = new Map();

    // create storage for available and configured entities
    this.availableEntities = new Entities("available");
    this.configuredEntities = new Entities("configured");

    // connect to update events for entity attributes
    this.configuredEntities.on(uc.EVENTS.ENTITY_ATTRIBUTES_UPDATED, async (entityId, entityType, attributes) => {
      const data = {
        entity_id: entityId,
        entity_type: entityType,
        attributes: Object.fromEntries(attributes)
      };

      await this.#broadcastEvent(uc.MSG_EVENTS.ENTITY_CHANGE, data, uc.EVENT_CATEGORY.ENTITY);
    });
  }

  /**
   * Initialize the library
   * @param {string|object} either a string to specify the driver configuration file path, or an object holding the configuration
   */
  init(driverConfig) {
    const integrationInterface = process.env.UC_INTEGRATION_INTERFACE;
    const integrationPort = process.env.UC_INTEGRATION_HTTP_PORT;
    // TODO: implement wss
    // const integrationHttpsEnabled = process.env.UC_INTEGRATION_HTTPS_ENABLED === "true";
    const disableMdnsPublish = process.env.UC_DISABLE_MDNS_PUBLISH === "true";

    // load driver information from either a file path or object.
    if (typeof driverConfig === "string") {
      this.#driverPath = driverConfig;

      let raw;
      try {
        raw = fs.readFileSync(this.#driverPath);
      } catch (e) {
        throw Error(`Cannot load ${this.#driverPath}: ${e}`);
      }

      try {
        this.#driverInfo = JSON.parse(raw);
        log("Driver info loaded");
      } catch (e) {
        log(`Error parsing driver info: ${e}`);
        throw Error("Error parsing driver info");
      }
    } else if (typeof driverConfig === "object") {
      this.#driverInfo = driverConfig;
    } else {
      throw Error("Unsupported driverConfig");
    }

    this.#driverInfo.driver_url = this.#getDriverUrl(this.#driverInfo.driver_url, this.#driverInfo.port);

    if (!disableMdnsPublish) {
      let bonjour;
      if (integrationInterface) {
        bonjour = new Bonjour({ interface: integrationInterface });
      } else {
        bonjour = new Bonjour();
      }

      log("Starting mdns advertising");

      // Make sure to advertise a .local hostname. It seems that bonjour just blindly takes the hostname, short or FQDN.
      // The remote only supports multicast DNS resolution in the .local domain.
      // Test with: avahi-browse -d local _uc-integration._tcp --resolve -t
      const hostname = os.hostname().split(".")[0] + ".local.";

      bonjour.publish({
        name: this.#driverInfo.driver_id,
        host: hostname,
        type: "uc-integration",
        port: integrationPort || this.#driverInfo.port,
        txt: {
          name: this.#getDefaultLanguageString(this.#driverInfo.name, "Unknown driver"),
          ver: this.#driverInfo.version,
          developer: this.#driverInfo.developer.name
        }
      });
    }

    // TODO #5 handle startup errors if e.g. port is already in use
    // setup websocket server - remote-core will connect to this
    if (integrationInterface) {
      this.#server = new WebSocket.Server({
        host: integrationInterface,
        port: integrationPort || this.#driverInfo.port
      });
    } else {
      this.#server = new WebSocket.Server({
        port: integrationPort || this.#driverInfo.port
      });
    }

    this.#server.on("connection", (connection, req) => {
      const wsId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;

      log(`[${wsId}] WS: New connection`);

      // more metadata in the future, e.g. authentication info etc
      const metadata = { id: wsId, authenticated: true };

      this.#clients.set(connection, metadata);

      this.#authentication(wsId, true);

      connection.on("message", async (message) => {
        await this.#messageReceived(wsId, message);
      });

      connection.on("close", () => {
        log(`[${wsId}] WS: Connection closed`);
        this.#clients.delete(connection);
      });

      connection.on("error", () => {
        log(`[${wsId}] WS: Connection error`);
        this.#clients.delete(connection);
      });
    });
  }

  /**
   * Rewrite WebSocket server URL to include in the `driver_metadata` response.
   *
   * - If null or empty: null is returned and propagated to the metadata. The remote uses the mDNS information.
   * - If starting with `ws://` or `wss://` the url is returned as defined.
   * - Otherwise: build URL from OS hostname and given port number.
   *
   * @param {String} url The WebSocket url. Usually defined in the driver.json file. May be null or empty.
   * @param {Number} port The WebSocket server port number.
   * @returns {*|null|string} The WebSocket server url which should be returned in `driver_metadata`.
   */
  #getDriverUrl(url, port) {
    if (url) {
      if (url.startsWith("ws://") || url.startsWith("wss://")) {
        return url;
      }
      return `ws://${os.hostname()}:${port}`;
    }

    // Remote will use mDNS information
    return null;
  }

  /**
   * Get the default text from a language text map.
   *
   * If english `en` or any `en-##` is not defined, the first entry is returned.
   *
   * @param {object} text The language text map, key is the language identifier, value the language specific text.
   * @param {string} defaultText The text to return if `text` is empty.
   * @returns {string} The default text.
   */
  #getDefaultLanguageString(text, defaultText = "Undefined") {
    if (!text) {
      return defaultText;
    }

    if (text.en) {
      return text.en;
    }

    for (const [index, [key, value]] of Object.entries(text).entries()) {
      if (index === 0) {
        defaultText = value;
      }
      if (key.startsWith("en-")) {
        return text[key];
      }
    }

    return defaultText;
  }

  #toLanguageObject(text) {
    if (text) {
      return typeof text === "string" || text instanceof String ? { en: text } : Object.fromEntries(text);
    } else {
      return null;
    }
  }

  /**
   * Retrieve the corresponding WebSocket connection from an identifier.
   *
   * @param {string} id The websocket identifier.
   * @returns {*|null} The WebSocket connection or null if not found.
   */
  #getWsConnection(id) {
    for (const [connection, metadata] of this.#clients.entries()) {
      if (metadata.id === id) {
        return connection;
      }
    }

    return null;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  async #sendOkResult(wsId, id, msgData = {}) {
    await this.#sendResponse(wsId, id, "result", msgData, 200);
  }

  async #sendErrorResult(wsId, id, statusCode = 500, msgData = {}) {
    await this.#sendResponse(wsId, id, "result", msgData, statusCode);
  }

  // TODO return send result, connection.send error handling
  // send a response to a request
  async #sendResponse(wsId, id, msg, msgData, statusCode = uc.STATUS_CODES.OK) {
    const json = {
      kind: "resp",
      req_id: id,
      code: statusCode,
      msg,
      msg_data: msgData
    };

    const connection = this.#getWsConnection(wsId);
    if (connection != null) {
      const response = JSON.stringify(json);
      log(`[${wsId}] <- ${response}`);
      connection.send(response);
    } else {
      log(`[${wsId}] Error sending response: connection no longer established`);
    }
  }

  /**
   * Broadcast an event to all connected clients
   *
   * @param {string} msg  The message name
   * @param {object} msgData The message payload in `msg_data`
   * @param {string} category The event category
   */
  async #broadcastEvent(msg, msgData, category) {
    const json = {
      kind: "event",
      msg,
      msg_data: msgData,
      cat: category
    };

    const response = JSON.stringify(json);
    log(`<<- ${response}`);
    [...this.#clients.keys()].forEach((client) => {
      client.send(response);
    });
  }

  /**
   * Send an event message to the given client.
   *
   * @param {string} wsId WebSocket identifier
   * @param {string} msg  The message name
   * @param {object} msgData The message payload in `msg_data`
   * @param {string} category The event category
   */
  async #sendEvent(wsId, msg, msgData, category) {
    const json = {
      kind: "event",
      msg,
      msg_data: msgData,
      cat: category
    };

    const connection = this.#getWsConnection(wsId);
    if (connection != null) {
      const response = JSON.stringify(json);
      log(`[${wsId}] <- ${response}`);
      connection.send(response);
    } else {
      log(`[${wsId}] Error sending event: connection no longer established`);
    }
  }

  // process incoming websocket messages
  async #messageReceived(wsId, message) {
    let json;
    try {
      json = JSON.parse(message);
    } catch (e) {
      log(`[${wsId}] Json parse error: ${e}`);
      return;
    }

    log(`[${wsId}] -> ${JSON.stringify(json)}`);

    const kind = json.kind;
    const id = json.id;
    const msg = json.msg;
    const msgData = json.msg_data;

    if (kind === "req") {
      switch (msg) {
        case uc.MESSAGES.GET_DRIVER_VERSION:
          await this.#sendResponse(wsId, id, uc.MSG_EVENTS.DRIVER_VERSION, this.getDriverVersion());
          break;

        case uc.MESSAGES.GET_DEVICE_STATE:
          await this.#sendResponse(wsId, id, uc.MSG_EVENTS.DEVICE_STATE, this.#getDeviceState());
          break;

        case uc.MESSAGES.GET_AVAILABLE_ENTITIES:
          await this.#sendResponse(wsId, id, uc.MSG_EVENTS.AVAILABLE_ENTITIES, {
            available_entities: this.#getAvailableEntities()
          });
          break;

        case uc.MESSAGES.GET_ENTITY_STATES:
          await this.#sendResponse(wsId, id, uc.MSG_EVENTS.ENTITY_STATES, this.#getEntityStates());
          break;

        case uc.MESSAGES.ENTITY_COMMAND:
          await this.#entityCommand(wsId, id, msgData);
          break;

        case uc.MESSAGES.SUBSCRIBE_EVENTS:
          await this.#subscribeEvents(msgData);
          await this.#sendOkResult(wsId, id);
          break;

        case uc.MESSAGES.UNSUBSCRIBE_EVENTS:
          await this.#unSubscribeEvents(msgData);
          await this.#sendOkResult(wsId, id);
          break;

        case uc.MESSAGES.GET_DRIVER_METADATA:
          await this.#sendResponse(wsId, id, uc.MSG_EVENTS.DRIVER_METADATA, this.#driverInfo);
          break;

        case uc.MESSAGES.SETUP_DRIVER:
          await this.#setupDriver(wsId, id, msgData);
          break;

        case uc.MESSAGES.SET_DRIVER_USER_DATA:
          await this.#setDriverUserData(wsId, id, msgData);
          break;

        default:
          log(`[${wsId}] Unhandled request: ${msg}`);
          await this.#sendErrorResult(wsId, id);
          break;
      }
    } else if (kind === "event") {
      switch (msg) {
        case uc.MSG_EVENTS.CONNECT:
          this.emit(uc.EVENTS.CONNECT);
          break;

        case uc.MSG_EVENTS.DISCONNECT:
          this.emit(uc.EVENTS.DISCONNECT);
          break;

        case uc.MSG_EVENTS.ENTER_STANDBY:
          this.emit(uc.EVENTS.ENTER_STANDBY);
          break;

        case uc.MSG_EVENTS.EXIT_STANDBY:
          this.emit(uc.EVENTS.EXIT_STANDBY);
          break;

        case uc.MSG_EVENTS.ABORT_DRIVER_SETUP:
          this.emit(uc.EVENTS.SETUP_DRIVER_ABORT);
          break;

        default:
          log(`[${wsId}] Unhandled event: ${msg}`);
          break;
      }
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  // private methods
  #authentication(wsId, success) {
    this.#sendResponse(
      wsId,
      0,
      uc.MESSAGES.AUTHENTICATION,
      {},
      success ? uc.STATUS_CODES.OK : uc.STATUS_CODES.UNAUTHORIZED
    );
  }

  #getDeviceState() {
    return {
      state: this.#state
    };
  }

  #getAvailableEntities() {
    // return list of entities
    return this.availableEntities.getEntities();
  }

  async #subscribeEvents(entities) {
    entities.entity_ids.forEach((entityId) => {
      const entity = this.availableEntities.getEntity(entityId);
      if (entity) {
        this.configuredEntities.addEntity(entity);
      } else {
        console.log(`WARN: cannot subscribe entity '${entityId}': entity is not available`);
      }
    });

    this.configuredEntities.saveData();

    this.emit(uc.EVENTS.SUBSCRIBE_ENTITIES, entities.entity_ids);
  }

  async #unSubscribeEvents(entities) {
    // remove entities from registered entities
    let res = true;

    entities.entity_ids.forEach((entityId) => {
      if (!this.configuredEntities.removeEntity(entityId)) {
        res = false;
      }
    });

    this.configuredEntities.saveData();

    this.emit(uc.EVENTS.UNSUBSCRIBE_ENTITIES, entities.entity_ids);

    return res;
  }

  #getEntityStates() {
    // simply return entity states from configured entities
    return this.configuredEntities.getStates();
  }

  async #entityCommand(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    // emit event, so the driver can act on it
    this.emit(uc.EVENTS.ENTITY_COMMAND, wsHandle, data.entity_id, data.entity_type, data.cmd_id, data.params);
  }

  async #setupDriver(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    // emit event, so the driver can act on it
    this.emit(uc.EVENTS.SETUP_DRIVER, wsHandle, data.setup_data);
  }

  async #setDriverUserData(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    // emit event, so the driver can act on it
    if (data.input_values) {
      this.emit(uc.EVENTS.SETUP_DRIVER_USER_DATA, wsHandle, data.input_values);
    } else if (data.confirm) {
      this.emit(uc.EVENTS.SETUP_DRIVER_USER_CONFIRMATION, wsHandle);
    } else {
      console.log("Unsupported set_driver_user_data payload received");
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  getDriverVersion() {
    return {
      name: this.#driverInfo.name.en,
      version: {
        api: this.#driverInfo.min_core_api,
        driver: this.#driverInfo.version
      }
    };
  }

  async setDeviceState(state) {
    this.#state = state;

    await this.#broadcastEvent(
      uc.MSG_EVENTS.DEVICE_STATE,
      {
        state: this.#state
      },
      uc.EVENT_CATEGORY.DEVICE
    );
  }

  /**
   * Acknowledge a received command event it was successfully executed or not.
   *
   * @param {Object} wsHandle The WebSocket handle received in the ENTITY_COMMAND event.
   * @param {Number} statusCode The status code. Defaults to OK 200.
   */
  async acknowledgeCommand(wsHandle, statusCode = uc.STATUS_CODES.OK) {
    await this.#sendResponse(wsHandle.wsId, wsHandle.reqId, "result", {}, statusCode);
  }

  /**
   * Send a setup progress message during the driver setup flow.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   */
  async driverSetupProgress(wsHandle) {
    const msgData = {
      event_type: "SETUP",
      state: "SETUP"
    };
    await this.#sendEvent(wsHandle.wsId, uc.MSG_EVENTS.DRIVER_SETUP_CHANGE, msgData, uc.EVENT_CATEGORY.DEVICE);
  }

  /**
   * Request a user confirmation during the driver setup flow.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   * @param {string|Map} title A human-readable title of the request screen. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {string|Map} msg1 The optional message to display in the request screen. Either a string or a language map.
   * @param {string} image An optional base64 encoded image to display below `msg1`.
   * @param {string|Map} msg2 An optional message to display in the request screen below `msg1` or `image`. Either a string or a language map.
   */
  async requestDriverSetupUserConfirmation(wsHandle, title, msg1 = undefined, image = undefined, msg2 = undefined) {
    const msgData = {
      event_type: "SETUP",
      state: "WAIT_USER_ACTION",
      require_user_action: {
        confirmation: {
          title: this.#toLanguageObject(title),
          message1: this.#toLanguageObject(msg1),
          image,
          message2: this.#toLanguageObject(msg2)
        }
      }
    };
    await this.#sendEvent(wsHandle.wsId, uc.MSG_EVENTS.DRIVER_SETUP_CHANGE, msgData, uc.EVENT_CATEGORY.DEVICE);
  }

  /**
   * Request user input during the driver setup flow.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   * @param {string|Map} title A human-readable title of the request screen. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {Array<object>} settings Array of input field definition objects. See Integration-API specification.
   */
  async requestDriverSetupUserInput(wsHandle, title, settings) {
    const msgData = {
      event_type: "SETUP",
      state: "WAIT_USER_ACTION",
      require_user_action: {
        input: {
          title: this.#toLanguageObject(title),
          settings
        }
      }
    };
    await this.#sendEvent(wsHandle.wsId, uc.MSG_EVENTS.DRIVER_SETUP_CHANGE, msgData, uc.EVENT_CATEGORY.DEVICE);
  }

  /**
   * Confirm successful setup flow completion.
   *
   * Further setup flow messages will be ignored by the Remote.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   */
  async driverSetupComplete(wsHandle) {
    const msgData = {
      event_type: "STOP",
      state: "OK"
    };
    await this.#sendEvent(wsHandle.wsId, uc.MSG_EVENTS.DRIVER_SETUP_CHANGE, msgData, uc.EVENT_CATEGORY.DEVICE);
  }

  /**
   * Set the driver setup flow as failed.
   *
   * Further setup flow messages will be ignored by the Remote.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   * @param {string} error The error reason. TODO create enum.
   */
  async driverSetupError(wsHandle, error = "OTHER") {
    const msgData = {
      event_type: "STOP",
      state: "ERROR",
      error
    };
    await this.#sendEvent(wsHandle.wsId, uc.MSG_EVENTS.DRIVER_SETUP_CHANGE, msgData, uc.EVENT_CATEGORY.DEVICE);
  }
}

module.exports = new IntegrationAPI();
module.exports.DEVICE_STATES = uc.DEVICE_STATES;
module.exports.EVENTS = uc.EVENTS;
module.exports.STATUS_CODES = uc.STATUS_CODES;
module.exports.Entities = Entities;
