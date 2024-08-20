/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");
const log = require("../loggers");

/**
 * Light entity states.
 *
 * @type {{UNAVAILABLE: string, UNKNOWN: string, OFF: string, ON: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  ON: "ON",
  OFF: "OFF"
};

/**
 * Light entity features.
 *
 * @type {{TOGGLE: string, COLOR: string, ON_OFF: string, DIM: string, COLOR_TEMPERATURE: string}}
 */
const FEATURES = {
  ON_OFF: "on_off",
  TOGGLE: "toggle",
  DIM: "dim",
  COLOR: "color",
  COLOR_TEMPERATURE: "color_temperature"
};

/**
 * Light entity attributes.
 *
 * @type {{STATE: string, HUE: string, COLOR_TEMPERATURE: string, BRIGHTNESS: string, SATURATION: string}}
 */
const ATTRIBUTES = {
  STATE: "state",
  HUE: "hue",
  SATURATION: "saturation",
  BRIGHTNESS: "brightness",
  COLOR_TEMPERATURE: "color_temperature"
};

/**
 * Light entity commands.
 *
 * @type {{TOGGLE: string, OFF: string, ON: string}}
 */
const COMMANDS = {
  ON: "on",
  OFF: "off",
  TOGGLE: "toggle"
};

/**
 * Light entity device classes.
 * @type {{}}
 */
const DEVICECLASSES = {};

/**
 * Light entity options.
 *
 * @type {{COLOR_TEMPERATURE_STEPS: string}}
 */
const OPTIONS = { COLOR_TEMPERATURE_STEPS: "color_temperature_steps" };

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_light.md light entity documentation}
 * for more information.
 */
class Light extends Entity {
  /**
   * Constructs a new light entity.
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
    super(id, name, Entity.TYPES.LIGHT, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Light entity created with id: ${this.id}`);
  }
}

module.exports = Light;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
