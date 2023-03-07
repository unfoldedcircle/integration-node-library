'use strict';

const Entity = require('./entity');

/**
 * Cover entity states.
 *
 * @type {{CLOSING: string, CLOSED: string, OPENING: string, UNAVAILABLE: string, UNKNOWN: string, OPEN: string}}
 */
const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED'
};

/**
 * Cover entity features.
 *
 * @type {{POSITION: string, STOP: string, TILT_STOP: string, TILT_POSITION: string, TILT: string, CLOSE: string, OPEN: string}}
 */
const FEATURES = {
  OPEN: 'open',
  CLOSE: 'close',
  STOP: 'stop',
  POSITION: 'position',
  TILT: 'tilt',
  TILT_STOP: 'tilt_stop',
  TILT_POSITION: 'tilt_position'
};

/**
 * Cover entity attributes.
 *
 * @type {{POSITION: string, STATE: string, TILT_POSITION: string}}
 */
const ATTRIBUTES = {
  STATE: 'state',
  POSITION: 'position',
  TILT_POSITION: 'tilt_position'
};

/**
 * Cover entity commands.
 *
 * @type {{POSITION: string, TILT_DOWN: string, STOP: string, TILT_STOP: string, TILT: string, CLOSE: string, TILT_UP: string, OPEN: string}}
 */
const COMMANDS = {
  OPEN: 'open',
  CLOSE: 'close',
  STOP: 'stop',
  POSITION: 'position',
  TILT: 'tilt',
  TILT_UP: 'tilt_up',
  TILT_DOWN: 'tilt_down',
  TILT_STOP: 'tilt_stop'
};

/**
 * Cover entity device classes.
 *
 * @type {{BLIND: string, GARAGE: string, CURTAIN: string, GATE: string, SHADE: string, DOOR: string, WINDOW: string}}
 */
const DEVICECLASSES = {
  BLIND: 'blind',
  CURTAIN: 'curtain',
  GARAGE: 'garage',
  SHADE: 'shade',
  DOOR: 'door',
  GATE: 'gate',
  WINDOW: 'window'
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
   * @param {string|Map} name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} deviceClass Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} area Optional area or room.
   */
  constructor (
    id,
    name,
    features,
    attributes,
    deviceClass = undefined,
    options = null,
    area = undefined
  ) {
    super(
      id,
      name,
      Entity.TYPES.COVER,
      features,
      attributes,
      deviceClass,
      options,
      area
    );

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
