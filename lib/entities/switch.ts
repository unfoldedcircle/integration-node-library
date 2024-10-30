/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName } from "./entity.js";
import log from "../loggers.js";

// Switch entity states
export enum States {
  Unavailable = "UNAVAILABLE",
  Unknown = "UNKNOWN",
  On = "ON",
  Off = "OFF"
}

// Switch entity features
export enum Features {
  OnOff = "on_off",
  Toggle = "toggle"
}

// Switch entity attributes
export enum Attributes {
  State = "state"
}

// Switch entity commands
export enum Commands {
  On = "on",
  Off = "off",
  Toggle = "toggle"
}

// Switch entity device classes
export enum DeviceClasses {
  Outlet = "outlet",
  Switch = "switch"
}

// Switch entity options
export enum Options {
  Readable = "readable"
}

// Define types for the parameters in the constructor
interface SwitchParams {
  features?: Features[];
  attributes?: Partial<Record<Attributes, States>>;
  deviceClass?: DeviceClasses;
  options?: Partial<Record<Options, boolean>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
export class Switch extends Entity {
  static States = States;
  static Features = Features;
  static Attributes = Attributes;
  static Commands = Commands;
  static DeviceClasses = DeviceClasses;
  static Options = Options;

  /**
   * Constructs a new switch entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {SwitchParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { features, attributes, deviceClass, options, area, cmdHandler }: SwitchParams = {}
  ) {
    super(id, name, EntityType.Switch, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Switch entity created with id: ${this.id}`);
  }
}
