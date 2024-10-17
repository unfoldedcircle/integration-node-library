/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, TYPES as ENTITYTYPES } from "./entity.js";
import { Entity } from "./entity.js";
import log from "../loggers.js";

// Cover entity states
export enum STATES {
  UNAVAILABLE = "UNAVAILABLE",
  UNKNOWN = "UNKNOWN",
  OPENING = "OPENING",
  OPEN = "OPEN",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED"
}

// Cover entity features
export enum FEATURES {
  OPEN = "open",
  CLOSE = "close",
  STOP = "stop",
  POSITION = "position",
  TILT = "tilt",
  TILT_STOP = "tilt_stop",
  TILT_POSITION = "tilt_position"
}

// Cover entity attributes
export enum ATTRIBUTES {
  STATE = "state",
  POSITION = "position",
  TILT_POSITION = "tilt_position"
}

// Cover entity commands
export enum COMMANDS {
  OPEN = "open",
  CLOSE = "close",
  STOP = "stop",
  POSITION = "position",
  TILT = "tilt",
  TILT_UP = "tilt_up",
  TILT_DOWN = "tilt_down",
  TILT_STOP = "tilt_stop"
}

// Cover entity device classes
export enum DEVICECLASSES {
  BLIND = "blind",
  CURTAIN = "curtain",
  GARAGE = "garage",
  SHADE = "shade",
  DOOR = "door",
  GATE = "gate",
  WINDOW = "window"
}

// Cover entity options
export enum OPTIONS {}

// Define types for the parameters in the constructor
interface CoverParams {
  features?: string[];
  attributes?: Partial<Record<ATTRIBUTES, STATES | number | boolean | string>>;
  deviceClass?: string;
  options?: Partial<Record<OPTIONS, number | string | boolean>> | null;
  area?: string;
  cmdHandler?: CommandHandler | null;
}

export class Cover extends Entity {
  /**
   * Constructs a new cover entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {CoverParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: string | Map<string, string> | Record<string, string>,
    { features = [], attributes = {}, deviceClass, options = null, area, cmdHandler }: CoverParams = {}
  ) {
    super(id, name, ENTITYTYPES.COVER, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Cover entity created with id: ${this.id}`);
  }
}
