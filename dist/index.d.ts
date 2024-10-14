/**
 * Integration driver API for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { EventEmitter } from "events";
import * as uc from "./lib/api_definitions.js";
import Entities, { Entity } from "./lib/entities/entities.js";
import { SetupAction, DriverSetupRequest, UserDataResponse } from './lib/api_definitions.js';
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
    }, statusCode?: uc.STATUS_CODES): Promise<void>;
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
export default _default;
