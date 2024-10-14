/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import Entity from "./entity.js";
/**
 * Sensor entity states.
 */
declare enum STATES {
    UNAVAILABLE = "UNAVAILABLE",
    UNKNOWN = "UNKNOWN",
    ON = "ON"
}
/**
 * Sensor entity features.
 */
declare const FEATURES: Record<string, boolean>;
/**
 * Sensor entity attributes.
 */
declare enum ATTRIBUTES {
    STATE = "state",
    VALUE = "value",
    UNIT = "unit"
}
/**
 * Sensor entity commands.
 */
declare const COMMANDS: Record<string, boolean>;
/**
 * Sensor entity device classes.
 */
declare enum DEVICECLASSES {
    CUSTOM = "custom",
    BATTERY = "battery",
    CURRENT = "current",
    ENERGY = "energy",
    HUMIDITY = "humidity",
    POWER = "power",
    TEMPERATURE = "temperature",
    VOLTAGE = "voltage"
}
/**
 * Sensor entity options.
 */
declare enum OPTIONS {
    CUSTOM_UNIT = "custom_unit",
    NATIVE_UNIT = "native_unit",
    DECIMALS = "decimals",
    MIN_VALUE = "min_value",
    MAX_VALUE = "max_value"
}
interface SensorParams {
    attributes?: Partial<Record<ATTRIBUTES, STATES | number | boolean | string>>;
    deviceClass?: DEVICECLASSES;
    options?: Partial<Record<OPTIONS, number | string | boolean>> | null;
    area?: string;
}
declare class Sensor extends Entity {
    /**
     * Constructs a new sensor entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity.
     * @param params Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { attributes, deviceClass, options, area }?: SensorParams);
}
export default Sensor;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
