/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");

/**
 * Switch entity states.
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
 * Switch entity features.
 *
 * @type {{TOGGLE: string, ON_OFF: string}}
 */
const FEATURES = {
  ON_OFF: "on_off",
  TOGGLE: "toggle"
};

/**
 * Switch entity attributes.
 *
 * @type {{STATE: string}}
 */
const ATTRIBUTES = {
  STATE: "state"
};

/**
 * Switch entity commands.
 *
 * @type {{TOGGLE: string, OFF: string, ON: string}}
 */
const COMMANDS = {
  ON: "on",
  OFF: "off",
  TOGGLE: "toggle"
};

/**
 * Switch entity device classes.
 *
 * @type {{SWITCH: string, OUTLET: string}}
 */
const DEVICECLASSES = {
  OUTLET: "outlet",
  SWITCH: "switch"
};

/**
 * Switch entity options.
 *
 * @type {{READABLE: string}}
 */
const OPTIONS = { READABLE: "readable" };

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
class Switch extends Entity {
  /**
   * Constructs a new switch entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} [deviceClass] Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} [area] Optional area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} cmdHandler Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, features, attributes, deviceClass, options = null, area, cmdHandler = null) {
    super(id, name, Entity.TYPES.SWITCH, { features, attributes, deviceClass, options, area, cmdHandler });

    console.debug(`Switch entity created with id: ${this.id}`);
  }
}

module.exports = Switch;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
