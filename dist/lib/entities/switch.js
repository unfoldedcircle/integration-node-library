/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import Entity from "./entity.js";
import log from "../loggers.js";
// Switch entity states
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["ON"] = "ON";
    STATES["OFF"] = "OFF";
})(STATES || (STATES = {}));
// Switch entity features
var FEATURES;
(function (FEATURES) {
    FEATURES["ON_OFF"] = "on_off";
    FEATURES["TOGGLE"] = "toggle";
})(FEATURES || (FEATURES = {}));
// Switch entity attributes
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
})(ATTRIBUTES || (ATTRIBUTES = {}));
// Switch entity commands
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["ON"] = "on";
    COMMANDS["OFF"] = "off";
    COMMANDS["TOGGLE"] = "toggle";
})(COMMANDS || (COMMANDS = {}));
// Switch entity device classes
var DEVICECLASSES;
(function (DEVICECLASSES) {
    DEVICECLASSES["OUTLET"] = "outlet";
    DEVICECLASSES["SWITCH"] = "switch";
})(DEVICECLASSES || (DEVICECLASSES = {}));
// Switch entity options
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["READABLE"] = "readable";
})(OPTIONS || (OPTIONS = {}));
/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
class Switch extends Entity {
    /**
     * Constructs a new switch entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {SwitchParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features, attributes, deviceClass, options, area, cmdHandler } = {}) {
        super(id, name, ENTITYTYPES.SWITCH, { features, attributes, deviceClass, options, area, cmdHandler });
        log.debug(`Switch entity created with id: ${this.id}`);
    }
}
export default Switch;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
