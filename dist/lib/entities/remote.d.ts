/**
 * Remote-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { CommandHandler } from "./entity.js";
import { DeviceButtonMapping, EntityCommand, UiPage } from "./ui.js";
import Entity from "./entity.js";
interface RemoteParams {
    features?: string[];
    attributes?: Partial<Record<ATTRIBUTES, STATES>>;
    simpleCommands?: string[];
    buttonMapping?: Array<DeviceButtonMapping>;
    uiPages?: Array<UiPage>;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
/**
 * Remote entity states.
 */
declare enum STATES {
    UNAVAILABLE = "UNAVAILABLE",
    UNKNOWN = "UNKNOWN",
    ON = "ON",
    OFF = "OFF"
}
/**
 * Remote-entity features.
 */
declare enum FEATURES {
    ON_OFF = "on_off",
    TOGGLE = "toggle",
    SEND_CMD = "send_cmd"
}
/**
 * Remote-entity attributes.
 */
declare enum ATTRIBUTES {
    STATE = "state"
}
/**
 * Remote-entity commands.
 */
declare enum COMMANDS {
    ON = "on",
    OFF = "off",
    TOGGLE = "toggle",
    SEND_CMD = "send_cmd",
    SEND_CMD_SEQUENCE = "send_cmd_sequence"
}
/**
 * Remote-entity options.
 */
declare enum OPTIONS {
    SIMPLE_COMMANDS = "simple_commands",
    BUTTON_MAPPING = "button_mapping",
    USER_INTERFACE = "user_interface"
}
/**
 * Create a remote-entity send command.
 * @param command command to send.
 * @param params optional named parameters
 * @param params.delay optional delay in milliseconds after the command or between repeats.
 * @param params.repeat optional repeat count of the command.
 * @param params.hold optional hold time in milliseconds.
 * @return EntityCommand the created EntityCommand.
 * @throws AssertionError if command is not specified or is empty.
 */
declare function createSendCmd(command: string | undefined, { delay, repeat, hold }?: {
    delay?: number;
    repeat?: number;
    hold?: number;
}): EntityCommand;
/**
 * Create a remote send sequence command.
 * @param sequence list of simple commands. An empty array is not valid.
 * @param params optional named parameters
 * @param params.delay optional delay in milliseconds between the commands in the sequence.
 * @param params.repeat optional repeat count of the sequence.
 * @return EntityCommand the created EntityCommand.
 * @throws AssertionError if sequence is not specified or doesn't contain at least one command.
 */
declare function createSequenceCmd(sequence: string[] | undefined, { delay, repeat }?: {
    delay?: number;
    repeat?: number;
}): EntityCommand;
declare class Remote extends Entity {
    /**
     * Constructs a new remote-entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity.
     * @param params Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { features, attributes, simpleCommands, buttonMapping, uiPages, area, cmdHandler }?: RemoteParams);
}
export default Remote;
export { createSendCmd, createSequenceCmd, STATES, FEATURES, ATTRIBUTES, COMMANDS, OPTIONS };
