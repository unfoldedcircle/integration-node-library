/**
 * Select-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2026 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription, EntityOptions } from "./entity.js";
import log from "../loggers.js";

/**
 * Select entity states.
 */
export enum SelectStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The select is on.
   */
  On = "ON"
}

/**
 * Select entity features.
 */
export enum SelectFeatures {}

/**
 * Select entity attributes.
 */
export enum SelectAttributes {
  /**
   * State of the select entity.
   */
  State = "state",
  /**
   * The current selected option.
   */
  CurrentOption = "current_option",
  /**
   * The list of available options.
   */
  Options = "options"
}

/**
 * Select entity commands.
 */
export enum SelectCommands {
  /**
   * Select an option from the list of options.
   */
  SelectOption = "select_option",
  /**
   * Select the first option.
   */
  SelectFirst = "select_first",
  /**
   * Select the last option.
   */
  SelectLast = "select_last",
  /**
   * Select the next option.
   */
  SelectNext = "select_next",
  /**
   * Select the previous option.
   */
  SelectPrevious = "select_previous"
}

/**
 * Select entity device classes.
 */
export enum SelectDeviceClasses {}

/**
 * Select entity options.
 */
export enum SelectOptions {}

export interface SelectParams {
  icon?: string;
  description?: EntityDescription;
  features?: string[];
  attributes?: Partial<Record<SelectAttributes, SelectStates | string | string[]>>;
  deviceClass?: string;
  options?: EntityOptions;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A select entity can choose an option from a list of options.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_select.md select entity documentation}
 * for more information.
 */
export class Select extends Entity {
  /**
   * Constructs a new select entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   * @param params Select-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: SelectParams = {}
  ) {
    super(id, name, EntityType.Select, {
      icon,
      description,
      features,
      attributes,
      deviceClass,
      options,
      area,
      cmdHandler
    });

    log.debug(`Select entity created with id: ${this.id}`);
  }
}
