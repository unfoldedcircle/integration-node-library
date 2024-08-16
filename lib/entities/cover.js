/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");

/**
 * Cover entity states.
 *
 * @type {{CLOSING: string, CLOSED: string, OPENING: string, UNAVAILABLE: string, UNKNOWN: string, OPEN: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  OPENING: "OPENING",
  OPEN: "OPEN",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED"
};

/**
 * Cover entity features.
 *
 * @type {{POSITION: string, STOP: string, TILT_STOP: string, TILT_POSITION: string, TILT: string, CLOSE: string, OPEN: string}}
 */
const FEATURES = {
  OPEN: "open",
  CLOSE: "close",
  STOP: "stop",
  POSITION: "position",
  TILT: "tilt",
  TILT_STOP: "tilt_stop",
  TILT_POSITION: "tilt_position"
};

/**
 * Cover entity attributes.
 *
 * @type {{POSITION: string, STATE: string, TILT_POSITION: string}}
 */
const ATTRIBUTES = {
  STATE: "state",
  POSITION: "position",
  TILT_POSITION: "tilt_position"
};

/**
 * Cover entity commands.
 *
 * @type {{POSITION: string, TILT_DOWN: string, STOP: string, TILT_STOP: string, TILT: string, CLOSE: string, TILT_UP: string, OPEN: string}}
 */
const COMMANDS = {
  OPEN: "open",
  CLOSE: "close",
  STOP: "stop",
  POSITION: "position",
  TILT: "tilt",
  TILT_UP: "tilt_up",
  TILT_DOWN: "tilt_down",
  TILT_STOP: "tilt_stop"
};

/**
 * Cover entity device classes.
 *
 * @type {{BLIND: string, GARAGE: string, CURTAIN: string, GATE: string, SHADE: string, DOOR: string, WINDOW: string}}
 */
const DEVICECLASSES = {
  BLIND: "blind",
  CURTAIN: "curtain",
  GARAGE: "garage",
  SHADE: "shade",
  DOOR: "door",
  GATE: "gate",
  WINDOW: "window"
};

/**
 * Cover entity options.
 *
 * @type {{}}
 */
const OPTIONS = {};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_cover.md cover entity documentation}
 * for more information.
 */
class Cover extends Entity {
  /**
   * Constructs a new cover entity.
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
    super(id, name, Entity.TYPES.COVER, { features, attributes, deviceClass, options, area, cmdHandler });

    console.debug(`Cover entity created with id: ${this.id}`);
  }
}

module.exports = Cover;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
