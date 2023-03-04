'use strict';

const Entity = require('./entity');

const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  OFF: 'OFF',
  HEAT: 'HEAT',
  COOL: 'COOL',
  HEAT_COOL: 'HEAT_COOL',
  FAN: 'FAN',
  AUTO: 'AUTO'
};

const FEATURES = {
  ON_OFF: 'on_off',
  HEAT: 'heat',
  COOL: 'cool',
  CURRENT_TEMPERATURE: 'current_temperature',
  TARGET_TEMPERATURE: 'target_temperature',
  TARGET_TEMPERATURE_RANGE: 'target_temperature_range',
  FAN: 'fan'
};

const ATTRIBUTES = {
  STATE: 'state',
  CURRENT_TEMPERATURE: 'current_temperature',
  TARGET_TEMPERATURE: 'target_temperature',
  TARGET_TEMPERATURE_HIGH: 'target_temperature_high',
  TARGET_TEMPERATURE_LOW: 'target_temperature_low',
  FAN_MODE: 'fan_mode'
};

const COMMANDS = {
  ON: 'on',
  OFF: 'off',
  HVAC_MODE: 'hvac_mode',
  TARGET_TEMPERATURE: 'target_temperature',
  TARGET_TEMPERATURE_RANGE: 'target_temperature_range',
  FAN_MODE: 'fan_mode'
};

const DEVICECLASSES = {};

const OPTIONS = {
  TEMPERATURE_UNIT: 'temperature_unit',
  TARGET_TEMPERATURE_STEP: 'target_temperature_step',
  MAX_TEMPERATURE: 'max_temperature',
  MIN_TEMPERATURE: 'min_temperature',
  FAN_MODES: 'fan_modes'
};

class Climate extends Entity {
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
      Entity.TYPES.CLIMATE,
      deviceId,
      features,
      attributes,
      deviceClass,
      options,
      area
    );

    console.debug(`Climate entity created with id: ${this.id}`);
  }
}

module.exports = Climate;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
