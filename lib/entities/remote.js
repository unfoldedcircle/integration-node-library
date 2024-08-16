/**
 * Remote-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const { EntityCommand } = require("./ui");

const Entity = require("./entity");
const assert = require("node:assert");

/**
 * Remote entity states.
 *
 * @type {{UNAVAILABLE: string, UNKNOWN: string, OFF: string, ON: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  ON: "ON",
  OFF: "OFF"
};

/**
 * Remote-entity features.
 *
 * @type {{SEND_CMD: string, TOGGLE: string, ON_OFF: string}}
 */
const FEATURES = {
  ON_OFF: "on_off",
  TOGGLE: "toggle",
  SEND_CMD: "send_cmd"
};

/**
 * Remote-entity attributes.
 *
 * @type {{STATE: string}}
 */
const ATTRIBUTES = {
  STATE: "state"
};

/**
 * Remote-entity commands.
 *
 * @type {{SEND_CMD: string, SEND_CMD_SEQUENCE: string, TOGGLE: string, OFF: string, ON: string}}
 */
const COMMANDS = {
  ON: "on",
  OFF: "off",
  TOGGLE: "toggle",
  SEND_CMD: "send_cmd",
  SEND_CMD_SEQUENCE: "send_cmd_sequence"
};

/**
 * Remote-entity-options.
 *
 * @type {{SIMPLE_COMMANDS: string, USER_INTERFACE: string, BUTTON_MAPPING: string}}
 */
const OPTIONS = {
  SIMPLE_COMMANDS: "simple_commands",
  BUTTON_MAPPING: "button_mapping",
  USER_INTERFACE: "user_interface"
};

/**
 * Create a remote-entity send command.
 * @param {string} command command to send.
 * @param {Object} [params] optional named parameters
 * @param {number} [params.delay] optional delay in milliseconds after the command or between repeats.
 * @param {number} [params.repeat] optional repeat count of the command.
 * @param {number} [params.hold] optional hold time in milliseconds.
 * @return {EntityCommand} the created EntityCommand.
 * @throws AssertionError if command is not specified or is empty.
 */
function createSendCmd(command, { delay, repeat, hold } = {}) {
  assert(command && typeof command === "string" && command.length > 0, "command must be a string and may not be empty");
  const params = { command };
  if (typeof delay === "number") {
    params.delay = delay;
  }
  if (typeof repeat === "number") {
    params.repeat = repeat;
  }
  if (typeof hold === "number") {
    params.hold = hold;
  }
  return new EntityCommand(COMMANDS.SEND_CMD, params);
}

/**
 * Create a remote send sequence command.
 * @param {Array<string>} sequence list of simple commands. An empty array is not valid.
 * @param {Object} [params] optional named parameters
 * @param {number} [params.delay] optional delay in milliseconds between the commands in the sequence.
 * @param {number} [params.repeat] optional repeat count of the sequence.
 * @return {EntityCommand} the created EntityCommand.
 * @throws AssertionError if sequence is not specified or doesn't contain at least one command.
 */
function createSequenceCmd(sequence, { delay, repeat } = {}) {
  assert(
    sequence && sequence instanceof Array && sequence.length > 0,
    "sequence array must be specified and contain at least one command"
  );
  const params = { sequence };
  if (typeof delay === "number") {
    params.delay = delay;
  }
  if (typeof repeat === "number") {
    params.repeat = repeat;
  }
  return new EntityCommand(COMMANDS.SEND_CMD_SEQUENCE, params);
}

class Remote extends Entity {
  /**
   * Constructs a new remote-entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity.
   *        Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {Object} [params] Entity parameters.
   * @param {Array<string>} [params.features] Remote features.
   * @param {Map|Object} [params.attributes] Remote attributes.
   * @param {Array<string>} [params.simpleCommands] Optional list of supported remote command identifiers.
   * @param {Array<DeviceButtonMapping|Object<string, *>>} [params.buttonMapping] Optional command mapping of physical buttons.
   * @param {Array<UiPage|Object<string, *>>} [params.uiPages] Optional user interface page definitions.
   * @param {string} [params.area] Area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} [params.cmdHandler]
   *        Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, { features, attributes, simpleCommands, buttonMapping, uiPages, area, cmdHandler } = {}) {
    const options = {};
    if (simpleCommands) {
      options[OPTIONS.SIMPLE_COMMANDS] = simpleCommands;
    }
    if (buttonMapping) {
      options[OPTIONS.BUTTON_MAPPING] = buttonMapping;
    }
    if (uiPages) {
      options[OPTIONS.USER_INTERFACE] = { pages: uiPages };
    }
    super(id, name, Entity.TYPES.REMOTE, { features, attributes, options, area, cmdHandler });
  }
}

module.exports = Remote;
module.exports.createSendCmd = createSendCmd;
module.exports.createSequenceCmd = createSequenceCmd;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.OPTIONS = OPTIONS;
