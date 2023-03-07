'use strict';

/**
 * Available entity types.
 *
 * @type {{COVER: string, BUTTON: string, LIGHT: string, SENSOR: string, MEDIA_PLAYER: string, SWITCH: string, CLIMATE: string}}
 */
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
  /**
   * Constructs a new entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string|Map} name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {string} entityType One of defined [Entity.TYPES]{@link TYPES}.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} deviceClass Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} area Optional area or room.
   */
  constructor (
    id,
    name,
    entityType,
    features,
    attributes,
    deviceClass,
    options,
    area
  ) {
    this.id = id;
    this.name = (typeof name === 'string' || name instanceof String) ? { en: name } : Object.fromEntries(name);
    this.entity_type = entityType;
    this.device_id = null; // not yet supported
    this.features = features;
    this.attributes = attributes ? Object.fromEntries(attributes) : null;
    this.device_class = deviceClass;
    this.options = options;
    this.area = area;
  }
}

module.exports = Entity;
module.exports.TYPES = TYPES;
