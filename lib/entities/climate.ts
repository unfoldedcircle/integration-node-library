/**
 * Climate-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { TYPES as ENTITYTYPES } from './entity';
import Entity from "./entity";
import log from "../loggers";

// Climate entity states
enum STATES {
  UNAVAILABLE = "UNAVAILABLE",
  UNKNOWN = "UNKNOWN",
  OFF = "OFF",
  HEAT = "HEAT",
  COOL = "COOL",
  HEAT_COOL = "HEAT_COOL",
  FAN = "FAN",
  AUTO = "AUTO",
}

// Climate entity features
enum FEATURES {
  ON_OFF = "on_off",
  HEAT = "heat",
  COOL = "cool",
  CURRENT_TEMPERATURE = "current_temperature",
  TARGET_TEMPERATURE = "target_temperature",
  TARGET_TEMPERATURE_RANGE = "target_temperature_range",
  FAN = "fan",
}

// Climate entity attributes
enum ATTRIBUTES {
  STATE = "state",
  CURRENT_TEMPERATURE = "current_temperature",
  TARGET_TEMPERATURE = "target_temperature",
  TARGET_TEMPERATURE_HIGH = "target_temperature_high",
  TARGET_TEMPERATURE_LOW = "target_temperature_low",
  FAN_MODE = "fan_mode",
}

// Climate entity commands
enum COMMANDS {
  ON = "on",
  OFF = "off",
  HVAC_MODE = "hvac_mode",
  TARGET_TEMPERATURE = "target_temperature",
  TARGET_TEMPERATURE_RANGE = "target_temperature_range",
  FAN_MODE = "fan_mode",
}

// Climate entity device classes
const DEVICECLASSES = {};

// Climate entity options
const OPTIONS = {
  TEMPERATURE_UNIT: "temperature_unit",
  TARGET_TEMPERATURE_STEP: "target_temperature_step",
  MAX_TEMPERATURE: "max_temperature",
  MIN_TEMPERATURE: "min_temperature",
  FAN_MODES: "fan_modes",
};

// Define types for the parameters in the constructor
interface ClimateParams {
  features?: string[];
  attributes?: Map<string, any> | Record<string, any>;
  deviceClass?: string;
  options?: Record<string, any>;
  area?: string;
  cmdHandler?: (entity: Entity, command: string, params?: Record<string, any>) => Promise<string>;
}

class Climate extends Entity {
  /**
   * Constructs a new climate entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {ClimateParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: string | Map<string, string> | Record<string, string>,
    { features = [], attributes = {}, deviceClass, options = {}, area, cmdHandler }: ClimateParams = {}
  ) {
    super(id, name, ENTITYTYPES.CLIMATE, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`Climate entity created with id: ${this.id}`);
  }
}

export default Climate;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
