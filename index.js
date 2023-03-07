'use strict';

const os = require('os');

const { Bonjour } = require('bonjour-service');
const bonjour = new Bonjour();

const WebSocket = require('ws');
const EventEmitter = require('events');
const fs = require('fs');

const uc = require('./lib/api_definitions');
const Entities = require('./lib/entities/entities');

function log (message) {
  console.log(`[UC Integration API] ${message}`);
}

class IntegrationAPI extends EventEmitter {
  #driverPath;
  #driverInfo;
  #state;
  #server;
  #clients;

  constructor () {
    super();

    this.#driverPath = 'driver.json';

    // set default state to connected
    this.#state = uc.DEVICE_STATES.DISCONNECTED;

    this.#clients = new Map();

    // create storage for available and configured entities
    this.availableEntities = new Entities('available');
    this.configuredEntities = new Entities('configured');

    // connect to update events for entity attributes
    this.configuredEntities.on(
      uc.EVENTS.ENTITY_ATTRIBUTES_UPDATED,
      async (entityId, entityType, attributes) => {
        const data = {
          entity_id: entityId,
          entity_type: entityType,
          attributes: Object.fromEntries(attributes)
        };

        await this.#sendEvent(uc.EVENTS.ENTITY_CHANGE, data, uc.EVENT_CATEGORY.ENTITY);
      }
    );
  }

  init (driverPath) {
    // load driver information from driver.json
    this.#driverPath = driverPath;
    let raw;

    try {
      raw = fs.readFileSync(driverPath);
    } catch (e) {
      throw Error(`Cannot load driver.json: ${e}`);
    }

    try {
      this.#driverInfo = JSON.parse(raw);
      this.#driverInfo.driver_url = this.#getDriverUrl(this.#driverInfo.driver_url, this.#driverInfo.port);
      log('Driver info loaded');
    } catch (e) {
      log(`Error parsing driver info: ${e}`);
      throw Error('Error parsing driver info');
    }

    bonjour.publish({
      name: this.#driverInfo.driver_id,
      type: 'uc-integration',
      port: this.#driverInfo.port,
      txt: { name: this.#getDefaultLanguageString(this.#driverInfo.name), ver: this.#driverInfo.version, developer: this.#driverInfo.developer.name }
    });

    // TODO #5 handle startup errors if e.g. port is already in use
    // setup websocket server - remote-core will connect to this
    this.#server = new WebSocket.Server({ port: this.#driverInfo.port });

    this.#server.on('connection', (connection, req) => {
      const wsId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;

      log(`[${wsId}] WS: New connection`);

      // more metadata in the future, e.g. authentication info etc
      const metadata = { id: wsId, authenticated: true };

      this.#clients.set(connection, metadata);

      this.#authentication(wsId, true);

      connection.on('message', async (message) => {
        await this.#messageReceived(wsId, message);
      });

      connection.on('close', () => {
        log(`[${wsId}] WS: Connection closed`);
        this.#clients.delete(connection);
      });

      connection.on('error', () => {
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
  #getDriverUrl (url, port) {
    if (url) {
      if (url.startsWith('ws://') || url.startsWith('wss://')) {
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
   * If english `en` is not defined, the first entry is returned.
   *
   * @param {object} text The language text map, key is the language identifier, value the language specific text.
   * @returns {string} The default text.
   */
  #getDefaultLanguageString (text) {
    if (!text) {
      return 'Driver without a name';
    }

    if (text.en) {
      return text.en;
    }

    // eslint-disable-next-line no-unreachable-loop
    for (const key in text) {
      return text[key];
    }

    return 'Driver without a name';
  }

  /**
   * Retrieve the corresponding WebSocket connection from an identifier.
   *
   * @param {string} id The websocket identifier.
   * @returns {*|null} The WebSocket connection or null if not found.
   */
  #getWsConnection (id) {
    for (const [connection, metadata] of this.#clients.entries()) {
      if (metadata.id === id) { return connection; }
    }

    return null;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  async #sendOkResult (wsId, id, msgData = null) {
    await this.#sendResponse(wsId, id, 'result', msgData, 200);
  }

  async #sendErrorResult (wsId, id, statusCode = 500, msgData = null) {
    await this.#sendResponse(wsId, id, 'result', msgData, statusCode);
  }

  // send a response to a request
  async #sendResponse (wsId, id, msg, msgData, statusCode = uc.STATUS_CODES.OK) {
    const json = {
      kind: 'resp',
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

  // send an event
  async #sendEvent (msg, msgData, cat) {
    const json = {
      kind: 'event',
      msg,
      msg_data: msgData,
      cat
    };

    const response = JSON.stringify(json);
    log(`<- ${response}`);
    [...this.#clients.keys()].forEach((client) => {
      client.send(response);
    });
  }

  // process incoming websocket messages
  async #messageReceived (wsId, message) {
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

    if (kind === 'req') {
      switch (msg) {
        case uc.MESSAGES.GET_DRIVER_VERSION:
          await this.#sendResponse(
            wsId,
            id,
            uc.EVENTS.DRIVER_VERSION,
            this.getDriverVersion()
          );
          break;

        case uc.MESSAGES.GET_DEVICE_STATE:
          await this.#sendResponse(
            wsId,
            id,
            uc.EVENTS.DEVICE_STATE,
            this.#getDeviceState()
          );
          break;

        case uc.MESSAGES.GET_AVAILABLE_ENTITIES:
          await this.#sendResponse(wsId, id, uc.EVENTS.AVAILABLE_ENTITIES, {
            available_entities: this.#getAvailableEntities()
          });
          break;

