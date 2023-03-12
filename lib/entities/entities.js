'use strict';

const EventEmitter = require('events');
const fs = require('fs');

const Entity = require('./entity');
const Button = require('./button');
const Climate = require('./climate');
const Cover = require('./cover');
const Light = require('./light');
const MediaPlayer = require('./media_player');
const Sensor = require('./sensor');
const Switch = require('./switch');
const { EVENTS } = require('../api_definitions');

class Entities extends EventEmitter {
  #storage;
  #dataPath;

  constructor (id) {
    super();

    this.id = id;
    this.#storage = {};
    this.#dataPath = `${this.id}.json`;

    // load configured entities
    if (fs.existsSync(this.#dataPath)) {
      const raw = fs.readFileSync(this.#dataPath);

      try {
        this.#storage = JSON.parse(raw);
        console.log(`ENTITIES(${this.id}): config file loaded.`);
      } catch (e) {
        console.log(`ENTITIES(${this.id}): Error parsing entities: ${this.#dataPath}`);
      }
    } else {
      console.log(`ENTITIES(${this.id}): No storage file, will create one later: ${this.#dataPath}`);
    }
  }

  static generateId (prefix = 'entity') {
    return (
      prefix +
      '_' +
      Array(25)
        .fill()
        .map(() =>
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
            Math.random() * 62
          )
        )
        .join('')
    );
  }

  contains (id) {
    return !!this.#storage[id];
  }

  getEntity (id) {
    if (!this.#storage[id]) {
      console.log(`ENTITIES(${this.id}): Entity does not exists: ${id}`);
      return null;
    }

    return this.#storage[id];
  }

  addEntity (entity) {
    if (this.#storage[entity.id]) {
      console.log(`ENTITIES(${this.id}): Entity is already in storage: ${entity.id}`);
      return false;
    }
    this.#storage[entity.id] = entity;

    console.log(`ENTITIES(${this.id}): Entity added: ${entity.id}`);
    return true;
  }

  removeEntity (id) {
    if (!this.#storage[id]) {
      console.log(`ENTITIES(${this.id}): Entity does not exists: ${id}`);
      return false;
    }

    delete this.#storage[id];

    console.log(`ENTITIES(${this.id}): Entity removed: ${id}`);
    return true;
  }

  /**
   * Update or merge the provided attributes into an entity.
   *
   * @param {String} id The entity_id
   * @param {Map} attributes The attributes to merge into the entity's attributes
   * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
   */
  updateEntityAttributes (id, attributes) {
    if (!this.contains(id)) {
      return false;
    }

    attributes.forEach((value, key) => { this.#storage[id].attributes[key] = value; });

    this.emit(
      EVENTS.ENTITY_ATTRIBUTES_UPDATED,
      id,
      this.#storage[id].entity_type,
      attributes
    );

    return true;
  }

  getEntities () {
    const entities = [];

    Object.entries(this.#storage).forEach(([, value]) => {
      const entity = {
        entity_id: value.id,
        entity_type: value.entity_type,
        device_id: value.device_id,
        features: value.features,
        name: value.name,
        area: value.area
      };

      entities.push(entity);
    });

    return entities;
  }

  getStates () {
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

  clear () {
    this.#storage = {};
    this.saveData();
  }

  saveData () {
    try {
      fs.writeFileSync(
        this.#dataPath,
        JSON.stringify(this.#storage)
      );
      console.log(`ENTITIES(${this.id}): Config saved to file: ${this.#dataPath}`);
    } catch (e) {
      console.error(`ENTITIES(${this.id}): Error writing config: ${this.#dataPath}`);
    }
  }
}

module.exports = Entities;
module.exports.TYPES = Entity.TYPES;
module.exports.Button = Button;
module.exports.Climate = Climate;
module.exports.Cover = Cover;
module.exports.Light = Light;
module.exports.MediaPlayer = MediaPlayer;
module.exports.Sensor = Sensor;
module.exports.Switch = Switch;
