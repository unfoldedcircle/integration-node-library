/**
 * Integration driver API definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

// TODO a proper enum is reason enough to switch to TS...

const DEVICE_STATES = {
  CONNECTED: "CONNECTED",
  CONNECTING: "CONNECTING",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR"
};

module.exports.DEVICE_STATES = DEVICE_STATES;

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
};

module.exports.STATUS_CODES = STATUS_CODES;

/**
 * WebSocket integration API request / response messages.
 *
 * @type {Readonly<{GET_ENTITY_STATES: string, SUBSCRIBE_EVENTS: string, GET_DEVICE_STATE: string, AUTHENTICATION: string, GET_AVAILABLE_ENTITIES: string, GET_DRIVER_VERSION: string, UNSUBSCRIBE_EVENTS: string, ENTITY_COMMAND: string, SETUP_DRIVER: string, GET_DRIVER_METADATA: string, SET_DRIVER_USER_DATA: string}>}
 */
const MESSAGES = Object.freeze({
  AUTHENTICATION: "authentication",
  GET_DRIVER_VERSION: "get_driver_version",
  GET_DEVICE_STATE: "get_device_state",
  GET_AVAILABLE_ENTITIES: "get_available_entities",
  GET_ENTITY_STATES: "get_entity_states",
  SUBSCRIBE_EVENTS: "subscribe_events",
  UNSUBSCRIBE_EVENTS: "unsubscribe_events",
  ENTITY_COMMAND: "entity_command",
  GET_DRIVER_METADATA: "get_driver_metadata",
  SETUP_DRIVER: "setup_driver",
  SET_DRIVER_USER_DATA: "set_driver_user_data"
});

module.exports.MESSAGES = MESSAGES;

/**
 * WebSocket integration API event messages.
 *
 * @type {Readonly<{ENTER_STANDBY: string, EXIT_STANDBY: string, ABORT_DRIVER_SETUP: string, DRIVER_VERSION: string, ENTITY_STATES: string, DRIVER_METADATA: string, ENTITY_CHANGE: string, DRIVER_SETUP_CHANGE: string, AVAILABLE_ENTITIES: string, CONNECT: string, DISCONNECT: string, DEVICE_STATE: string}>}
 */
const MSG_EVENTS = Object.freeze({
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ENTER_STANDBY: "enter_standby",
  EXIT_STANDBY: "exit_standby",
  DRIVER_VERSION: "driver_version",
  DEVICE_STATE: "device_state",
  AVAILABLE_ENTITIES: "available_entities",
  ENTITY_STATES: "entity_states",
  ENTITY_CHANGE: "entity_change",
  DRIVER_METADATA: "driver_metadata",
  DRIVER_SETUP_CHANGE: "driver_setup_change",
  ABORT_DRIVER_SETUP: "abort_driver_setup"
});

module.exports.MSG_EVENTS = MSG_EVENTS;

/**
 * Library events.
 *
 * ⚠️ The following events are deprecated and will be removed at the end of 2024:
 * - `ENTITY_COMMAND`: use entity command callback handler instead.
 * - `SETUP_DRIVER, SETUP_DRIVER_USER_DATA, SETUP_DRIVER_USER_CONFIRMATION, SETUP_DRIVER_ABORT`:
 *    use setup callback handler instead. See init method.
 *
 * @type {Readonly<{SETUP_DRIVER_ABORT: symbol, ENTITY_ATTRIBUTES_UPDATED: symbol, ENTITY_COMMAND: symbol, SETUP_DRIVER: symbol, SUBSCRIBE_ENTITIES: symbol, SETUP_DRIVER_USER_DATA: symbol, CONNECT: symbol, UNSUBSCRIBE_ENTITIES: symbol, SETUP_DRIVER_USER_CONFIRMATION: symbol, DISCONNECT: symbol,  ENTER_STANDBY: symbol,  EXIT_STANDBY: symbol}>}
 */
const EVENTS = Object.freeze({
  /**
   * @deprecated use entity command callback handler instead.
   */
  ENTITY_COMMAND: Symbol("entity_command"),
  ENTITY_ATTRIBUTES_UPDATED: Symbol("entity_attributes_updated"),
  SUBSCRIBE_ENTITIES: Symbol("subscribe_entities"),
  UNSUBSCRIBE_ENTITIES: Symbol("unsubscribe_entities"),
  /**
   * @deprecated use setup callback handler instead. See init method.
   */
  SETUP_DRIVER: Symbol("setup_driver"),
  /**
   * @deprecated use setup callback handler instead. See init method.
   */
  SETUP_DRIVER_USER_DATA: Symbol("setup_driver_user_data"),
  /**
   * @deprecated use setup callback handler instead. See init method.
   */
  SETUP_DRIVER_USER_CONFIRMATION: Symbol("setup_driver_user_confirmation"),
  /**
   * @deprecated use setup callback handler instead. See init method.
   */
  SETUP_DRIVER_ABORT: Symbol("setup_driver_abort"),
  CONNECT: Symbol("connect"),
  DISCONNECT: Symbol("disconnect"),
  ENTER_STANDBY: Symbol("enter_standby"),
  EXIT_STANDBY: Symbol("exit_standby")
});

