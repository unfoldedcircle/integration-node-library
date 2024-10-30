/**
 * Button-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName } from "./entity.js";
import log from "../loggers.js";

export enum States {
  Unavailable = "UNAVAILABLE",
  Available = "AVAILABLE"
}

export enum Attributes {
  State = "state"
}

export enum Commands {
  Push = "push"
}

interface ButtonParams {
  state?: States;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_button.md button entity documentation}
 * for more information.
 */
export class Button extends Entity {
  static States = States;
  static Attributes = Attributes;
  static Commands = Commands;

  /**
   * Constructs a new button entity.
   *
   * - The one-and-only `press` feature is automatically added.
   * - STATES.AVAILABLE is set if no entity-state is provided.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {ButtonParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id: string, name: EntityName, { state = States.Available, area, cmdHandler }: ButtonParams = {}) {
    super(id, name, EntityType.Button, {
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
