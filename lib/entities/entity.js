/**
 * Common entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const { STATUS_CODES } = require("../api_definitions");
const { toLanguageObject } = require("../utils");
const { warn } = require("../loggers");
const assert = require("node:assert");

/**
 * Available entity types.
 *
 * @type {{COVER: string, BUTTON: string, LIGHT: string, SENSOR: string, MEDIA_PLAYER: string, REMOTE: string, SWITCH: string, CLIMATE: string}}
 */
const TYPES = {
  COVER: "cover",
  BUTTON: "button",
  CLIMATE: "climate",
  LIGHT: "light",
  MEDIA_PLAYER: "media_player",
  REMOTE: "remote",
  SENSOR: "sensor",
  SWITCH: "switch"
};

class Entity {
  #cmdHandler;

  /**
   * Constructs a new entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string|Map} name The human-readable name of the entity.
   *        Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {string} entityType One of defined [Entity.TYPES]{@link TYPES}.
   * @param {Object} params Entity parameters.
   * @param {string[]} [params.features=[]] Entity features.
   * @param {Map<string,*> | Object<string,*> | null} [params.attributes=null] Entity attributes holding the current state.
   * @param {string} [params.deviceClass] Device class.
   * @param {object | null} [params.options=null] Further options. See entity documentation.
   * @param {string} [params.area] Area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} [params.cmdHandler]
   *        Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id,
    name,
    entityType,
    { features = [], attributes = null, deviceClass, options = null, area, cmdHandler = null } = {}
  ) {
    assert(typeof id === "string", "Entity parameter id must be a string");
    this.id = id;
    this.name = toLanguageObject(name);
    assert(typeof entityType === "string", "Entity parameter entityType must be a string");
    this.entity_type = entityType;
    this.device_id = null; // not yet supported
    assert(features instanceof Array, "Entity parameter features must be an Array");
    this.features = features;
    assert(
      attributes === null || attributes instanceof Map || attributes instanceof Object,
      "Entity parameter attributes must be a Map or Object"
    );
    if (attributes === null) {
      this.attributes = null;
    } else if (attributes instanceof Map) {
      this.attributes = Object.fromEntries(attributes);
    } else if (attributes instanceof Object) {
      this.attributes = { ...attributes };
    }
    assert(
      deviceClass === undefined || typeof deviceClass === "string",
      "Entity parameter deviceClass must be a string"
    );
    this.device_class = deviceClass;
    assert(options === null || options instanceof Object, "Entity parameter options must be an Object");
    this.options = options;
    assert(area === undefined || typeof area === "string", "Entity parameter area must be a string");
    this.area = area;
    assert(cmdHandler === null || typeof cmdHandler === "function", "Entity parameter cmdHandler must be a function");
    this.#cmdHandler = cmdHandler;
  }

  /**
   * Set callback handler for entity command requests.
   * @param {function(Entity, string, Object.<string, *> | undefined):Promise<string>} cmdHandler Callback handler for entity commands, returning a {@link STATUS_CODES}
   */
  setCmdHandler(cmdHandler) {
    this.#cmdHandler = cmdHandler;
  }

  /**
   * @return {boolean} true if a callback handler for entity commands has been installed.
   */
  get hasCmdHandler() {
    return this.#cmdHandler !== undefined && this.#cmdHandler !== null;
  }

  /**
   * Execute entity command with the installed command handler.
   *
   * Returns NOT_IMPLEMENTED if no command handler is installed.
   * @param {string} cmdId the command
   * @param {Object.<string, *> } params optional command parameters
   * @return {Promise<string>} command status code to acknowledge to UC Remote
   */
  async command(cmdId, params) {
    if (this.#cmdHandler) {
      return await this.#cmdHandler(this, cmdId, params);
    }

    warn("No command handler for %s: cannot execute command '%s' %s", this.id, cmdId, params || "");

    return STATUS_CODES.NOT_IMPLEMENTED;
  }
}

module.exports = Entity;
module.exports.TYPES = TYPES;
