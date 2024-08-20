/**
 * Climate-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");
const log = require("../loggers");

/**
 * Climate entity states.
 *
 * @type {{HEAT: string, AUTO: string, FAN: string, COOL: string, UNAVAILABLE: string, UNKNOWN: string, OFF: string, HEAT_COOL: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  OFF: "OFF",
  HEAT: "HEAT",
  COOL: "COOL",
  HEAT_COOL: "HEAT_COOL",
  FAN: "FAN",
  AUTO: "AUTO"
};

/**
 * Climate entity features.
 *
 * @type {{HEAT: string, FAN: string, TARGET_TEMPERATURE: string, CURRENT_TEMPERATURE: string, COOL: string, ON_OFF: string, TARGET_TEMPERATURE_RANGE: string}}
 */
const FEATURES = {
  ON_OFF: "on_off",
  HEAT: "heat",
  COOL: "cool",
  CURRENT_TEMPERATURE: "current_temperature",
  TARGET_TEMPERATURE: "target_temperature",
  TARGET_TEMPERATURE_RANGE: "target_temperature_range",
  FAN: "fan"
};

/**
 * Climate entity attributes.
 *
 * @type {{TARGET_TEMPERATURE: string, CURRENT_TEMPERATURE: string, STATE: string, TARGET_TEMPERATURE_HIGH: string, TARGET_TEMPERATURE_LOW: string, FAN_MODE: string}}
 */
const ATTRIBUTES = {
  STATE: "state",
  CURRENT_TEMPERATURE: "current_temperature",
  TARGET_TEMPERATURE: "target_temperature",
  TARGET_TEMPERATURE_HIGH: "target_temperature_high",
  TARGET_TEMPERATURE_LOW: "target_temperature_low",
  FAN_MODE: "fan_mode"
};

/**
 * Climate entity commands.
 *
 * @type {{TARGET_TEMPERATURE: string, OFF: string, HVAC_MODE: string, TARGET_TEMPERATURE_RANGE: string, ON: string, FAN_MODE: string}}
 */
const COMMANDS = {
  ON: "on",
  OFF: "off",
  HVAC_MODE: "hvac_mode",
  TARGET_TEMPERATURE: "target_temperature",
  TARGET_TEMPERATURE_RANGE: "target_temperature_range",
  FAN_MODE: "fan_mode"
};

/**
 * Climate entity device classes.
 *
 * @type {{}}
 */
const DEVICECLASSES = {};

/**
 * Climate entity options.
 *
 * @type {{MIN_TEMPERATURE: string, TARGET_TEMPERATURE_STEP: string, FAN_MODES: string, TEMPERATURE_UNIT: string, MAX_TEMPERATURE: string}}
 */
const OPTIONS = {
  TEMPERATURE_UNIT: "temperature_unit",
  TARGET_TEMPERATURE_STEP: "target_temperature_step",
  MAX_TEMPERATURE: "max_temperature",
  MIN_TEMPERATURE: "min_temperature",
  FAN_MODES: "fan_modes"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_climate.md climate entity documentation}
 * for more information.
 */
class Climate extends Entity {
  /**
   * Constructs a new climate entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity.
   *        Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {Object} [params] Entity parameters.
   * @param {string[]} [params.features] Entity features.
   * @param {Map|Object} [params.attributes] Entity attributes holding the current states.
   * @param {string} [params.deviceClass] Device class.
   * @param {object} [params.options] Further options. See entity documentation.
   * @param {string} [params.area] Area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} [params.cmdHandler]
   *        Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, { features, attributes, deviceClass, options, area, cmdHandler } = {}) {
    super(id, name, Entity.TYPES.CLIMATE, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Climate entity created with id: ${this.id}`);
  }
}

module.exports = Climate;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
