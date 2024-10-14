/**
 * Entity pools for available and configured entities during runtime.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import { EventEmitter } from "events";
import Entity from "./entity.js";
import Button from "./button.js";
import Climate from "./climate.js";
import Cover from "./cover.js";
import Light from "./light.js";
import MediaPlayer from "./media_player.js";
import Remote from "./remote.js";
import Sensor from "./sensor.js";
import Switch from "./switch.js";
import { EVENTS } from "../api_definitions.js";
import log from "../loggers.js";
class Entities extends EventEmitter {
    id;
    storage;
    constructor(id) {
        super();
        this.id = id;
        this.storage = {};
    }
    contains(id) {
        return !!this.storage[id];
    }
    getEntity(id) {
        if (!this.storage[id]) {
            log.warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
            return null;
        }
        return this.storage[id];
    }
    addEntity(entity) {
        if (this.storage[entity.id]) {
            log.warn(`ENTITIES(${this.id}): Entity is already in storage: ${entity.id}`);
            return false;
        }
        this.storage[entity.id] = entity;
        log.debug(`ENTITIES(${this.id}): Entity added: ${entity.id}`);
        return true;
    }
    removeEntity(id) {
        if (!this.storage[id]) {
            log.warn(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
            return false;
        }
        delete this.storage[id];
        log.debug(`ENTITIES(${this.id}): Entity removed: ${id}`);
        return true;
    }
    /**
     * Update or merge the provided attributes into an entity.
     *
     * @param {string} id The entity_id
     * @param {Map<string, any> | Record<string, any>} attributes The attributes to merge into the entity's attributes
     * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
     */
    updateEntityAttributes(id, attributes) {
        if (!this.contains(id)) {
            return false;
        }
        if (attributes instanceof Map) {
            attributes.forEach((value, key) => {
                this.storage[id].attributes[key] = value;
            });
        }
        else {
            for (const key in attributes) {
                this.storage[id].attributes[key] = attributes[key];
            }
        }
        this.emit(EVENTS.ENTITY_ATTRIBUTES_UPDATED, id, this.storage[id].entity_type, attributes);
        return true;
    }
    getEntities() {
        const entities = [];
        Object.entries(this.storage).forEach(([, value]) => {
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
        Object.entries(this.storage).forEach(([, value]) => {
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
        this.storage = {};
    }
}
export default Entities;
export const TYPES = ENTITYTYPES;
export { Entity, Button, Climate, Cover, Light, MediaPlayer, Remote, Sensor, Switch };
