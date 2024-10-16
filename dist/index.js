// index.ts
import os from "os";
import Bonjour from "bonjour-service";
import { WebSocketServer } from "ws";
import { EventEmitter as EventEmitter2 } from "events";
import fs from "fs";

// lib/api_definitions.ts
var SetupDriver = class {
  // Base class logic here
};
var DriverSetupRequest = class extends SetupDriver {
  reconfigure;
  setupData;
  constructor(reconfigure, setupData) {
    super();
    this.reconfigure = reconfigure;
    this.setupData = setupData;
  }
};
var UserDataResponse = class extends SetupDriver {
  inputValues;
  constructor(inputValues) {
    super();
    this.inputValues = inputValues;
  }
};
var UserConfirmationResponse = class extends SetupDriver {
  confirm;
  constructor(confirm) {
    super();
    this.confirm = confirm;
  }
};
var AbortDriverSetup = class extends SetupDriver {
  error;
  constructor(error) {
    super();
    this.error = error;
  }
};
var SetupAction = class {
  // Base class logic here
};
var RequestUserInput = class extends SetupAction {
  title;
  settings;
  constructor(title, settings) {
    super();
    this.title = title;
    this.settings = settings;
  }
};
var RequestUserConfirmation = class extends SetupAction {
  title;
  header;
  image;
  footer;
  constructor(title, header, image, footer) {
    super();
    this.title = title;
    this.header = header;
    this.image = image;
    this.footer = footer;
  }
};
var SetupError = class extends SetupAction {
  errorType;
  constructor(errorType = "OTHER" /* OTHER */) {
    super();
    this.errorType = errorType;
  }
};
var SetupComplete = class extends SetupAction {
  // Marks setup as complete
};
var setup = {
  SetupDriver,
  DriverSetupRequest,
  UserDataResponse,
  UserConfirmationResponse,
  AbortDriverSetup,
  SetupAction,
  RequestUserInput,
  RequestUserConfirmation,
  SetupError,
  SetupComplete
};

// lib/utils.ts
function toLanguageObject(text) {
  if (typeof text === "string") {
    return { en: text };
  } else if (text instanceof Map) {
    return Object.fromEntries(text);
  } else {
    return text;
  }
}
function getDefaultLanguageString(text, defaultText = "Undefined") {
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

// lib/loggers.ts
import debugModule from "debug";
var log = {
  msgTrace: debugModule("ucapi:msg"),
  debug: debugModule("ucapi:debug"),
  info: debugModule("ucapi:info"),
  warn: debugModule("ucapi:warn"),
  error: debugModule("ucapi:error")
};
var loggers_default = log;

// lib/entities/entity.ts
import assert from "node:assert";

// lib/entities/entities.ts
import { EventEmitter } from "events";

// lib/entities/ui.ts
import assert2 from "node:assert";

// lib/entities/remote.ts
import assert3 from "node:assert";

// lib/entities/entities.ts
var Entities = class extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.storage = {};
  }
  storage;
  contains(id) {
    return !!this.storage[id];
  }
  getEntity(id) {
    if (!this.storage[id]) {
      loggers_default.warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return null;
    }
    return this.storage[id];
  }
  addEntity(entity) {
    if (this.storage[entity.id]) {
      loggers_default.warn(`ENTITIES(${this.id}): Entity is already in storage: ${entity.id}`);
      return false;
    }
    this.storage[entity.id] = entity;
    loggers_default.debug(`ENTITIES(${this.id}): Entity added: ${entity.id}`);
    return true;
  }
  removeEntity(id) {
    if (!this.storage[id]) {
      loggers_default.warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return false;
    }
    delete this.storage[id];
    loggers_default.debug(`ENTITIES(${this.id}): Entity removed: ${id}`);
    return true;
  }
  /**
   * Update or merge the provided attributes into an entity.
   *
   * @param {string} id The entity_id
   * @param {Map<string, any> | Record<string, any>} attributes The attributes to merge into the entity's attributes
   * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
   */
  updateEntityAttributes(id, attributes) {
    if (!this.contains(id)) {
      return false;
    }
    if (attributes instanceof Map) {
      attributes.forEach((value, key) => {
        this.storage[id].attributes[key] = value;
      });
    } else {
      for (const key in attributes) {
        this.storage[id].attributes[key] = attributes[key];
      }
    }
    this.emit("entity_attributes_updated" /* ENTITY_ATTRIBUTES_UPDATED */, id, this.storage[id].entity_type, attributes);
    return true;
  }
  getEntities() {
    const entities = [];
    Object.entries(this.storage).forEach(([, value]) => {
      const entity = {
        entity_id: value.id,
        entity_type: value.entity_type,
        device_id: value.device_id,
        features: value.features,
        name: value.name,
        area: value.area,
        device_class: value.device_class,
        options: value.options
      };
      entities.push(entity);
    });
    return entities;
  }
  getStates() {
    const entities = [];
    Object.entries(this.storage).forEach(([, value]) => {
      const entity = {
        entity_id: value.id,
        entity_type: value.entity_type,
        device_id: value.device_id,
        attributes: value.attributes
      };
      entities.push(entity);
    });
    return entities;
  }
  clear() {
    this.storage = {};
  }
};
var entities_default = Entities;

