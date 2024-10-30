/**
 * Remote-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { CommandHandler, Entity, EntityType, EntityName } from "./entity.js";
import { DeviceButtonMapping, EntityCommand, UiPage } from "./ui.js";
import log from "../loggers.js";
import assert from "node:assert";

/**
 * Remote entity states.
 */
export enum States {
  Unavailable = "UNAVAILABLE",
  Unknown = "UNKNOWN",
  On = "ON",
  Off = "OFF"
}

/**
 * Remote-entity features.
 */
export enum Features {
  OnOff = "on_off",
  Toggle = "toggle",
  SendCmd = "send_cmd"
}

/**
 * Remote-entity attributes.
 */
export enum Attributes {
  State = "state"
}

/**
 * Remote-entity commands.
 */
export enum Commands {
  On = "on",
  Off = "off",
  Toggle = "toggle",
  SendCmd = "send_cmd",
  SendCmdSequence = "send_cmd_sequence"
}

/**
 * Remote-entity options.
 */
export enum Options {
  SimpleCommands = "simple_commands",
  ButtonMapping = "button_mapping",
  UserInterface = "user_interface"
}

/**
 * Create a remote-entity send command.
 * @param command command to send.
 * @param params optional named parameters
 * @param params.delay optional delay in milliseconds after the command or between repeats.
 * @param params.repeat optional repeat count of the command.
 * @param params.hold optional hold time in milliseconds.
 * @return EntityCommand the created EntityCommand.
 * @throws AssertionError if command is not specified or is empty.
 */
export function createSendCmd(
  command: string | undefined,
  { delay, repeat, hold }: { delay?: number; repeat?: number; hold?: number } = {}
): EntityCommand {
  assert(command && command.length > 0, "command must be a string and may not be empty");

  const params: Record<string, string | number> = { command };
  if (delay) {
    params.delay = delay;
  }
  if (repeat) {
    params.repeat = repeat;
  }
  if (hold) {
    params.hold = hold;
  }

  return new EntityCommand(Commands.SendCmd, params);
}

/**
 * Create a remote send sequence command.
 * @param sequence list of simple commands. An empty array is not valid.
 * @param params optional named parameters
 * @param params.delay optional delay in milliseconds between the commands in the sequence.
 * @param params.repeat optional repeat count of the sequence.
 * @return EntityCommand the created EntityCommand.
 * @throws AssertionError if sequence is not specified or doesn't contain at least one command.
 */
export function createSequenceCmd(
  sequence: string[] | undefined,
  { delay, repeat }: { delay?: number; repeat?: number } = {}
): EntityCommand {
  assert(
    sequence && Array.isArray(sequence) && sequence.length > 0,
    "sequence array must be specified and contain at least one command"
  );

  const params: Record<string, string[] | number> = { sequence };
  if (typeof delay === "number") {
    params.delay = delay;
  }
  if (typeof repeat === "number") {
    params.repeat = repeat;
  }

  return new EntityCommand(Commands.SendCmdSequence, params);
}

interface RemoteParams {
  features?: Features[];
  attributes?: Partial<Record<Attributes, States>>;
  simpleCommands?: string[];
  buttonMapping?: DeviceButtonMapping[];
  uiPages?: UiPage[];
  area?: string;
  cmdHandler?: CommandHandler;
}

export class Remote extends Entity {
  static States = States;
  static Features = Features;
  static Attributes = Attributes;
  static Commands = Commands;
  static Options = Options;

  /**
   * Constructs a new remote-entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   * @param params Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { features, attributes, simpleCommands, buttonMapping, uiPages, area, cmdHandler }: RemoteParams = {}
  ) {
    const options: { [key: string]: string | number | boolean | object } = {};
    if (simpleCommands) {
      options[Options.SimpleCommands] = simpleCommands;
    }
    if (buttonMapping) {
      options[Options.ButtonMapping] = buttonMapping;
    }
    if (uiPages) {
      options[Options.UserInterface] = { pages: uiPages };
    }

    super(id, name, EntityType.Remote, { features, attributes, options, area, cmdHandler });

    log.debug(`Remote entity created with id: ${this.id}`);
  }
}