module.exports.EVENTS = EVENTS;

const EVENT_CATEGORY = Object.freeze({
  DEVICE: "DEVICE",
  ENTITY: "ENTITY"
});

module.exports.EVENT_CATEGORY = EVENT_CATEGORY;

/**
 * More detailed error reason for `state: ERROR` condition.
 */
class IntegrationSetupError {
  static NONE = "NONE";
  static NOT_FOUND = "NOT_FOUND";
  static CONNECTION_REFUSED = "CONNECTION_REFUSED";
  static AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR";
  static TIMEOUT = "TIMEOUT";
  static OTHER = "OTHER";
}

/**
 * Driver setup request base class.
 */
class SetupDriver {
  // Base class for setup requests
}

/**
 * Start driver setup.
 *
 * If a driver includes a `setup_data_schema` object in its driver metadata, it enables the dynamic
 * driver setup process.
 *
 * The `reconfigure` flag indicates if the user wants to reconfigure an already configured driver in the Remote.
 * It's up to the driver on how to handle a reconfiguration request and run a different logic. For example, this
 * allows to show an options screen to change certain values, or present the option to modify, add or delete
 * provided device entities.
 *
 * The `setupData` parameter holds the user input result of a SettingsPage as key values.
 * - key: id of the field
 * - value: entered user value as string. This is either the entered text or number, selected checkbox state or the
 *          selected dropdown item id.
 *
 * ⚠️ Non-native string values as numbers or booleans are represented as string values!
 *
 * The integration driver has to respond with one of the following action objects:
 * - `RequestUserInput`: request a user input
 * - `RequestUserConfirmation`: request a user confirmation
 * - `SetupComplete` finishes the setup process and the UC Remote creates an integration instance.
 * - `SetupError` aborts the setup process.
 */
class DriverSetupRequest extends SetupDriver {
  /**
   * @param {boolean} reconfigure If set to `true`: reconfigure an already configured driver.
   * @param {Object.<string, string>} setupData User input result of a SettingsPage as key values.
   */
  constructor(reconfigure, setupData) {
    super();
    this.reconfigure = reconfigure;
    this.setupData = setupData;
  }
}

/**
 * Provide requested driver setup data to the integration driver in a setup process.
 */
class UserDataResponse extends SetupDriver {
  /**
   * @param {Object.<string, string>} inputValues User input result of a SettingsPage as key values.
   */
  constructor(inputValues) {
    super();
    this.inputValues = inputValues;
  }
}

/**
 * Provide user confirmation response to the integration driver in a setup process.
 */
class UserConfirmationResponse extends SetupDriver {
  /**
   * @param {boolean} confirm User confirmation
   */
  constructor(confirm) {
    super();
    this.confirm = confirm;
  }
}

/**
 * Abort notification.
 */
class AbortDriverSetup extends SetupDriver {
  /**
   * @param {string} error one of the defined errors in {@link IntegrationSetupError}
   */
  constructor(error) {
    super();
    this.error = error;
  }
}

/**
 * Setup action response base class.
 */
class SetupAction {
  // Base class for setup actions
}

/**
 * Setup action to request user input.
 */
class RequestUserInput extends SetupAction {
  /**
   * @param {string | Map<string, string>|Object.<string, string>} title Confirmation page title of the request screen.
   * @param {Array.<Object.<string, any>>} settings Settings page definition. See Integration-API for all options.
   */
  constructor(title, settings) {
    super();
    this.title = title;
    this.settings = settings;
  }
}

/**
 * Setup action to request a user confirmation.
 */
class RequestUserConfirmation extends SetupAction {
  /**
   * Create a new user confirmation request.
   * All text strings are either a simple string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {string | Map<string, string>|Object.<string, string>} title Confirmation page title of the request screen.
   * @param {string | Map<string, string>|Object.<string, string> | null} header Optional header text.
   * @param {string | null} image Optional base64 encoded image which will be shown between the header and footer texts.
   * @param {string | Map<string, string>|Object.<string, string> | null} footer Optional footer text.
   */
  constructor(title, header = null, image = null, footer = null) {
    super();
    this.title = title;
    this.header = header;
    this.image = image;
    this.footer = footer;
  }
}

/**
 * Setup action to abort setup process due to an error.
 */
class SetupError extends SetupAction {
  /**
   * @param {string} [errorType=IntegrationSetupError.OTHER] one of the defined errors in {@link IntegrationSetupError}
   */
  constructor(errorType = IntegrationSetupError.OTHER) {
    super();
    this.errorType = errorType;
  }
}

/**
 * Setup action to complete a successful setup process.
 */
class SetupComplete extends SetupAction {
  // Marks setup as complete
}

module.exports.setup = {
  IntegrationSetupError,
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
