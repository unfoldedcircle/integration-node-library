/**
 * Number-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2026 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription, EntityOptions } from "./entity.js";
import log from "../loggers.js";

/**
 * Number entity states.
 */
export enum NumberStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The number entity is available. Default if the state attribute is omitted.
   */
  On = "ON"
}

/**
 * Number entity features.
 */
export enum NumberFeatures {
  /**
   * Read and set the value. Always present, even if not specified.
   */
  Value = "value",
  /**
   * The device supports a transition time to reach a new value: duration parameter of the set_value command.
   */
  Transition = "transition"
}

/**
 * Number entity attributes.
 */
export enum NumberAttributes {
  /**
   * Optional state of the number entity.
   */
  State = "state",
  /**
   * The current numeric value within the option bounds, or null if unknown.
   */
  Value = "value"
}

/**
 * Number entity commands.
 */
export enum NumberCommands {
  /**
   * Set the value. Parameters: `value`, optional `duration` in milliseconds (requires the `transition` feature).
   */
  SetValue = "set_value",
  /**
   * Increase the value by `step` (defaults to the `step` option), clamped at `max`.
   */
  Increment = "increment",
  /**
   * Decrease the value by `step` (defaults to the `step` option), clamped at `min`.
   */
  Decrement = "decrement"
}

/**
 * Number entity device classes.
 */
export enum NumberDeviceClasses {
  /**
   * Audio level in decibel (dB), e.g. the volume, bass or treble of an AV receiver.
   */
  AudioLevel = "audio_level",
  /**
   * Battery charge level in % (%).
   */
  Battery = "battery",
  /**
   * Electrical current in ampere (A).
   */
  Current = "current",
  /**
   * Time span in seconds (s). Supported units: ms, s, min, h, d.
   */
  Duration = "duration",
  /**
   * Energy in kilowatt-hour (kWh).
   */
  Energy = "energy",
  /**
   * Relative humidity in % (%).
   */
  Humidity = "humidity",
  /**
   * Illuminance in lux (lx).
   */
  Illuminance = "illuminance",
  /**
   * Power in watt or kilowatt (W).
   */
  Power = "power",
  /**
   * Temperature, default unit: °C.
   */
  Temperature = "temperature",
  /**
   * Voltage in volt (V).
   */
  Voltage = "voltage"
}

/**
 * Number entity options.
 */
export enum NumberOptions {
  /**
   * Minimum value (inclusive). Default: 0, null: no lower limit.
   */
  Min = "min",
  /**
   * Maximum value (inclusive). Default: 100, null: no upper limit.
   */
  Max = "max",
  /**
   * Step size between values, must be greater than 0. Default: 1, smallest step size: 0.000001.
   */
  Step = "step",
  /**
   * Number of decimal places to show in the UI: 0..6. If not set, the decimal places are derived from `step`, `min` and `max`.
   */
  Decimals = "decimals",
  /**
   * Optional unit label of the value, shown next to the value in the UI. Default: unit of the device class.
   */
  Unit = "unit",
  /**
   * Hint for the preferred default representation in the UI: `auto`, `slider`, `stepper`.
   */
  DisplayMode = "display_mode",
  /**
   * If set to false, the current value cannot be read from the device and the driver will not send `value` attribute updates. Default: true.
   */
  Readable = "readable"
}

/**
 * Number entity display mode: hint for the preferred default representation in the UI.
 */
export enum NumberDisplayMode {
  /**
   * Default. The UI chooses the representation based on the value range.
   */
  Auto = "auto",
  /**
   * Prefer a slider. Only applicable to a bounded number entity.
   */
  Slider = "slider",
  /**
   * Prefer a value field with increment and decrement buttons.
   */
  Stepper = "stepper"
}

export interface NumberParams {
  icon?: string;
  description?: EntityDescription;
  features?: (NumberFeatures | string)[];
  attributes?: Partial<Record<NumberAttributes, NumberStates | number | null>>;
  deviceClass?: NumberDeviceClasses | string;
  options?: Partial<Record<NumberOptions, string | number | boolean | null>> | EntityOptions;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A number entity holds a single numeric value which can be read and set.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_number.md number entity documentation}
 * for more information.
 */
export class Number extends Entity {
  /**
   * Constructs a new number entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   * @param params Number-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: NumberParams = {}
  ) {
    super(id, name, EntityType.Number, {
      icon,
      description,
      features: features as string[],
      attributes: attributes as Record<string, string | number | boolean | string[] | null>,
      deviceClass,
      options: options as EntityOptions,
      area,
      cmdHandler
    });

    log.debug(`Number entity created with id: ${this.id}`);
  }
}
