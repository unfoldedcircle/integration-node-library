/**
 * Common entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import assert from "node:assert";
import { StatusCodes } from "../api_definitions.js";
import log from "../loggers.js";
import { toLanguageObject } from "../utils.js";

/**
 * Available entity types.
 */
export enum EntityType {
  /** Entity for covering or opening things like blinds, window covers, curtains, etc. */
  Cover = "cover",
  /** A button entity can fire an event or start an action which cannot be further controlled once started. */
  Button = "button",
  /** A climate entity controls heating, ventilation and air conditioning (HVAC) devices. */
  Climate = "climate",
  /** A light entity can be switched on and off and controlled in brightness, color, etc. */
  Light = "light",
  /** A media player entity controls playback of media on a device. */
  MediaPlayer = "media_player",
  /** A remote entity can send commands to a controllable device. */
  Remote = "remote",
  /** A sensor entity provides measured values from devices or dedicated hardware sensors. */
  Sensor = "sensor",
  /** A switch entity can turn something on or off. */
  Switch = "switch"
}

export type EntityName = string | { [key: string]: string };
export type EntityDescription = string | { [key: string]: string };
export type EntityAttributes = { [key: string]: string | number | boolean | string[] };
export type EntityOptions = { [key: string]: string | number | boolean | object };
export type EntityCommandParams = { [key: string]: string | number | boolean };

export type CommandHandler = (entity: Entity, command: string, params?: EntityCommandParams) => Promise<StatusCodes>;

export interface EntityParams {
  icon?: string;
  description?: EntityDescription;
  features?: string[];
  attributes?: EntityAttributes;
  deviceClass?: string;
  options?: EntityOptions;
  area?: string;
  cmdHandler?: CommandHandler;
}

export class Entity {
  /** Unique identifier of the entity for command and event messages. */
  public id: string;
  /** Human-readable name of the entity or device. */
  public name: EntityName;
  /** Entity device type name: one of the supported entities. */
  public entity_type: EntityType;
  /** Optional icon of the entity. If not specified, a default icon is used based on the entity type. */
  public icon?: string;
  /** Optional description of the entity. */
  public description?: EntityDescription;

  /** Optional associated device, if the integration driver supports multiple devices. */
  public device_id?: string;

  /** Supported features of the entity. */
  public features?: string[];
  /** Entity attributes. */
  public attributes?: EntityAttributes;
  /** Optional device class. */
  public device_class?: string;
  /** Entity options. */
  public options?: EntityOptions;
  /** Optional area name, e.g. `Living room`. */
  public area?: string;
  #cmdHandler?: CommandHandler;

  /**
   * Constructs a new entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity. Either a string or an object containing multiple language strings.
   * @param entityType One of the defined entity types.
   * @param params Entity parameters.
   */
  constructor(
    id: string,
    name: string | { [key: string]: string },
    entityType: EntityType,
    {
      icon,
      description,
      features = [],
      attributes = { state: "UNKNOWN" },
      deviceClass,
      options,
      area,
      cmdHandler
    }: EntityParams = {}
  ) {
    this.id = id;

    const languageName = toLanguageObject(name);
    assert(languageName);
    this.name = languageName || "?";
    this.icon = icon;
    this.description = toLanguageObject(description) || undefined;

    this.entity_type = entityType;
    this.features = features;
    this.attributes = attributes;
    this.device_class = deviceClass;
    this.options = options;
    this.area = area;
    this.#cmdHandler = cmdHandler;
  }

  /**
   * Set callback handler for entity command requests.
   * @param cmdHandler Callback handler for entity commands.
   */
  setCmdHandler(cmdHandler: CommandHandler) {
    this.#cmdHandler = cmdHandler;
  }

  /**
   * @return true if a callback handler for entity commands has been installed.
   */
  get hasCmdHandler(): boolean {
    return this.#cmdHandler !== undefined;
  }

  /**
   * Execute entity command with the installed command handler.
   *
   * Returns NOT_IMPLEMENTED if no command handler is installed.
   * @param cmdId the command
   * @param params optional command parameters
   * @return command status code to acknowledge to UC Remote
   */
  async command(cmdId: string, params?: EntityCommandParams): Promise<StatusCodes> {
    if (this.#cmdHandler) {
      return await this.#cmdHandler(this, cmdId, params);
    }

    log.warn("No command handler for %s: cannot execute command '%s' %s", this.id, cmdId, params || "");

    return StatusCodes.NotImplemented;
  }
}