        case uc.MESSAGES.GET_ENTITY_STATES:
          await this.#sendResponse(
            wsId,
            id,
            uc.EVENTS.ENTITY_STATES,
            this.#getEntityStates()
          );
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
          await this.#sendResponse(
            wsId,
            id,
            uc.EVENTS.DRIVER_METADATA,
            this.#driverInfo
          );
          break;

        default:
          log(`[${wsId}] Unhandled request: ${msg}`);
          await this.#sendErrorResult(wsId, id);
          break;
      }
    } else if (kind === 'event') {
      switch (msg) {
        case uc.EVENTS.CONNECT:
          this.emit(uc.EVENTS.CONNECT);
          break;

        case uc.EVENTS.DISCONNECT:
          this.emit(uc.EVENTS.DISCONNECT);
          break;

        default:
          break;
      }
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  // private methods
  #authentication (wsId, success) {
    this.#sendResponse(
      wsId,
      0,
      uc.MESSAGES.AUTHENTICATION,
      null,
      success ? uc.STATUS_CODES.OK : uc.STATUS_CODES.UNAUTHORIZED
    );
  }

  #getDeviceState () {
    return {
      state: this.#state
    };
  }

  #getAvailableEntities () {
    // return list of entities
    return this.availableEntities.getEntities();
  }

  async #subscribeEvents (entities) {
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

  async #unSubscribeEvents (entities) {
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

  #getEntityStates () {
    // simply return entity states from configured entities
    return this.configuredEntities.getStates();
  }

  async #entityCommand (wsId, reqId, data) {
    const wsHandle = { wsId, reqId };
    // emit event, so the driver can act on it
    this.emit(
      uc.MESSAGES.ENTITY_COMMAND,
      wsHandle,
      data.entity_id,
      data.entity_type,
      data.cmd_id,
      data.params
    );
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  getDriverVersion () {
    return {
      name: this.#driverInfo.name.en,
      version: {
        api: this.#driverInfo.min_core_api,
        driver: this.#driverInfo.version
      }
    };
  }

  async setDeviceState (state) {
    this.#state = state;

    await this.#sendEvent(
      uc.EVENTS.DEVICE_STATE,
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
  async acknowledgeCommand (wsHandle, statusCode = uc.STATUS_CODES.OK) {
    await this.#sendResponse(wsHandle.wsId, wsHandle.reqId, 'result', null, statusCode);
  }
}

module.exports = new IntegrationAPI();
module.exports.DEVICE_STATES = uc.DEVICE_STATES;
module.exports.EVENTS = uc.EVENTS;
module.exports.STATUS_CODES = uc.STATUS_CODES;
module.exports.Entities = Entities;
