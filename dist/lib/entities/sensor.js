/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import Entity from "./entity.js";
import log from "../loggers.js";
/**
 * Sensor entity states.
 */
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["ON"] = "ON";
})(STATES || (STATES = {}));
/**
 * Sensor entity features.
 */
const FEATURES = {};
/**
 * Sensor entity attributes.
 */
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
    ATTRIBUTES["VALUE"] = "value";
    ATTRIBUTES["UNIT"] = "unit";
})(ATTRIBUTES || (ATTRIBUTES = {}));
/**
 * Sensor entity commands.
 */
const COMMANDS = {};
/**
 * Sensor entity device classes.
 */
var DEVICECLASSES;
(function (DEVICECLASSES) {
    DEVICECLASSES["CUSTOM"] = "custom";
    DEVICECLASSES["BATTERY"] = "battery";
    DEVICECLASSES["CURRENT"] = "current";
    DEVICECLASSES["ENERGY"] = "energy";
    DEVICECLASSES["HUMIDITY"] = "humidity";
    DEVICECLASSES["POWER"] = "power";
    DEVICECLASSES["TEMPERATURE"] = "temperature";
    DEVICECLASSES["VOLTAGE"] = "voltage";
})(DEVICECLASSES || (DEVICECLASSES = {}));
/**
 * Sensor entity options.
 */
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["CUSTOM_UNIT"] = "custom_unit";
    OPTIONS["NATIVE_UNIT"] = "native_unit";
    OPTIONS["DECIMALS"] = "decimals";
    OPTIONS["MIN_VALUE"] = "min_value";
    OPTIONS["MAX_VALUE"] = "max_value";
})(OPTIONS || (OPTIONS = {}));
class Sensor extends Entity {
    /**
     * Constructs a new sensor entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity.
     * @param params Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { attributes, deviceClass, options, area } = {}) {
        super(id, name, ENTITYTYPES.SENSOR, { attributes, deviceClass, options, area });
        log.debug(`Sensor entity created with id: ${this.id}`);
    }
}
export default Sensor;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
