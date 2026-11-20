/**
 * Sensor-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { Entity, EntityType, EntityName, EntityDescription } from "./entity.js";
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
   * Calendar date without a time. Value: text in ISO 8601 format `YYYY-MM-DD`, e.g. `2026-11-15`.
   */
  Date = "date",
  /**
   * Time span, default unit: s. Supported units: `ms`, `s`, `min`, `h`, `d`. Value: number in the unit of the sensor.
   *
   * A value in `min`, `h` or `d` is shown as a time span in the unit of the sensor and the next smaller unit, e.g. `1.5`
   * hours as `1h 30m`. A value in `ms` or `s` is shown as a number with the unit.
   */
  Duration = "duration",
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
   * Point in time. Value: text in RFC 3339 format, including the UTC offset, e.g. `2026-11-15T04:23:31+00:00`.
   */
  Timestamp = "timestamp",
  /**
   * Voltage in volt
   */
  Voltage = "voltage",
  /**
   * Binary sensor. The specific binary device class is stored in the `unit` attribute.
   */
  Binary = "binary"
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
   * Number of decimal places to show in the UI if the sensor provides the measurement as a number. Not applicable to
   * string values and the `timestamp` and `date` device classes. A `duration` value is rounded to this number of
   * decimal places before it is formatted as a time span.
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
  icon?: string;
  description?: EntityDescription;
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
   * @param params Sensor-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, attributes, deviceClass, options, area }: SensorParams = {}
  ) {
    super(id, name, EntityType.Sensor, { icon, description, attributes, deviceClass, options, area });

    log.debug(`Sensor entity created with id: ${this.id}`);
  }
}
