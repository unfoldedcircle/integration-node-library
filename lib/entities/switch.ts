/**
 * Switch-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription } from "./entity.js";
import log from "../loggers.js";

// Switch entity states
export enum SwitchStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The switch is on.
   */
  On = "ON",
  /**
   * The switch is off.
   */
  Off = "OFF"
}

// Switch entity features
export enum SwitchFeatures {
  /**
   * Switch has on and off commands.
   */
  OnOff = "on_off",
  /**
   * Toggle support.
   */
  Toggle = "toggle"
}

// Switch entity attributes
export enum SwitchAttributes {
  /**
   * State of the switch, it's either on or off.
   */
  State = "state"
}

// Switch entity commands
export enum SwitchCommands {
  /**
   * Put the switch in the on state.
   */
  On = "on",
  /**
   * Put the switch in the off state.
   */
  Off = "off",
  /**
   * Toggle the current switch state, either from on -> off or from off -> on.
   */
  Toggle = "toggle"
}

// Switch entity device classes
export enum SwitchDeviceClasses {
  /**
   * The switch represents a switchable power outlet.
   */
  Outlet = "outlet",
  /**
   * Generic switch.
   */
  Switch = "switch"
}

// Switch entity options
export enum SwitchOptions {
  /**
   * If set to false, the current state of the switch cannot be read.
   */
  Readable = "readable"
}

// Define types for the parameters in the constructor
export interface SwitchParams {
  icon?: string;
  description?: EntityDescription;
  features?: SwitchFeatures[];
  attributes?: Partial<Record<SwitchAttributes, SwitchStates>>;
  deviceClass?: SwitchDeviceClasses;
  options?: Partial<Record<SwitchOptions, boolean>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A switch entity can turn something on or off and the current state should be readable by the integration driver.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
export class Switch extends Entity {
  /**
   * Constructs a new switch entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {SwitchParams} [params] Switch-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: SwitchParams = {}
  ) {
    super(id, name, EntityType.Switch, {
      icon,
      description,
      features,
      attributes,
      deviceClass,
      options,
      area,
      cmdHandler
    });

    log.debug(`Switch entity created with id: ${this.id}`);
  }
}
