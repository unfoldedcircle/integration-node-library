'use strict';

const Entity = require('./entity');

const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  ON: 'ON'
};

const FEATURES = {};

const ATTRIBUTES = {
  STATE: 'state',
  VALUE: 'value',
  UNIT: 'unit'
};

const COMMANDS = {};

const DEVICECLASSES = {
  CUSTOM: 'custom',
  BATTERY: 'battery',
  CURRENT: 'current',
  ENERGY: 'energy',
  HUMIDITY: 'humidity',
  POWER: 'power',
  TEMPERATURE: 'temperature',
  VOLTAGE: 'voltage'
};

const OPTIONS = {
  CUSTOM_UNIT: 'custom_unit',
  NATIVE_UNIT: 'native_unit',
  DECIMALS: 'decimals',
  MIN_VALUE: 'min_value',
  MAX_VALUE: 'max_value'
};

class Sensor extends Entity {
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
      Entity.TYPES.SENSOR,
      deviceId,
      features,
      attributes,
      deviceClass,
      options,
      area
    );

    console.debug(`Sensor entity created with id: ${this.id}`);
  }
}

module.exports = Sensor;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
