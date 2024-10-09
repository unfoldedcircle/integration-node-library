/**
 * Integration driver API definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

// Define device states
enum DEVICE_STATES {
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR"
}

// Define status codes
enum STATUS_CODES {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  TIMEOUT = 408,
  CONFLICT = 409,
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503
}

// Define request/response messages
enum MESSAGES {
  AUTHENTICATION = "authentication",
  GET_DRIVER_VERSION = "get_driver_version",
  GET_DEVICE_STATE = "get_device_state",
  GET_AVAILABLE_ENTITIES = "get_available_entities",
  GET_ENTITY_STATES = "get_entity_states",
  SUBSCRIBE_EVENTS = "subscribe_events",
  UNSUBSCRIBE_EVENTS = "unsubscribe_events",
  ENTITY_COMMAND = "entity_command",
  GET_DRIVER_METADATA = "get_driver_metadata",
  SETUP_DRIVER = "setup_driver",
  SET_DRIVER_USER_DATA = "set_driver_user_data"
}

// Define event messages
enum MSG_EVENTS {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ENTER_STANDBY = "enter_standby",
  EXIT_STANDBY = "exit_standby",
  DRIVER_VERSION = "driver_version",
  DEVICE_STATE = "device_state",
  AVAILABLE_ENTITIES = "available_entities",
  ENTITY_STATES = "entity_states",
  ENTITY_CHANGE = "entity_change",
  DRIVER_METADATA = "driver_metadata",
  DRIVER_SETUP_CHANGE = "driver_setup_change",
  ABORT_DRIVER_SETUP = "abort_driver_setup"
}

enum EVENTS {
  ENTITY_COMMAND = "entity_command",
  ENTITY_ATTRIBUTES_UPDATED = "entity_attributes_updated",
  SUBSCRIBE_ENTITIES = "subscribe_entities",
  UNSUBSCRIBE_ENTITIES = "unsubscribe_entities",
  SETUP_DRIVER = "setup_driver",
  SETUP_DRIVER_USER_DATA = "setup_driver_user_data",
  SETUP_DRIVER_USER_CONFIRMATION = "setup_driver_user_confirmation",
  SETUP_DRIVER_ABORT = "setup_driver_abort",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ENTER_STANDBY = "enter_standby",
  EXIT_STANDBY = "exit_standby"
}

// Define event categories
enum EVENT_CATEGORY {
  DEVICE = "DEVICE",
  ENTITY = "ENTITY"
}

/**
 * More detailed error reason for `state: ERROR` condition.
 */
enum INTEGRATION_SETUP_ERROR {
  NONE = "NONE",
  NOT_FOUND = "NOT_FOUND",
  CONNECTION_REFUSED = "CONNECTION_REFUSED",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  TIMEOUT = "TIMEOUT",
  OTHER = "OTHER"
}

/**
 * Driver setup request base class.
 */
class SetupDriver {
  // Base class logic here
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
  reconfigure: boolean;
  setupData: { [key: string]: string };

  constructor(reconfigure: boolean, setupData: { [key: string]: string }) {
    super();
    this.reconfigure = reconfigure;
    this.setupData = setupData;
  }
}

/**
 * Provide requested driver setup data to the integration driver in a setup process.
 */
class UserDataResponse extends SetupDriver {
  inputValues: { [key: string]: string };

  constructor(inputValues: { [key: string]: string }) {
    super();
    this.inputValues = inputValues;
  }
}

/**
 * Provide user confirmation response to the integration driver in a setup process.
 */
class UserConfirmationResponse extends SetupDriver {
  confirm: boolean;

  constructor(confirm: boolean) {
    super();
    this.confirm = confirm;
  }
}

/**
 * Abort notification.
 */
class AbortDriverSetup extends SetupDriver {
  error: string;

  constructor(error: string) {
    super();
    this.error = error;
  }
}

/**
 * Setup action response base class.
 */
class SetupAction {
  // Base class logic here
}

/**
 * Setup action to request user input.
 */
class RequestUserInput extends SetupAction {
  title: string | Map<string, string> | { [key: string]: string };
  settings: Array<{ [key: string]: object | string }>;

  constructor(
    title: string | Map<string, string> | { [key: string]: string },
    settings: Array<{ [key: string]: object | string }>
  ) {
    super();
    this.title = title;
    this.settings = settings;
  }
}

/**
 * Setup action to request a user confirmation.
 * Create a new user confirmation request.
 * All text strings are either a simple string, which will be mapped to English, or a Map / Object containing multiple language strings.
 * @param {string | Map<string, string>|Object.<string, string>} title Confirmation page title of the request screen.
 * @param {string | Map<string, string>|Object.<string, string> | null} header Optional header text.
 * @param {string | null} image Optional base64 encoded image which will be shown between the header and footer texts.
 * @param {string | Map<string, string>|Object.<string, string> | null} footer Optional footer text.
 */
class RequestUserConfirmation extends SetupAction {
  title: string | Map<string, string> | { [key: string]: string };
  header?: string | Map<string, string> | { [key: string]: string };
  image?: string;
  footer?: string | Map<string, string> | { [key: string]: string };

  constructor(
    title: string | Map<string, string> | { [key: string]: string },
    header?: string | Map<string, string> | { [key: string]: string },
    image?: string,
    footer?: string | Map<string, string> | { [key: string]: string }
  ) {
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
  errorType: string;

  constructor(errorType: string = INTEGRATION_SETUP_ERROR.OTHER) {
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

export const setup = {
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

export {
  DEVICE_STATES,
  STATUS_CODES,
  MESSAGES,
  MSG_EVENTS,
  EVENTS,
  EVENT_CATEGORY,
  INTEGRATION_SETUP_ERROR,
  DriverSetupRequest,
  UserDataResponse,
  SetupAction
};
