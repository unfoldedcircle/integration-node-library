/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { TYPES as ENTITYTYPES } from './entity';
import Entity from "./entity";
import log from "../loggers";

// Switch entity states
enum STATES {
  UNAVAILABLE = "UNAVAILABLE",
  UNKNOWN = "UNKNOWN",
  ON = "ON",
  OFF = "OFF",
}

// Switch entity features
enum FEATURES {
  ON_OFF = "on_off",
  TOGGLE = "toggle",
}

// Switch entity attributes
enum ATTRIBUTES {
  STATE = "state",
}

// Switch entity commands
enum COMMANDS {
  ON = "on",
  OFF = "off",
  TOGGLE = "toggle",
}

// Switch entity device classes
enum DEVICECLASSES {
  OUTLET = "outlet",
  SWITCH = "switch",
}

// Switch entity options
enum OPTIONS {
  READABLE = "readable",
}

// Define types for the parameters in the constructor
interface SwitchParams {
  features?: string[];
  attributes?: Map<string, any>;
  deviceClass?: DEVICECLASSES;
  options?: Record<string, any>;
  area?: string;
  cmdHandler?: (entity: Entity, command: string, params?: Record<string, any>) => Promise<string>;
}

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
class Switch extends Entity {
  /**
   * Constructs a new switch entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {SwitchParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: string | Map<string, string> | Record<string, string>,
    { features, attributes, deviceClass, options, area, cmdHandler }: SwitchParams = {}
  ) {
    super(id, name, ENTITYTYPES.SWITCH, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Switch entity created with id: ${this.id}`);
  }
}

export default Switch;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };