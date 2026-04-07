/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription } from "./entity.js";
import log from "../loggers.js";

// Cover entity states
export enum CoverStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The cover is in the process of opening.
   */
  Opening = "OPENING",
  /**
   * The cover is in the open state.
   */
  Open = "OPEN",
  /**
   * The cover is in the process of closing.
   */
  Closing = "CLOSING",
  /**
   * The cover is in the closed state.
   */
  Closed = "CLOSED"
}

// Cover entity features
export enum CoverFeatures {
  /**
   * The cover can be opened.
   */
  Open = "open",
  /**
   * The cover can be closed.
   */
  Close = "close",
  /**
   * Opening, closing, or setting the position can be stopped.
   */
  Stop = "stop",
  /**
   * The cover can be moved to a specific position, e.g., 30% open.
   */
  Position = "position",
  /**
   * The cover supports being tilted up and down.
   */
  Tilt = "tilt",
  /**
   * Tilting the cover can be stopped.
   */
  TiltStop = "tilt_stop",
  /**
   * The cover can be moved to a specific tilt position.
   */
  TiltPosition = "tilt_position"
}

// Cover entity attributes
export enum CoverAttributes {
  /**
   * Default entity state attribute.
   */
  State = "state",
  /**
   * Current position of the cover: 0 = closed, 100 = open.
   */
  Position = "position",
  /**
   * Current tilt position of the cover: 0 = no tilt, 100 = max tilt.
   */
  TiltPosition = "tilt_position"
}

// Cover entity commands
export enum CoverCommands {
  /**
   * Open the cover.
   */
  Open = "open",
  /**
   * Close the cover.
   */
  Close = "close",
  /**
   * Stop the current cover open, close or position operation.
   */
  Stop = "stop",
  /**
   * Set the cover to the given position.
   */
  Position = "position",
  /**
   * Tilt the cover to the given position.
   */
  Tilt = "tilt",
  /**
   * Tilt the cover fully up.
   */
  TiltUp = "tilt_up",
  /**
   * Tilt the cover fully down.
   */
  TiltDown = "tilt_down",
  /**
   * Stop current tilt operation.
   */
  TiltStop = "tilt_stop"
}

// Cover entity device classes
export enum CoverDeviceClasses {
  /**
   * Window blinds or shutters which can be opened, closed, or tilted.
   */
  Blind = "blind",
  /**
   * Window curtain or drapes which can be opened or closed.
   */
  Curtain = "curtain",
  /**
   * Controllable garage door.
   */
  Garage = "garage",
  /**
   * Sun shades which can be opened to protect an area from the sun.
   */
  Shade = "shade",
  /**
   * Controllable door which can be opened and closed.
   */
  Door = "door",
  /**
   * Controllable gate which can be opened and closed.
   */
  Gate = "gate",
  /**
   * A window which can be opened, closed, or tilted.
   */
  Window = "window"
}

// Cover entity options
export enum CoverOptions {}

// Define types for the parameters in the constructor
export interface CoverParams {
  icon?: string;
  description?: EntityDescription;
  features?: CoverFeatures[];
  attributes?: Partial<Record<CoverAttributes, CoverStates | number>>;
  deviceClass?: CoverDeviceClasses;
  options?: { [key: string]: string };
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * Entity for covering or opening things like blinds, window covers, curtains, etc.
 *
 * The entity features specify the abilities of the cover and the controllable properties,
 * whereas the device class specifies the UI representation.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_cover.md cover entity documentation}
 * for more information.
 */
export class Cover extends Entity {
  /**
   * Constructs a new cover entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {CoverParams} [params] Cover-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: CoverParams = {}
  ) {
    super(id, name, EntityType.Cover, {
      icon,
      description,
      features,
      attributes,
      deviceClass,
      options,
      area,
      cmdHandler
    });

    log.debug(`Cover entity created with id: ${this.id}`);
  }
}
