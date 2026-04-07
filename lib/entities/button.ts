/**
 * Button-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName, EntityDescription } from "./entity.js";
import log from "../loggers.js";

export enum ButtonStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The button is available.
   */
  Available = "AVAILABLE"
}

export enum ButtonAttributes {
  /**
   * The current state of the button.
   */
  State = "state"
}

export enum ButtonCommands {
  /**
   * Button is pushed
   */
  Push = "push"
}

export interface ButtonParams {
  icon?: string;
  description?: EntityDescription;
  state?: ButtonStates;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A button entity can fire an event or start an action which cannot be further controlled once started.
 *
 * This can be used for "fire and forget" commands, e.g., running a system command, sending an IR code, restart a
 * device, reset something, etc.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_button.md button entity documentation}
 * for more information.
 */
export class Button extends Entity {
  /**
   * Constructs a new button entity.
   *
   * - The one-and-only `press` feature is automatically added.
   * - STATES.AVAILABLE is set if no entity-state is provided.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {ButtonParams} [params] Button-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, state = ButtonStates.Available, area, cmdHandler }: ButtonParams = {}
  ) {
    super(id, name, EntityType.Button, {
      icon,
      description,
      features: ["press"],
      attributes: {
        state: state
      },
      area,
      cmdHandler
    });

    log.debug(`Button entity created with id: ${this.id}`);
  }
}
