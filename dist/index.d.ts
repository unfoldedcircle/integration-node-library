import { EventEmitter } from 'events';

declare enum STATUS_CODES {
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
/**
 * Driver setup request base class.
 */
declare class SetupDriver {
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
declare class DriverSetupRequest extends SetupDriver {
    reconfigure: boolean;
    setupData: {
        [key: string]: string;
    };
    constructor(reconfigure: boolean, setupData: {
        [key: string]: string;
    });
}
/**
 * Provide requested driver setup data to the integration driver in a setup process.
 */
declare class UserDataResponse extends SetupDriver {
    inputValues: {
        [key: string]: string;
    };
    constructor(inputValues: {
        [key: string]: string;
    });
}
/**
 * Setup action response base class.
 */
declare class SetupAction {
}

type CommandHandler = (entity: Entity, command: string, params?: Record<string, string | object | unknown>) => Promise<string>;
interface EntityParams {
    features?: string[];
    attributes?: object | Map<string, string | object> | Record<string, object | undefined | string | number | boolean> | null;
    deviceClass?: string;
    options?: Record<string, object | undefined | string | number | boolean> | null;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
declare class Entity {
    id: string;
    name: string | Record<string, string>;
    entity_type: string;
    device_id: string | null;
    features: string[];
    attributes: Record<string, object | string | number | undefined | boolean>;
    device_class?: string;
    options: Record<string, object | undefined | string | number | boolean> | null;
    area?: string;
    private cmdHandler?;
    /**
     * Constructs a new entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity. Either a string or an object containing multiple language strings.
     * @param entityType One of the defined entity types.
     * @param params Entity parameters.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, entityType: string, { features, attributes, deviceClass, options, area, cmdHandler }?: EntityParams);
    /**
     * Set callback handler for entity command requests.
     * @param cmdHandler Callback handler for entity commands.
     */
    setCmdHandler(cmdHandler: CommandHandler | null): void;
    /**
     * @return true if a callback handler for entity commands has been installed.
     */
    get hasCmdHandler(): boolean;
    /**
     * Execute entity command with the installed command handler.
     *
     * Returns NOT_IMPLEMENTED if no command handler is installed.
     * @param cmdId the command
     * @param params optional command parameters
     * @return command status code to acknowledge to UC Remote
     */
    command(cmdId: string, params?: Record<string, string>): Promise<string>;
}

/**
 * Entity pools for available and configured entities during runtime.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

declare class Entities extends EventEmitter {
    id: string;
    private storage;
    constructor(id: string);
    contains(id: string): boolean;
    getEntity(id: string): Entity | null;
    addEntity(entity: Entity): boolean;
    removeEntity(id: string): boolean;
    /**
     * Update or merge the provided attributes into an entity.
     *
     * @param {string} id The entity_id
     * @param {Map<string, any> | Record<string, any>} attributes The attributes to merge into the entity's attributes
     * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
     */
    updateEntityAttributes(id: string, attributes: Map<string, object | number | string> | Record<string, object | number | string>): boolean;
    getEntities(): Array<Record<string, object | string | null | undefined>>;
    getStates(): Array<Record<string, object | string | null | undefined>>;
    clear(): void;
}

/**
 * Integration driver API for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

declare class IntegrationAPI extends EventEmitter {
    #private;
    private configDirPath;
    private driverPath;
    private driverInfo;
    private state;
    private server;
    private clients;
    private setupHandler;
    private availableEntities;
    private configuredEntities;
    constructor();
    /**
     * Initialize the library
     * @param {string|object} driverConfig either a string to specify the driver configuration file path, or an object holding the configuration
     * @param setupHandler optional driver setup handler if the driver metadata contains a setup_data_schema object
     */
    init(driverConfig: string | object, setupHandler?: (msg: DriverSetupRequest | UserDataResponse) => Promise<SetupAction>): void;
    getConfigDirPath(): string;
    getDriverVersion(): {
        name: string;
        version: {
            api: string | null;
            driver: string;
        };
    };
    setDeviceState(state: any): Promise<void>;
    /**
     * Acknowledge a received command event it was successfully executed or not.
     *
     * @param {Object} wsHandle The WebSocket handle received in the ENTITY_COMMAND event.
     * @param {Number} statusCode The status code. Defaults to OK 200.
     */
    acknowledgeCommand(wsHandle: {
        wsId: any;
        reqId: any;
    }, statusCode?: STATUS_CODES): Promise<void>;
    /**
     * Send a setup progress message during the driver setup flow.
     *
     * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
     */
    driverSetupProgress(wsHandle: any): Promise<void>;
    /**
     * Request a user confirmation during the driver setup flow.
     *
     * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
     * @param {string|Map} title A human-readable title of the request screen. Either a string, which will be mapped to english, or a Map containing multiple language strings.
     * @param {string|Map} msg1 The optional message to display in the request screen. Either a string or a language map.
     * @param {string} image An optional base64 encoded image to display below `msg1`.
     * @param {string|Map} msg2 An optional message to display in the request screen below `msg1` or `image`. Either a string or a language map.
     */
    requestDriverSetupUserConfirmation(wsHandle: {
        wsId: any;
        reqId?: any;
    }, title: string | Map<string, string> | {
        [key: string]: string;
    }, msg1: string, image: undefined, msg2: string): Promise<void>;
    /**
     * Request user input during the driver setup flow.
     *
     * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
     * @param {string|Map<string, string>|Object<string, string>} title A human-readable title of the request screen. Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
     * @param {Array<object>} settings Array of input field definition objects. See Integration-API specification.
     */
    requestDriverSetupUserInput(wsHandle: {
        wsId: any;
        reqId?: any;
    }, title: string | Map<string, string> | {
        [key: string]: string;
    }, settings: {
        [key: string]: any;
    }[]): Promise<void>;
    /**
     * Confirm successful setup flow completion.
     *
     * Further setup flow messages will be ignored by the Remote.
     *
     * @param {string} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
     */
    driverSetupComplete(wsHandle: string): Promise<void>;
    /**
     * Set the driver setup flow as failed.
     *
     * Further setup flow messages will be ignored by the Remote.
     *
     * @param {Object} wsHandle The WebSocket handle received in the `EVENTS.SETUP_DRIVER` event.
     * @param {string} error The error reason. TODO create enum.
     */
    driverSetupError(wsHandle: {
        wsId: any;
        id?: any;
        reqId?: any;
    }, error?: string): Promise<void>;
    getConfiguredEntities(): Entities;
    getAvailableEntities(): Entities;
    addEntity(entity: Entity): void;
    clearAvailableEntities(): void;
    clearConfiguredEntities(): void;
    updateEntityAttributes(entityId: string, attributes: Map<string, any> | Record<string, any>): boolean;
}
declare const _default: IntegrationAPI;

export { _default as default };
