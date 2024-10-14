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
declare class Entities extends EventEmitter {
    id: string;
    private storage;
    constructor(id: string);
    contains(id: string): boolean;
    getEntity(id: string): Entity | null;
    addEntity(entity: Entity): boolean;
    removeEntity(id: string): boolean;
    /**
     * Update or merge the provided attributes into an entity.
     *
     * @param {string} id The entity_id
     * @param {Map<string, any> | Record<string, any>} attributes The attributes to merge into the entity's attributes
     * @returns {boolean} false if entity doesn't exist, true if attributes were merged.
     */
    updateEntityAttributes(id: string, attributes: Map<string, object | number | string> | Record<string, object | number | string>): boolean;
    getEntities(): Array<Record<string, object | string | null | undefined>>;
    getStates(): Array<Record<string, object | string | null | undefined>>;
    clear(): void;
}
export default Entities;
export declare const TYPES: typeof ENTITYTYPES;
export { Entity, Button, Climate, Cover, Light, MediaPlayer, Remote, Sensor, Switch };
