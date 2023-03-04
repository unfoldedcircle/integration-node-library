'use strict';

const Entity = require('./entity');

const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED'
};

const FEATURES = {
  OPEN: 'open',
  CLOSE: 'close',
  STOP: 'stop',
  POSITION: 'position',
  TILT: 'tilt',
  TILT_STOP: 'tilt_stop',
  TILT_POSITION: 'tilt_position'
};

const ATTRIBUTES = {
  STATE: 'state',
  POSITION: 'position',
  TILT_POSITION: 'tilt_position'
};

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

const DEVICECLASSES = {
  BLIND: 'blind',
  CURTAIN: 'curtain',
  GARAGE: 'garage',
  SHADE: 'shade',
  DOOR: 'door',
  GATE: 'gate',
  WINDOW: 'window'
};

const OPTIONS = {};

class Cover extends Entity {
  constructor (
    id,
    name,
    deviceId,
    features,
    attributes,
    deviceClass,
    options,
    area
  ) {
    super(
      id,
      name,
      Entity.TYPES.COVER,
      deviceId,
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
