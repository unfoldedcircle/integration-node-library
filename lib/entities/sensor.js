/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");
const log = require("../loggers");

/**
 * Sensor entity states.
 *
 * @type {{UNAVAILABLE: string, UNKNOWN: string, ON: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  ON: "ON"
};

/**
 * Sensor entity features.
 *
 * @type {{}}
 */
const FEATURES = {};

/**
 * Sensor entity attributes.
 *
 * @type {{UNIT: string, STATE: string, VALUE: string}}
 */
const ATTRIBUTES = {
  STATE: "state",
  VALUE: "value",
  UNIT: "unit"
};

/**
 * Sensor entity commands.
 *
 * @type {{}}
 */
const COMMANDS = {};

/**
 * Sensor entity device classes.
 *
 * @type {{BATTERY: string, ENERGY: string, VOLTAGE: string, HUMIDITY: string, TEMPERATURE: string, CUSTOM: string, POWER: string, CURRENT: string}}
 */
const DEVICECLASSES = {
  CUSTOM: "custom",
  BATTERY: "battery",
  CURRENT: "current",
  ENERGY: "energy",
  HUMIDITY: "humidity",
  POWER: "power",
  TEMPERATURE: "temperature",
  VOLTAGE: "voltage"
};

/**
 * Sensor entity options.
 *
 * @type {{CUSTOM_UNIT: string, DECIMALS: string, NATIVE_UNIT: string, MAX_VALUE: string, MIN_VALUE: string}}
 */
const OPTIONS = {
  CUSTOM_UNIT: "custom_unit",
  NATIVE_UNIT: "native_unit",
  DECIMALS: "decimals",
  MIN_VALUE: "min_value",
  MAX_VALUE: "max_value"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_sensor.md sensor entity documentation}
 * for more information.
 */
class Sensor extends Entity {
  /**
   * Constructs a new sensor entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity.
   *        Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {Object} [params] Entity parameters.
   * @param {Map|Object} [params.attributes] Entity attributes holding the current states.
   * @param {string} [params.deviceClass] Device class.
   * @param {object} [params.options] Further options. See entity documentation.
   * @param {string} [params.area] Area or room.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, { attributes, deviceClass, options, area } = {}) {
    super(id, name, Entity.TYPES.SENSOR, { attributes, deviceClass, options, area });

    log.debug(`Sensor entity created with id: ${this.id}`);
  }
}

module.exports = Sensor;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
