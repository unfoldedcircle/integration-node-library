/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { Entity, EntityType, EntityName } from "./entity.js";
import log from "../loggers.js";

/**
 * Sensor entity states.
 */
export enum SensorStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The sensor is available and providing measurements.
   */
  On = "ON"
}

/**
 * Sensor entity features.
 */
export enum SensorFeatures {}

/**
 * Sensor entity attributes.
 */
export enum SensorAttributes {
  /**
   * Optional state of the sensor.
   */
  State = "state",
  /**
   * The native measurement value of the sensor.
   */
  Value = "value",
  /**
   * Optional unit of the `value` if no default unit is set.
   */
  Unit = "unit"
}

/**
 * Sensor entity commands.
 */
export enum SensorCommands {}

/**
 * Sensor entity device classes.
 */
export enum SensorDeviceClasses {
  /**
   * Generic sensor with custom unit
   */
  Custom = "custom",
  /**
   * Battery charge in %
   */
  Battery = "battery",
  /**
   * Electrical current in ampere
   */
  Current = "current",
  /**
   * Energy in kilowatt-hour
   */
  Energy = "energy",
  /**
   * Humidity in %
   */
  Humidity = "humidity",
  /**
   * Power in watt or kilowatt
   */
  Power = "power",
  /**
   * Temperature with automatic °C, °F conversion, depending on remote settings.
   */
  Temperature = "temperature",
  /**
   * Voltage in volt
   */
  Voltage = "voltage"
}

/**
 * Sensor entity options.
 */
export enum SensorOptions {
  /**
   * Unit label for a custom sensor if `device_class` is not specified or to override a default unit.
   */
  CustomUnit = "custom_unit",
  /**
   * The sensor's native unit of measurement to perform automatic conversion. Applicable to device classes: `temperature`.
   */
  NativeUnit = "native_unit",
  /**
   * Number of decimal places to show in the UI if the sensor provides the measurement as a number. Not applicable to string values.
   */
  Decimals = "decimals",
  /**
   * Optional minimum value of the sensor output. This can be used in the UI for graphs or gauges.
   */
  MinValue = "min_value",
  /**
   * Optional maximum value of the sensor output. This can be used in the UI for graphs or gauges.
   */
  MaxValue = "max_value"
}

export interface SensorParams {
  attributes?: Partial<Record<SensorAttributes, SensorStates | number | string>>;
  deviceClass?: SensorDeviceClasses;
  options?: Partial<Record<SensorOptions, string | number>>;
  area?: string;
}

/**
 * A sensor entity provides measured values from devices or dedicated hardware sensors.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_sensor.md sensor entity documentation}
 * for more information.
 */
export class Sensor extends Entity {
  /**
   * Constructs a new sensor entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   * @param params Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id: string, name: EntityName, { attributes, deviceClass, options, area }: SensorParams = {}) {
    super(id, name, EntityType.Sensor, { attributes, deviceClass, options, area });

    log.debug(`Sensor entity created with id: ${this.id}`);
  }
}
