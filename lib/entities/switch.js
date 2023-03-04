'use strict';

const Entity = require('./entity');

const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  ON: 'ON',
  OFF: 'OFF'
};

const FEATURES = {
  ON_OFF: 'on_off',
  TOGGLE: 'toggle'
};

const ATTRIBUTES = {
  STATE: 'state'
};

const COMMANDS = {
  ON: 'on',
  OFF: 'off',
  TOGGLE: 'toggle'
};

const DEVICECLASSES = {
  OUTLET: 'outlet',
  SWITCH: 'switch'
};

const OPTIONS = { READABLE: 'readable' };

class Switch extends Entity {
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
      Entity.TYPES.SWITCH,
      deviceId,
      features,
      attributes,
      deviceClass,
      options,
      area
    );

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
