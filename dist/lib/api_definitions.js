/**
 * Integration driver API definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
// Define device states
var DEVICE_STATES;
(function (DEVICE_STATES) {
    DEVICE_STATES["CONNECTED"] = "CONNECTED";
    DEVICE_STATES["CONNECTING"] = "CONNECTING";
    DEVICE_STATES["DISCONNECTED"] = "DISCONNECTED";
    DEVICE_STATES["ERROR"] = "ERROR";
})(DEVICE_STATES || (DEVICE_STATES = {}));
// Define status codes
var STATUS_CODES;
(function (STATUS_CODES) {
    STATUS_CODES[STATUS_CODES["OK"] = 200] = "OK";
    STATUS_CODES[STATUS_CODES["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    STATUS_CODES[STATUS_CODES["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    STATUS_CODES[STATUS_CODES["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUS_CODES[STATUS_CODES["TIMEOUT"] = 408] = "TIMEOUT";
    STATUS_CODES[STATUS_CODES["CONFLICT"] = 409] = "CONFLICT";
    STATUS_CODES[STATUS_CODES["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    STATUS_CODES[STATUS_CODES["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    STATUS_CODES[STATUS_CODES["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(STATUS_CODES || (STATUS_CODES = {}));
// Define request/response messages
var MESSAGES;
(function (MESSAGES) {
    MESSAGES["AUTHENTICATION"] = "authentication";
    MESSAGES["GET_DRIVER_VERSION"] = "get_driver_version";
    MESSAGES["GET_DEVICE_STATE"] = "get_device_state";
    MESSAGES["GET_AVAILABLE_ENTITIES"] = "get_available_entities";
    MESSAGES["GET_ENTITY_STATES"] = "get_entity_states";
    MESSAGES["SUBSCRIBE_EVENTS"] = "subscribe_events";
    MESSAGES["UNSUBSCRIBE_EVENTS"] = "unsubscribe_events";
    MESSAGES["ENTITY_COMMAND"] = "entity_command";
    MESSAGES["GET_DRIVER_METADATA"] = "get_driver_metadata";
    MESSAGES["SETUP_DRIVER"] = "setup_driver";
    MESSAGES["SET_DRIVER_USER_DATA"] = "set_driver_user_data";
})(MESSAGES || (MESSAGES = {}));
// Define event messages
var MSG_EVENTS;
(function (MSG_EVENTS) {
    MSG_EVENTS["CONNECT"] = "connect";
    MSG_EVENTS["DISCONNECT"] = "disconnect";
    MSG_EVENTS["ENTER_STANDBY"] = "enter_standby";
    MSG_EVENTS["EXIT_STANDBY"] = "exit_standby";
    MSG_EVENTS["DRIVER_VERSION"] = "driver_version";
    MSG_EVENTS["DEVICE_STATE"] = "device_state";
    MSG_EVENTS["AVAILABLE_ENTITIES"] = "available_entities";
    MSG_EVENTS["ENTITY_STATES"] = "entity_states";
    MSG_EVENTS["ENTITY_CHANGE"] = "entity_change";
    MSG_EVENTS["DRIVER_METADATA"] = "driver_metadata";
    MSG_EVENTS["DRIVER_SETUP_CHANGE"] = "driver_setup_change";
    MSG_EVENTS["ABORT_DRIVER_SETUP"] = "abort_driver_setup";
})(MSG_EVENTS || (MSG_EVENTS = {}));
var EVENTS;
(function (EVENTS) {
    EVENTS["ENTITY_COMMAND"] = "entity_command";
    EVENTS["ENTITY_ATTRIBUTES_UPDATED"] = "entity_attributes_updated";
    EVENTS["SUBSCRIBE_ENTITIES"] = "subscribe_entities";
    EVENTS["UNSUBSCRIBE_ENTITIES"] = "unsubscribe_entities";
    EVENTS["SETUP_DRIVER"] = "setup_driver";
    EVENTS["SETUP_DRIVER_USER_DATA"] = "setup_driver_user_data";
    EVENTS["SETUP_DRIVER_USER_CONFIRMATION"] = "setup_driver_user_confirmation";
    EVENTS["SETUP_DRIVER_ABORT"] = "setup_driver_abort";
    EVENTS["CONNECT"] = "connect";
    EVENTS["DISCONNECT"] = "disconnect";
    EVENTS["ENTER_STANDBY"] = "enter_standby";
    EVENTS["EXIT_STANDBY"] = "exit_standby";
})(EVENTS || (EVENTS = {}));
// Define event categories
var EVENT_CATEGORY;
(function (EVENT_CATEGORY) {
    EVENT_CATEGORY["DEVICE"] = "DEVICE";
    EVENT_CATEGORY["ENTITY"] = "ENTITY";
})(EVENT_CATEGORY || (EVENT_CATEGORY = {}));
/**
 * More detailed error reason for `state: ERROR` condition.
 */
var INTEGRATION_SETUP_ERROR;
(function (INTEGRATION_SETUP_ERROR) {
    INTEGRATION_SETUP_ERROR["NONE"] = "NONE";
    INTEGRATION_SETUP_ERROR["NOT_FOUND"] = "NOT_FOUND";
    INTEGRATION_SETUP_ERROR["CONNECTION_REFUSED"] = "CONNECTION_REFUSED";
    INTEGRATION_SETUP_ERROR["AUTHORIZATION_ERROR"] = "AUTHORIZATION_ERROR";
    INTEGRATION_SETUP_ERROR["TIMEOUT"] = "TIMEOUT";
    INTEGRATION_SETUP_ERROR["OTHER"] = "OTHER";
})(INTEGRATION_SETUP_ERROR || (INTEGRATION_SETUP_ERROR = {}));
/**
 * Driver setup request base class.
 */
class SetupDriver {
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
    reconfigure;
    setupData;
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
    inputValues;
    constructor(inputValues) {
        super();
        this.inputValues = inputValues;
    }
}
/**
 * Provide user confirmation response to the integration driver in a setup process.
 */
class UserConfirmationResponse extends SetupDriver {
    confirm;
    constructor(confirm) {
        super();
        this.confirm = confirm;
    }
}
/**
 * Abort notification.
 */
class AbortDriverSetup extends SetupDriver {
    error;
    constructor(error) {
        super();
        this.error = error;
    }
}
/**
 * Setup action response base class.
 */
class SetupAction {
}
/**
 * Setup action to request user input.
 */
class RequestUserInput extends SetupAction {
    title;
    settings;
    constructor(title, settings) {
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
}
/**
 * Setup action to abort setup process due to an error.
 */
class SetupError extends SetupAction {
    errorType;
    constructor(errorType = INTEGRATION_SETUP_ERROR.OTHER) {
        super();
        this.errorType = errorType;
    }
}
/**
 * Setup action to complete a successful setup process.
 */
class SetupComplete extends SetupAction {
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
export { DEVICE_STATES, STATUS_CODES, MESSAGES, MSG_EVENTS, EVENTS, EVENT_CATEGORY, INTEGRATION_SETUP_ERROR, DriverSetupRequest, UserDataResponse, SetupAction };
