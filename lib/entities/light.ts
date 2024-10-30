/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName } from "./entity.js";
import log from "../loggers.js";

/**
 * Light entity states.
 */
export enum States {
  Unavailable = "UNAVAILABLE",
  Unknown = "UNKNOWN",
  On = "ON",
  Off = "OFF"
}

/**
 * Light entity features.
 */
export enum Features {
  OnOff = "on_off",
  Toggle = "toggle",
  Dim = "dim",
  Color = "color",
  ColorTemperature = "color_temperature"
}

/**
 * Light entity attributes.
 */
export enum Attributes {
  State = "state",
  Hue = "hue",
  Saturation = "saturation",
  Brightness = "brightness",
  ColorTemperature = "color_temperature"
}

/**
 * Light entity commands.
 */
export enum Commands {
  On = "on",
  Off = "off",
  Toggle = "toggle"
}

/**
 * Light entity device classes.
 */
export enum DeviceClasses {}

/**
 * Light entity options.
 */
export enum Options {
  ColorTemperatureSteps = "color_temperature_steps"
}

interface LightParams {
  features?: Features[];
  attributes?: Partial<Record<Attributes, States | number>>;
  deviceClass?: string;
  options?: Partial<Record<Options, number>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_light.md light entity documentation}
 * for more information.
 */
export class Light extends Entity {
  static States = States;
  static Features = Features;
  static Attributes = Attributes;
  static Commands = Commands;
  static DeviceClasses = DeviceClasses;
  static Options = Options;

  /**
   * Constructs a new light entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {LightParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id: string, name: EntityName, { features, attributes, deviceClass, options, area }: LightParams = {}) {
    super(id, name, EntityType.Light, { features, attributes, deviceClass, options, area });

    log.debug(`Light entity created with id: ${this.id}`);
  }
}
