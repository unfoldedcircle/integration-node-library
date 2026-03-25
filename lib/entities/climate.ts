/**
 * Climate-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName } from "./entity.js";
import log from "../loggers.js";

// Climate entity states
export enum ClimateStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The climate device is switched off.
   */
  Off = "OFF",
  /**
   * The device is set to heating, optionally to a set target temperature.
   */
  Heat = "HEAT",
  /**
   * The device is set to cooling, optionally to a set target temperature.
   */
  Cool = "COOL",
  /**
   * The device is set to heat or cool to a target temperature range.
   */
  HeatCool = "HEAT_COOL",
  /**
   * Fan-only mode without heating or cooling.
   */
  Fan = "FAN",
  /**
   * The device is set to automatic mode.
   */
  Auto = "AUTO"
}

// Climate entity features
export enum ClimateFeatures {
  /**
   * The device can be turned on and off.
   */
  OnOff = "on_off",
  /**
   * The device supports heating.
   */
  Heat = "heat",
  /**
   * The device supports cooling.
   */
  Cool = "cool",
  /**
   * The device can measure the current temperature.
   */
  CurrentTemperature = "current_temperature",
  /**
   * The device supports a target temperature for heating or cooling.
   */
  TargetTemperature = "target_temperature",
  /**
   * The device supports a target temperature range.
   */
  TargetTemperatureRange = "target_temperature_range",
  /**
   * The device has a controllable fan.
   */
  Fan = "fan"
}

// Climate entity attributes
export enum ClimateAttributes {
  /**
   * State of the climate device, corresponds to HVAC mode.
   */
  State = "state",
  /**
   * Current temperature value.
   */
  CurrentTemperature = "current_temperature",
  /**
   * Target temperature value.
   */
  TargetTemperature = "target_temperature",
  /**
   * High target temperature value.
   */
  TargetTemperatureHigh = "target_temperature_high",
  /**
   * Low target temperature value.
   */
  TargetTemperatureLow = "target_temperature_low",
  /**
   * Current fan mode.
   */
  FanMode = "fan_mode"
}

// Climate entity commands
export enum ClimateCommands {
  /**
   * Switch on the climate device.
   */
  On = "on",
  /**
   * Switch off the climate device.
   */
  Off = "off",
  /**
   * Set the device to heating, cooling, etc.
   */
  HvacMode = "hvac_mode",
  /**
   * Change the target temperature.
   */
  TargetTemperature = "target_temperature",
  /**
   * Change the target temperature range.
   */
  TargetTemperatureRange = "target_temperature_range",
  /**
   * Change the fan mode.
   */
  FanMode = "fan_mode"
}

// Climate entity device classes
export enum ClimateDeviceClasses {}

// Climate entity options
export enum ClimateOptions {
  /**
   * The unit of temperature measurement: `CELSIUS`, `FAHRENHEIT`.
   */
  TemperatureUnit = "temperature_unit",
  /**
   * Step value for the UI for setting the target temperature.
   */
  TargetTemperatureStep = "target_temperature_step",
  /**
   * Maximum temperature to show in the UI for the target temperature range.
   */
  MaxTemperature = "max_temperature",
  /**
   * Minimum temperature to show in the UI for the target temperature range.
   */
  MinTemperature = "min_temperature",
  /**
   * Supported fan modes.
   */
  FanModes = "fan_modes"
}

export enum TemperatureUnit {
  Celsius = "CELSIUS",
  Fahrenheit = "FAHRENHEIT"
}

// Define types for the parameters in the constructor
export interface ClimateParams {
  features?: ClimateFeatures[];
  attributes?: Partial<Record<ClimateAttributes, ClimateStates | number>>;
  deviceClass?: string;
  options?: Partial<Record<ClimateOptions, TemperatureUnit | number>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A climate entity controls heating, ventilation and air conditioning (HVAC) devices.
 *
 * This can range from simple fans to personal air conditioning units to integrated building devices.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_climate.md climate entity documentation}
 * for more information.
 */
export class Climate extends Entity {
  /**
   * Constructs a new climate entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {ClimateParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { features, attributes, deviceClass, options, area, cmdHandler }: ClimateParams = {}
  ) {
    super(id, name, EntityType.Climate, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Climate entity created with id: ${this.id}`);
  }
}
