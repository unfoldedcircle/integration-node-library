/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import { toLanguageObject } from "../utils.js";
import Entity from "./entity.js";
import log from "../loggers.js";
/**
 * Light entity states.
 */
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["ON"] = "ON";
    STATES["OFF"] = "OFF";
})(STATES || (STATES = {}));
/**
 * Light entity features.
 */
var FEATURES;
(function (FEATURES) {
    FEATURES["ON_OFF"] = "on_off";
    FEATURES["TOGGLE"] = "toggle";
    FEATURES["DIM"] = "dim";
    FEATURES["COLOR"] = "color";
    FEATURES["COLOR_TEMPERATURE"] = "color_temperature";
})(FEATURES || (FEATURES = {}));
/**
 * Light entity attributes.
 */
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
    ATTRIBUTES["HUE"] = "hue";
    ATTRIBUTES["SATURATION"] = "saturation";
    ATTRIBUTES["BRIGHTNESS"] = "brightness";
    ATTRIBUTES["COLOR_TEMPERATURE"] = "color_temperature";
})(ATTRIBUTES || (ATTRIBUTES = {}));
/**
 * Light entity commands.
 */
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["ON"] = "on";
    COMMANDS["OFF"] = "off";
    COMMANDS["TOGGLE"] = "toggle";
})(COMMANDS || (COMMANDS = {}));
/**
 * Light entity device classes.
 */
const DEVICECLASSES = {};
/**
 * Light entity options.
 */
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["COLOR_TEMPERATURE_STEPS"] = "color_temperature_steps";
})(OPTIONS || (OPTIONS = {}));
/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_light.md light entity documentation}
 * for more information.
 */
class Light extends Entity {
    /**
     * Constructs a new light entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {LightParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features = [], attributes = {}, deviceClass, options = null, area } = {}) {
        super(id, toLanguageObject(name), ENTITYTYPES.LIGHT, { features, attributes, deviceClass, options, area });
        log.debug(`Light entity created with id: ${this.id}`);
    }
}
export default Light;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
