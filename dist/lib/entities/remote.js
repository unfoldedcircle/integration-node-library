/**
 * Remote-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import { EntityCommand } from "./ui.js";
import Entity from "./entity.js";
import log from "../loggers.js";
import assert from "node:assert";
/**
 * Remote entity states.
 */
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["ON"] = "ON";
    STATES["OFF"] = "OFF";
})(STATES || (STATES = {}));
/**
 * Remote-entity features.
 */
var FEATURES;
(function (FEATURES) {
    FEATURES["ON_OFF"] = "on_off";
    FEATURES["TOGGLE"] = "toggle";
    FEATURES["SEND_CMD"] = "send_cmd";
})(FEATURES || (FEATURES = {}));
/**
 * Remote-entity attributes.
 */
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
})(ATTRIBUTES || (ATTRIBUTES = {}));
/**
 * Remote-entity commands.
 */
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["ON"] = "on";
    COMMANDS["OFF"] = "off";
    COMMANDS["TOGGLE"] = "toggle";
    COMMANDS["SEND_CMD"] = "send_cmd";
    COMMANDS["SEND_CMD_SEQUENCE"] = "send_cmd_sequence";
})(COMMANDS || (COMMANDS = {}));
/**
 * Remote-entity options.
 */
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["SIMPLE_COMMANDS"] = "simple_commands";
    OPTIONS["BUTTON_MAPPING"] = "button_mapping";
    OPTIONS["USER_INTERFACE"] = "user_interface";
})(OPTIONS || (OPTIONS = {}));
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
function createSendCmd(command, { delay, repeat, hold } = {}) {
    assert(command && typeof command === "string" && command.length > 0, "command must be a string and may not be empty");
    const params = { command };
    if (typeof delay === "number") {
        params.delay = delay;
    }
    if (typeof repeat === "number") {
        params.repeat = repeat;
    }
    if (typeof hold === "number") {
        params.hold = hold;
    }
    return new EntityCommand(COMMANDS.SEND_CMD, params);
}
/**
 * Create a remote send sequence command.
 * @param sequence list of simple commands. An empty array is not valid.
 * @param params optional named parameters
 * @param params.delay optional delay in milliseconds between the commands in the sequence.
 * @param params.repeat optional repeat count of the sequence.
 * @return EntityCommand the created EntityCommand.
 * @throws AssertionError if sequence is not specified or doesn't contain at least one command.
 */
function createSequenceCmd(sequence, { delay, repeat } = {}) {
    assert(sequence && Array.isArray(sequence) && sequence.length > 0, "sequence array must be specified and contain at least one command");
    const params = { sequence };
    if (typeof delay === "number") {
        params.delay = delay;
    }
    if (typeof repeat === "number") {
        params.repeat = repeat;
    }
    return new EntityCommand(COMMANDS.SEND_CMD_SEQUENCE, params);
}
class Remote extends Entity {
    /**
     * Constructs a new remote-entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity.
     * @param params Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features = [], attributes = {}, simpleCommands, buttonMapping, uiPages, area, cmdHandler } = {}) {
        const options = {};
        if (simpleCommands) {
            options[OPTIONS.SIMPLE_COMMANDS] = simpleCommands;
        }
        if (buttonMapping) {
            options[OPTIONS.BUTTON_MAPPING] = buttonMapping;
        }
        if (uiPages) {
            options[OPTIONS.USER_INTERFACE] = { pages: uiPages };
        }
        super(id, name, ENTITYTYPES.REMOTE, { features, attributes, options, area, cmdHandler });
        log.debug(`Remote entity created with id: ${this.id}`);
    }
}
export default Remote;
export { createSendCmd, createSequenceCmd, STATES, FEATURES, ATTRIBUTES, COMMANDS, OPTIONS };
