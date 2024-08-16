/**
 * Entity pools for available and configured entities during runtime.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const EventEmitter = require("events");

const Entity = require("./entity");
const Button = require("./button");
const Climate = require("./climate");
const Cover = require("./cover");
const Light = require("./light");
const MediaPlayer = require("./media_player");
const Remote = require("./remote");
const Sensor = require("./sensor");
const Switch = require("./switch");
const { EVENTS } = require("../api_definitions");
const { debug, warn } = require("../loggers");

class Entities extends EventEmitter {
  #storage;

  constructor(id) {
    super();

    this.id = id;
    this.#storage = {};
  }

  contains(id) {
    return !!this.#storage[id];
  }

  getEntity(id) {
    if (!this.#storage[id]) {
      warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return null;
    }

    return this.#storage[id];
  }

  addEntity(entity) {
    if (this.#storage[entity.id]) {
      warn(`ENTITIES(${this.id}): Entity is already in storage: ${entity.id}`);
      return false;
    }
    this.#storage[entity.id] = entity;

    debug(`ENTITIES(${this.id}): Entity added: ${entity.id}`);
    return true;
  }

  removeEntity(id) {
    if (!this.#storage[id]) {
      warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return false;
    }

    delete this.#storage[id];

    debug(`ENTITIES(${this.id}): Entity removed: ${id}`);
    return true;
  }

  /**
   * Update or merge the provided attributes into an entity.
   *
   * @param {string} id The entity_id
   * @param {Map<string,*>|Object<string,*>} attributes The attributes to merge into the entity's attributes
   * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
   */
  updateEntityAttributes(id, attributes) {
    if (!this.contains(id)) {
      return false;
    }

    if (attributes instanceof Map) {
      attributes.forEach((value, key) => {
        this.#storage[id].attributes[key] = value;
      });
    } else {
      for (const key in attributes) {
        this.#storage[id].attributes[key] = attributes[key];
      }
    }

    this.emit(EVENTS.ENTITY_ATTRIBUTES_UPDATED, id, this.#storage[id].entity_type, attributes);

    return true;
  }

  getEntities() {
    const entities = [];

    Object.entries(this.#storage).forEach(([, value]) => {
      const entity = {
        entity_id: value.id,
        entity_type: value.entity_type,
        device_id: value.device_id,
        features: value.features,
        name: value.name,
        area: value.area,
        device_class: value.device_class,
        options: value.options
      };

      entities.push(entity);
    });

    return entities;
  }

  getStates() {
    const entities = [];

    Object.entries(this.#storage).forEach(([, value]) => {
      const entity = {
        entity_id: value.id,
        entity_type: value.entity_type,
        device_id: value.device_id,
        attributes: value.attributes
      };

      entities.push(entity);
    });

    return entities;
  }

  clear() {
    this.#storage = {};
  }
}

module.exports = Entities;
module.exports.TYPES = Entity.TYPES;
module.exports.Entity = Entity;
module.exports.Button = Button;
module.exports.Climate = Climate;
module.exports.Cover = Cover;
module.exports.Light = Light;
module.exports.MediaPlayer = MediaPlayer;
module.exports.Remote = Remote;
module.exports.Sensor = Sensor;
module.exports.Switch = Switch;
