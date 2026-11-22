/**
 * Entity pools for available and configured entities during runtime.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { EventEmitter } from "events";
import { Entity, EntityAttributes } from "./entity.js";
import { Events } from "../api_definitions.js";
import log from "../loggers.js";

/**
 * Options for entity pool add, update, and remove operations.
 */
export interface EntityUpdateOptions {
  /**
   * Emit an `entity_available` or `entity_removed` event to notify connected Remotes.
   * Requires a Remote supporting Integration-API >= 0.18.0 (`webview` entity support).
   */
  notify?: boolean;
}

/**
 * Entity pools for available and configured entities during runtime.
 */
export class Entities extends EventEmitter {
  #storage: { [key: string]: Entity };

  constructor(public id: string) {
    super();
    this.#storage = {};
  }

  /**
   * Check if storage contains an entity with a given identifier.
   *
   * @param {string} id - The entity identifier
   * @returns {boolean} true if entity exists, false otherwise
   */
  contains(id: string): boolean {
    return !!this.#storage[id];
  }

  /**
   * Retrieves an entity by its unique identifier.
   *
   * @param {string} id - The entity identifier.
   * @return {Entity | null} The entity corresponding to the given identifier, or null if the entity does not exist.
   */
  getEntity(id: string): Entity | null {
    if (!this.#storage[id]) {
      log.debug(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return null;
    }
    return this.#storage[id];
  }

  /**
   * Add an entity to the storage.
   *
   * @param {Entity} entity - The entity to add.
   * @param {EntityUpdateOptions} [options] - Optional notification settings (defaults to `{ notify: false }`).
   * @returns {boolean} true if entity was added, false if entity already exists.
   */
  addAvailableEntity(entity: Entity, options?: EntityUpdateOptions): boolean {
    if (this.#storage[entity.id]) {
      log.debug(`ENTITIES(${this.id}): Entity is already in storage: ${entity.id}`);
      return false;
    }
    this.#storage[entity.id] = entity;

    log.debug(`ENTITIES(${this.id}): Entity added: ${entity.id}`);
    if (options?.notify) {
      this.emit(Events.EntityAvailable, entity);
    }
    return true;
  }

  /**
   * Update an existing entity definition in the storage.
   *
   * @param {Entity} entity - The updated entity definition.
   * @param {EntityUpdateOptions} [options] - Optional notification settings (defaults to `{ notify: true }`).
   * @returns {boolean} true if entity was updated, false if entity does not exist.
   */
  updateEntity(entity: Entity, options?: EntityUpdateOptions): boolean {
    if (!this.#storage[entity.id]) {
      log.debug(`ENTITIES(${this.id}): Entity does not exist: ${entity.id}`);
      return false;
    }
    this.#storage[entity.id] = entity;

    log.debug(`ENTITIES(${this.id}): Entity updated: ${entity.id}`);
    if (options?.notify !== false) {
      this.emit(Events.EntityAvailable, entity);
    }
    return true;
  }

  /**
   * Remove an entity from the storage.
   *
   * @param {string} id - The entity identifier.
   * @param {EntityUpdateOptions} [options] - Optional notification settings (defaults to `{ notify: false }`).
   * @returns {boolean} true if entity was removed, false if entity does not exist.
   */
  removeEntity(id: string, options?: EntityUpdateOptions): boolean {
    if (!this.#storage[id]) {
      log.debug(`ENTITIES(${this.id}): Entity does not exist: ${id}`);
      return false;
    }

    const entity = this.#storage[id];
    delete this.#storage[id];

    log.debug(`ENTITIES(${this.id}): Entity removed: ${id}`);
    if (options?.notify) {
      this.emit(Events.EntityRemoved, entity);
    }
    return true;
  }

  /**
   * Update or merge the provided attributes into an entity.
   *
   * An WebSocket entity change event is triggered with the provided attributes.
   *
   * @param {string} id The entity_id
   * @param {Record<string, any>} attributes The attributes to merge into the entity's attributes
   * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
   */
  updateEntityAttributes(id: string, attributes: EntityAttributes): boolean {
    if (!this.contains(id)) {
      return false;
    }

    if (this.#storage[id] && this.#storage[id].attributes) {
      for (const key in attributes) {
        this.#storage[id].attributes[key] = attributes[key];
      }
    }

    this.emit(Events.EntityAttributesUpdated, id, this.#storage[id].entity_type, attributes);

    return true;
  }

  /**
   * Retrieves the list of entity IDs from the storage.
   *
   * @return {string[]} An array of entity identifiers.
   */
  getIds(): string[] {
    return Object.keys(this.#storage);
  }

  /**
   * Serialize an entity into the Integration-API entity definition object.
   *
   * Attributes are not included.
   *
   * @param {Entity} entity - The entity to serialize.
   * @returns {Record<string, object | string | null | undefined>} Serialized entity definition.
   */
  static toEntityData(entity: Entity): Record<string, object | string | null | undefined> {
    return {
      entity_id: entity.id,
      entity_type: entity.entity_type,
      icon: entity.icon,
      description: entity.description,
      device_id: entity.device_id,
      features: entity.features,
      name: entity.name,
      area: entity.area,
      device_class: entity.device_class,
      options: entity.options
    };
  }

  /**
   * Retrieves a list of entities stored in the system.
   *
   * Returned properties are:
   * - entity_id
   * - entity_type
   * - icon
   * - description
   * - device_id
   * - features
   * - name
   * - area
   * - device_class
   * - options
   *
   * Attributes are not returned.
   *
   * @return {Array<Record<string, object | string | null | undefined>>} An array of entity objects.
   */
  getEntities(): Array<Record<string, object | string | null | undefined>> {
    const entities: Array<Record<string, object | string | null | undefined>> = [];

    Object.entries(this.#storage).forEach(([, value]) => {
      entities.push(Entities.toEntityData(value));
    });

    return entities;
  }

  /**
   * Get all entity state information.
   *
   * The returned dict includes: entity_id, entity_type, device_id, attributes.
   */
  getStates(): Array<Record<string, object | string | null | undefined>> {
    const entities: Array<Record<string, object | string | null | undefined>> = [];

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

  /**
   * Clear all entities from the storage.
   */
  clear(): void {
    this.#storage = {};
  }
}
