/**
 * Climate-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import Entity from "./entity.js";
import log from "../loggers.js";
// Climate entity states
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["OFF"] = "OFF";
    STATES["HEAT"] = "HEAT";
    STATES["COOL"] = "COOL";
    STATES["HEAT_COOL"] = "HEAT_COOL";
    STATES["FAN"] = "FAN";
    STATES["AUTO"] = "AUTO";
})(STATES || (STATES = {}));
// Climate entity features
var FEATURES;
(function (FEATURES) {
    FEATURES["ON_OFF"] = "on_off";
    FEATURES["HEAT"] = "heat";
    FEATURES["COOL"] = "cool";
    FEATURES["CURRENT_TEMPERATURE"] = "current_temperature";
    FEATURES["TARGET_TEMPERATURE"] = "target_temperature";
    FEATURES["TARGET_TEMPERATURE_RANGE"] = "target_temperature_range";
    FEATURES["FAN"] = "fan";
})(FEATURES || (FEATURES = {}));
// Climate entity attributes
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
    ATTRIBUTES["CURRENT_TEMPERATURE"] = "current_temperature";
    ATTRIBUTES["TARGET_TEMPERATURE"] = "target_temperature";
    ATTRIBUTES["TARGET_TEMPERATURE_HIGH"] = "target_temperature_high";
    ATTRIBUTES["TARGET_TEMPERATURE_LOW"] = "target_temperature_low";
    ATTRIBUTES["FAN_MODE"] = "fan_mode";
})(ATTRIBUTES || (ATTRIBUTES = {}));
// Climate entity commands
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["ON"] = "on";
    COMMANDS["OFF"] = "off";
    COMMANDS["HVAC_MODE"] = "hvac_mode";
    COMMANDS["TARGET_TEMPERATURE"] = "target_temperature";
    COMMANDS["TARGET_TEMPERATURE_RANGE"] = "target_temperature_range";
    COMMANDS["FAN_MODE"] = "fan_mode";
})(COMMANDS || (COMMANDS = {}));
// Climate entity device classes
var DEVICECLASSES;
(function (DEVICECLASSES) {
})(DEVICECLASSES || (DEVICECLASSES = {}));
// Climate entity options
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["TEMPERATURE_UNIT"] = "temperature_unit";
    OPTIONS["TARGET_TEMPERATURE_STEP"] = "target_temperature_step";
    OPTIONS["MAX_TEMPERATURE"] = "max_temperature";
    OPTIONS["MIN_TEMPERATURE"] = "min_temperature";
    OPTIONS["FAN_MODES"] = "fan_modes";
})(OPTIONS || (OPTIONS = {}));
class Climate extends Entity {
    /**
     * Constructs a new climate entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {ClimateParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features = [], attributes = {}, deviceClass, options = null, area, cmdHandler } = {}) {
        super(id, name, ENTITYTYPES.CLIMATE, { features, attributes, deviceClass, options, area, cmdHandler });
        log.debug(`Climate entity created with id: ${this.id}`);
    }
}
export default Climate;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
