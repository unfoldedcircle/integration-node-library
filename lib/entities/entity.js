'use strict';

const TYPES = {
  COVER: 'cover',
  BUTTON: 'button',
  CLIMATE: 'climate',
  LIGHT: 'light',
  MEDIA_PLAYER: 'media_player',
  SENSOR: 'sensor',
  SWITCH: 'switch'
};

class Entity {
  constructor (
    id,
    name,
    entityType,
    deviceId,
    features,
    attributes,
    deviceClass,
    options,
    area
  ) {
    this.id = id;
    this.name = name;
    this.entity_type = entityType;
    this.device_id = deviceId;
    this.features = features;
    this.attributes = attributes;
    this.device_class = deviceClass;
    this.options = options;
    this.area = area;
  }
}

module.exports = Entity;
module.exports.TYPES = TYPES;
