/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription } from "./entity.js";
import log from "../loggers.js";

/**
 * Light entity states.
 */
export enum LightStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The light is switched on.
   */
  On = "ON",
  /**
   * The light is switched off.
   */
  Off = "OFF"
}

/**
 * Light entity features.
 */
export enum LightFeatures {
  /**
   * The light can be turned on and off.
   */
  OnOff = "on_off",
  /**
   * The light can be toggled.
   */
  Toggle = "toggle",
  /**
   * The light supports dimming.
   */
  Dim = "dim",
  /**
   * The color of the light can be adjusted.
   */
  Color = "color",
  /**
   * The color temperature of the light can be adjusted.
   */
  ColorTemperature = "color_temperature"
}

/**
 * Light entity attributes.
 */
export enum LightAttributes {
  /**
   * Default entity state attribute.
   */
  State = "state",
  /**
   * Color hue value.
   */
  Hue = "hue",
  /**
   * Color saturation value.
   */
  Saturation = "saturation",
  /**
   * Light brightness value.
   */
  Brightness = "brightness",
  /**
   * Color temperature value.
   */
  ColorTemperature = "color_temperature"
}

/**
 * Light entity commands.
 */
export enum LightCommands {
  /**
   * Turn the light on.
   */
  On = "on",
  /**
   * Turn the light off.
   */
  Off = "off",
  /**
   * Toggle the light.
   */
  Toggle = "toggle"
}

/**
 * Light entity device classes.
 */
export enum LightDeviceClasses {}

/**
 * Light entity options.
 */
export enum LightOptions {
  /**
   * Number of color temperature steps of the light source.
   */
  ColorTemperatureSteps = "color_temperature_steps"
}

export interface LightParams {
  icon?: string;
  description?: EntityDescription;
  features?: LightFeatures[];
  attributes?: Partial<Record<LightAttributes, LightStates | number>>;
  deviceClass?: string;
  options?: Partial<Record<LightOptions, number>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A light entity can be switched on and off and depending on its features, the light source can be further
 * controlled like setting brightness, hue, color saturation, and color temperature.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_light.md light entity documentation}
 * for more information.
 */
export class Light extends Entity {
  /**
   * Constructs a new light entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {LightParams} [params] Light-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: LightParams = {}
  ) {
    super(id, name, EntityType.Light, {
      icon,
      description,
      features,
      attributes,
      deviceClass,
      options,
      area,
      cmdHandler
    });

    log.debug(`Light entity created with id: ${this.id}`);
  }
}