// index.ts
import { STATUS_CODES as STATUS_CODES2 } from "http";
var IntegrationAPI = class extends EventEmitter2 {
  configDirPath;
  driverPath;
  driverInfo;
  state;
  server;
  clients;
  setupHandler;
  availableEntities;
  configuredEntities;
  constructor() {
    super();
    this.server = new WebSocketServer({ noServer: true });
    this.driverPath = "driver.json";
    this.configDirPath = process.env.UC_CONFIG_HOME || process.env.HOME || "./";
    this.state = "DISCONNECTED" /* DISCONNECTED */;
    this.clients = /* @__PURE__ */ new Map();
    this.availableEntities = new entities_default("available");
    this.configuredEntities = new entities_default("configured");
    this.configuredEntities.on("entity_attributes_updated" /* ENTITY_ATTRIBUTES_UPDATED */, async (entityId, entityType, attributes) => {
      const data = {
        entity_id: entityId,
        entity_type: entityType,
        attributes: attributes instanceof Map ? Object.fromEntries(attributes) : attributes
      };
      await this.#broadcastEvent("entity_change" /* ENTITY_CHANGE */, data, "ENTITY" /* ENTITY */);
    });
  }
  /**
   * Initialize the library
   * @param {string|object} driverConfig either a string to specify the driver configuration file path, or an object holding the configuration
   * @param setupHandler optional driver setup handler if the driver metadata contains a setup_data_schema object
   */
  init(driverConfig, setupHandler) {
    this.setupHandler = setupHandler;
    const integrationInterface = process.env.UC_INTEGRATION_INTERFACE;
    const integrationPort = process.env.UC_INTEGRATION_HTTP_PORT;
    const disableMdnsPublish = process.env.UC_DISABLE_MDNS_PUBLISH === "true";
    if (typeof driverConfig === "string") {
      this.driverPath = driverConfig;
      let raw;
      try {
        raw = fs.readFileSync(this.driverPath);
      } catch (e) {
        throw Error(`Cannot load ${this.driverPath}: ${e}`);
      }
      try {
        this.driverInfo = JSON.parse(String(raw));
        loggers_default.debug("Driver info loaded");
      } catch (e) {
        loggers_default.error(`Error parsing driver info: ${e}`);
        throw Error("Error parsing driver info");
      }
    } else if (typeof driverConfig === "object") {
      this.driverInfo = createDriverInfo(driverConfig);
    } else {
      throw Error("Unsupported driverConfig");
    }
    this.driverInfo.driver_url = this.#getDriverUrl(this.driverInfo.driver_url, this.driverInfo.port);
    if (!disableMdnsPublish) {
      let bonjour = new Bonjour.default();
      loggers_default.debug("Starting mdns advertising");
      const hostname = os.hostname().split(".")[0] + ".local.";
      bonjour.publish({
        name: this.driverInfo.driver_id,
        host: hostname,
        type: "uc-integration",
        port: Number(integrationPort) || this.driverInfo.port || 9090,
        txt: {
          name: getDefaultLanguageString(this.driverInfo.name, "Unknown driver"),
          ver: this.driverInfo.version,
          developer: this.driverInfo.developer.name
        }
      });
    }
    const port = integrationPort || this.driverInfo.port || 9090;
    if (integrationInterface) {
      this.server = new WebSocketServer({
        host: integrationInterface,
        port: Number(port)
      });
    } else {
      this.server = new WebSocketServer({
        port: Number(port)
      });
    }
    this.server.on("connection", (connection, req) => {
      const wsId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
      loggers_default.info(`[${wsId}] WS: New connection`);
      const metadata = { id: wsId, authenticated: true };
      this.clients.set(connection, metadata);
      this.#authentication(wsId, true);
      connection.on("message", async (message) => {
        await this.#messageReceived(wsId, String(message));
      });
      connection.on("close", () => {
        loggers_default.info(`[${wsId}] WS: Connection closed`);
        this.clients.delete(connection);
      });
      connection.on("error", () => {
        loggers_default.warn(`[${wsId}] WS: Connection error`);
        this.clients.delete(connection);
      });
    });
    loggers_default.info(
      "Driver is up: %s, version: %s, listening on: %s:%d",
      this.driverInfo.driver_id,
      this.driverInfo.version,
      integrationInterface || "0.0.0.0",
      port
    );
  }
  getConfigDirPath() {
    return this.configDirPath;
  }
  /**
   * Rewrite WebSocket server URL to include in the `driver_metadata` response.
   *
   * - If null or empty: null is returned and propagated to the metadata. The remote uses the mDNS information.
   * - If starting with `ws://` or `wss://` the url is returned as defined.
   * - Otherwise: build URL from OS hostname and given port number.
   *
   * @param {string} url The WebSocket url. Usually defined in the driver.json file. May be null or empty.
   * @param {number} port The WebSocket server port number.
   * @returns {string} The WebSocket server url which should be returned in `driver_metadata`.
   */
  #getDriverUrl(url, port) {
    if (url) {
      if (url.startsWith("ws://") || url.startsWith("wss://")) {
        return url;
      }
      return `ws://${os.hostname()}:${port}`;
    }
    return void 0;
  }
  /**
   * Retrieve the corresponding WebSocket connection from an identifier.
   *
   * @param {string} id The websocket identifier.
   * @returns {any | null} The WebSocket connection or null if not found.
   */
  #getWsConnection(id) {
    for (const [connection, metadata] of this.clients.entries()) {
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
  async #sendResponse(wsId, id, msg, msgData, statusCode = 200 /* OK */) {
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
      this.#log_json_message(json, `[${wsId}] <- `);
      connection.send(response);
    } else {
      loggers_default.warn(`[${wsId}] Error sending response: connection no longer established`);
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
    this.#log_json_message(json, "<<- ");
    [...this.clients.keys()].forEach((client) => {
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
      this.#log_json_message(json, `[${wsId}] <- `);
      connection.send(response);
    } else {
      loggers_default.warn(`[${wsId}] Error sending event: connection no longer established`);
    }
  }
  // process incoming websocket messages
  async #messageReceived(wsId, message) {
    let json;
    try {
      json = JSON.parse(message);
    } catch (e) {
      loggers_default.error(`[${wsId}] Json parse error: ${e}`);
      return;
    }
    if (loggers_default.msgTrace.enabled) {
      loggers_default.msgTrace(`[${wsId}] -> ${JSON.stringify(json)}`);
    }
    const kind = json.kind;
    const id = json.id;
    const msg = json.msg;
    const msgData = json.msg_data;
    if (kind === "req") {
      switch (msg) {
        case "get_driver_version" /* GET_DRIVER_VERSION */:
          await this.#sendResponse(wsId, id, "driver_version" /* DRIVER_VERSION */, this.getDriverVersion());
          break;
        case "get_device_state" /* GET_DEVICE_STATE */:
          await this.#sendResponse(wsId, id, "device_state" /* DEVICE_STATE */, this.#getDeviceState());
          break;
        case "get_available_entities" /* GET_AVAILABLE_ENTITIES */:
          await this.#sendResponse(wsId, id, "available_entities" /* AVAILABLE_ENTITIES */, {
            available_entities: this.#getAvailableEntities()
          });
          break;
        case "get_entity_states" /* GET_ENTITY_STATES */:
          await this.#sendResponse(wsId, id, "entity_states" /* ENTITY_STATES */, this.#getEntityStates());
          break;
        case "entity_command" /* ENTITY_COMMAND */:
          await this.#entityCommand(wsId, id, msgData);
          break;
        case "subscribe_events" /* SUBSCRIBE_EVENTS */:
          await this.#subscribeEvents(msgData);
          await this.#sendOkResult(wsId, id);
          break;
        case "unsubscribe_events" /* UNSUBSCRIBE_EVENTS */:
          await this.#unSubscribeEvents(msgData);
          await this.#sendOkResult(wsId, id);
          break;
        case "get_driver_metadata" /* GET_DRIVER_METADATA */:
          await this.#sendResponse(wsId, id, "driver_metadata" /* DRIVER_METADATA */, this.driverInfo);
          break;
        case "setup_driver" /* SETUP_DRIVER */:
          if (!await this.#setupDriver(wsId, id, msgData)) {
            await this.driverSetupError({ wsId, id });
          }
          break;
        case "set_driver_user_data" /* SET_DRIVER_USER_DATA */:
          if (!await this.#setDriverUserData(wsId, id, msgData)) {
            await this.driverSetupError({ wsId, id });
          }
          break;
        default:
          loggers_default.warn(`[${wsId}] Unhandled request: ${msg}`);
          await this.#sendErrorResult(wsId, id);
          break;
      }
    } else if (kind === "event") {
      switch (msg) {
        case "connect" /* CONNECT */:
          this.emit("connect" /* CONNECT */);
          break;
        case "disconnect" /* DISCONNECT */:
          this.emit("disconnect" /* DISCONNECT */);
          break;
        case "enter_standby" /* ENTER_STANDBY */:
          this.emit("enter_standby" /* ENTER_STANDBY */);
          break;
        case "exit_standby" /* EXIT_STANDBY */:
          this.emit("exit_standby" /* EXIT_STANDBY */);
          break;
        case "abort_driver_setup" /* ABORT_DRIVER_SETUP */:
          this.emit("setup_driver_abort" /* SETUP_DRIVER_ABORT */);
          break;
        default:
          loggers_default.warn(`[${wsId}] Unhandled event: ${msg}`);
          break;
      }
    }
  }
  /**
   * Log a JSON message with a prefix text.
   *
   * Base64 encoded images starting with `data:` are removed in `msg_data.attributes.media_image_url`
   * fields to limit log output.
   * The `msg_data` object may either be a single object or an array of objects.
   *
   * @param {Record<string, any>} json The JSON message to log.
   * @param {string} prefix Prefix text to add before the JSON message.
   */
  #log_json_message(json, prefix) {
    if (!loggers_default.msgTrace.enabled) {
      return;
    }
    loggers_default.msgTrace(`${prefix} ${JSON.stringify(json)}`);
  }
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  // private methods
  #authentication(wsId, success) {
    this.#sendResponse(
      wsId,
      0,
      "authentication" /* AUTHENTICATION */,
      {},
      success ? 200 /* OK */ : 401 /* UNAUTHORIZED */
    );
  }
  #getDeviceState() {
    return {
      state: this.state
    };
  }
  #getAvailableEntities() {
    return this.availableEntities.getEntities();
  }
  async #subscribeEvents(entities) {
    entities.entity_ids.forEach((entityId) => {
      const entity = this.availableEntities.getEntity(entityId);
      if (entity) {
        this.configuredEntities.addEntity(entity);
      } else {
        loggers_default.warn(`WARN: cannot subscribe entity '${entityId}': entity is not available`);
      }
    });
    this.emit("subscribe_entities" /* SUBSCRIBE_ENTITIES */, entities.entity_ids);
  }
  async #unSubscribeEvents(entities) {
    let res = true;
    entities.entity_ids.forEach((entityId) => {
      if (!this.configuredEntities.removeEntity(entityId)) {
        res = false;
      }
    });
    this.emit("unsubscribe_entities" /* UNSUBSCRIBE_ENTITIES */, entities.getEntityIds());
    return res;
  }
  #getEntityStates() {
    return this.configuredEntities.getStates();
  }
  async #entityCommand(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    if (!data) {
      loggers_default.warn("Ignoring entity command: called with empty msg_data");
      await this.acknowledgeCommand(wsHandle, 400 /* BAD_REQUEST */);
      return;
    }
    const entityId = data.entity_id;
    const cmdId = data.cmd_id;
    if (!entityId || !cmdId) {
      loggers_default.warn("Ignoring command: missing entity_id or cmd_id");
      await this.acknowledgeCommand(wsHandle, 400 /* BAD_REQUEST */);
      return;
    }
    const entity = this.configuredEntities.getEntity(entityId);
    if (!entity) {
      loggers_default.warn("Cannot execute command '%s' for '%s': no configured entity found", cmdId, entityId);
      await this.acknowledgeCommand(wsHandle, 404 /* NOT_FOUND */);
      return;
    }
    if (!entity.hasCmdHandler) {
      loggers_default.warn(
        `DEPRECATED no entity command handler provided for ${data.entity_id} by the driver: please migrate the integration driver, the legacy ENTITY_COMMAND event will be removed in a future release!`
      );
      this.emit("entity_command" /* ENTITY_COMMAND */, wsHandle, data.entity_id, data.entity_type, data.cmd_id, data.params);
    } else {
      const result = await entity.command(cmdId, "params" in data ? data.params : void 0);
      const resultEnumValue = STATUS_CODES2[result];
      await this.acknowledgeCommand(wsHandle);
    }
  }
  async #setupDriver(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    if (this.setupHandler) {
      await this.acknowledgeCommand(wsHandle);
    }
    if (!data || !data.setup_data) {
      loggers_default.error("Aborting setup_driver: called with empty msg_data");
      return false;
    }
    const reconfigure = data.reconfigure && typeof data.reconfigure === "boolean" ? data.reconfigure : false;
    if (!this.setupHandler) {
      loggers_default.warn(
        "DEPRECATED no setup handler provided by the driver: please migrate the integration driver, the legacy SETUP_DRIVER, SETUP_DRIVER_USER_DATA, SETUP_DRIVER_USER_CONFIRMATION events will be removed in a future release!"
      );
      this.emit("setup_driver" /* SETUP_DRIVER */, wsHandle, data.setup_data, reconfigure);
      return true;
    }
    let result = false;
    try {
      const action = await this.setupHandler(new setup.DriverSetupRequest(reconfigure, data.setup_data));
      if (action instanceof setup.RequestUserInput) {
        await this.driverSetupProgress(wsHandle);
        await this.requestDriverSetupUserInput(wsHandle, action.title, action.settings);
        result = true;
      } else if (action instanceof setup.RequestUserConfirmation) {
        await this.driverSetupProgress(wsHandle);
        await this.requestDriverSetupUserConfirmation(
          wsHandle,
          action.title,
          String(action.header),
          void 0,
          String(action.footer)
        );
        result = true;
      } else if (action instanceof setup.SetupComplete) {
        await this.driverSetupComplete(String(wsHandle));
        result = true;
      } else if (action instanceof setup.SetupError) {
        await this.driverSetupError(wsHandle, action.errorType);
        result = true;
      }
    } catch (ex) {
      loggers_default.error("Exception in setup handler, aborting setup!", ex);
    }
    return result;
  }
  async #setDriverUserData(wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    if (this.setupHandler) {
      await this.acknowledgeCommand(wsHandle);
    }
    if (!data || !(data.input_values || data.confirm)) {
      loggers_default.warn("Unsupported set_driver_user_data payload received: %s", data);
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.driverSetupProgress(wsHandle);
    if (!this.setupHandler) {
      if (data.input_values) {
        this.emit("setup_driver_user_data" /* SETUP_DRIVER_USER_DATA */, wsHandle, data.input_values);
        return true;
      } else if (data.confirm) {
        this.emit("setup_driver_user_confirmation" /* SETUP_DRIVER_USER_CONFIRMATION */, wsHandle);
        return true;
      } else {
        loggers_default.warn("Unsupported set_driver_user_data payload received");
      }
      return false;
    }
    let result = false;
    try {
      let action = new setup.SetupError();
      if (data.input_values) {
        action = await this.setupHandler(new setup.UserDataResponse(data.input_values));
      } else if (data.confirm) {
        action = await this.setupHandler(new setup.UserConfirmationResponse(data.confirm));
      }
      if (action instanceof setup.RequestUserInput) {
        await this.requestDriverSetupUserInput(wsHandle, action.title, action.settings);
        result = true;
      } else if (action instanceof setup.RequestUserConfirmation) {
        await this.requestDriverSetupUserConfirmation(
          wsHandle,
          action.title,
          String(action.header),
          void 0,
          String(action.footer)
        );
        result = true;
      } else if (action instanceof setup.SetupComplete) {
        await this.driverSetupComplete(wsHandle.wsId);
        result = true;
      } else if (action instanceof setup.SetupError) {
        await this.driverSetupError(wsHandle, action.errorType);
        result = true;
      }
    } catch (ex) {
      loggers_default.error("Exception in setup handler, aborting setup!", ex);
    }
    return result;
  }
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  getDriverVersion() {
    return {
      name: this.driverInfo.name.en,
      version: {
        api: this.driverInfo.min_core_api,
        driver: this.driverInfo.version
      }
    };
  }
  async setDeviceState(state) {
    this.state = state;
    await this.#broadcastEvent(
      "device_state" /* DEVICE_STATE */,
      {
        state: this.state
      },
      "DEVICE" /* DEVICE */
    );
  }
  /**
   * Acknowledge a received command event it was successfully executed or not.
   *
   * @param {Object} wsHandle The WebSocket handle received in the ENTITY_COMMAND event.
   * @param {Number} statusCode The status code. Defaults to OK 200.
   */
  async acknowledgeCommand(wsHandle, statusCode = 200 /* OK */) {
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
    await this.#sendEvent(wsHandle.wsId, "driver_setup_change" /* DRIVER_SETUP_CHANGE */, msgData, "DEVICE" /* DEVICE */);
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
  async requestDriverSetupUserConfirmation(wsHandle, title, msg1, image = void 0, msg2) {
    const msgData = {
      event_type: "SETUP",
      state: "WAIT_USER_ACTION",
      require_user_action: {
        confirmation: {
          title: toLanguageObject(title),
          message1: toLanguageObject(msg1),
          image,
          message2: toLanguageObject(msg2)
        }
      }
    };
    await this.#sendEvent(wsHandle.wsId, "driver_setup_change" /* DRIVER_SETUP_CHANGE */, msgData, "DEVICE" /* DEVICE */);
  }
  /**
   * Request user input during the driver setup flow.
   *
   * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   * @param {string|Map<string, string>|Object<string, string>} title A human-readable title of the request screen. Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {Array<object>} settings Array of input field definition objects. See Integration-API specification.
   */
  async requestDriverSetupUserInput(wsHandle, title, settings) {
    const msgData = {
      event_type: "SETUP",
      state: "WAIT_USER_ACTION",
      require_user_action: {
        input: {
          title: toLanguageObject(title),
          settings
        }
      }
    };
    await this.#sendEvent(wsHandle.wsId, "driver_setup_change" /* DRIVER_SETUP_CHANGE */, msgData, "DEVICE" /* DEVICE */);
  }
  /**
   * Confirm successful setup flow completion.
   *
   * Further setup flow messages will be ignored by the Remote.
   *
   * @param {string} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
   */
  async driverSetupComplete(wsHandle) {
    const msgData = {
      event_type: "STOP",
      state: "OK"
    };
    await this.#sendEvent(wsHandle, "driver_setup_change" /* DRIVER_SETUP_CHANGE */, msgData, "DEVICE" /* DEVICE */);
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
    await this.#sendEvent(wsHandle.wsId, "driver_setup_change" /* DRIVER_SETUP_CHANGE */, msgData, "DEVICE" /* DEVICE */);
  }
  getConfiguredEntities() {
    return this.configuredEntities;
  }
  getAvailableEntities() {
    return this.availableEntities;
  }
  addEntity(entity) {
    this.availableEntities.addEntity(entity);
  }
  clearAvailableEntities() {
    this.availableEntities.clear();
  }
  clearConfiguredEntities() {
    this.configuredEntities.clear();
  }
  updateEntityAttributes(entityId, attributes) {
    return this.configuredEntities.updateEntityAttributes(entityId, attributes);
  }
};
var integration_node_library_default = new IntegrationAPI();
function createDriverInfo(driverConfig) {
  throw new Error("Function not implemented.");
}
export {
  integration_node_library_default as default
};
/**
 * Integration driver API definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Utility functions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Central log functions.
 *
 * Use [debug](https://www.npmjs.com/package/debug) module for logging.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Common entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Button-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Climate-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * User interface definitions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Remote-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Entity pools for available and configured entities during runtime.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
/**
 * Integration driver API for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
