/**
 * Button-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");

/**
 * Button entity states.
 *
 * @type {{AVAILABLE: string, UNAVAILABLE: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  AVAILABLE: "AVAILABLE"
};

/**
 * Button entity attributes.
 *
 * @type {{STATE: string}}
 */
const ATTRIBUTES = {
  STATE: "state"
};

/**
 * Button commands.
 *
 * @type {{PUSH: string}}
 */
const COMMANDS = {
  PUSH: "push"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_button.md button entity documentation}
 * for more information.
 */
class Button extends Entity {
  /**
   * Constructs a new button entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {string} [area] Optional area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} cmdHandler Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, area, cmdHandler = null) {
    super(id, name, Entity.TYPES.BUTTON, {
      features: ["press"],
      attributes: new Map([[ATTRIBUTES.STATE, STATES.AVAILABLE]]),
      area,
      cmdHandler
    });

    console.debug(`Button entity created with id: ${this.id}`);
  }
}

module.exports = Button;
module.exports.STATES = STATES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
