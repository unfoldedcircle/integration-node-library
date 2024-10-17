/**
 * User interface definitions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import assert from "node:assert";

// Physical buttons
export enum BUTTONS {
  BACK = "BACK",
  HOME = "HOME",
  VOICE = "VOICE",
  VOLUME_UP = "VOLUME_UP",
  VOLUME_DOWN = "VOLUME_DOWN",
  MUTE = "MUTE",
  DPAD_UP = "DPAD_UP",
  DPAD_DOWN = "DPAD_DOWN",
  DPAD_LEFT = "DPAD_LEFT",
  DPAD_RIGHT = "DPAD_RIGHT",
  DPAD_MIDDLE = "DPAD_MIDDLE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
  BLUE = "BLUE",
  CHANNEL_UP = "CHANNEL_UP",
  CHANNEL_DOWN = "CHANNEL_DOWN",
  PREV = "PREV",
  PLAY = "PLAY",
  NEXT = "NEXT",
  POWER = "POWER"
}

// Remote command definition for a button mapping or UI page definition.
export class EntityCommand {
  cmd_id: string;
  params?: Record<string, string | number | string[]>;

  constructor(cmdId: string, params?: Record<string, string | number | string[]>) {
    this.cmd_id = cmdId;
    this.params = params;
  }
}

// Physical button command mapping.
export class DeviceButtonMapping {
  button: BUTTONS;
  short_press?: EntityCommand;
  long_press?: EntityCommand;

  constructor(button: BUTTONS, shortPress?: EntityCommand, longPress?: EntityCommand) {
    assert(
      shortPress === undefined || shortPress instanceof EntityCommand,
      "shortPress parameter must be an EntityCommand"
    );
    assert(
      longPress === undefined || longPress instanceof EntityCommand,
      "longPress parameter must be an EntityCommand"
    );
    this.button = button;
    this.short_press = shortPress;
    this.long_press = longPress;
  }
}

/**
 * Create a physical button command mapping.
 * @param button - Physical button identifier, one of BUTTONS.
 * @param short - Associated short-press command to the physical button.
 * @param long - Associated long-press command to the physical button.
 * @returns the created DeviceButtonMapping
 * @throws AssertionError if shortPress or longPress arguments are of a wrong type.
 */
export function createBtnMapping(
  button: BUTTONS,
  short?: string | EntityCommand,
  long?: string | EntityCommand
): DeviceButtonMapping {
  if (typeof short === "string") {
    short = new EntityCommand(short);
  }
  if (typeof long === "string") {
    long = new EntityCommand(long);
  }
  return new DeviceButtonMapping(button, short, long);
}

// Item size in the button grid. Default size if not specified: 1x1.
export class Size {
  width: number;
  height: number;

  constructor(width: number = 1, height: number = 1) {
    this.width = width;
    this.height = height;
  }
}

// Button placement in the grid with 0-based coordinates.
export class Location {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// A user interface item is either an icon or text.
export class UiItem {
  type: "icon" | "text";
  location: Location;
  size?: Size;
  icon?: string;
  text?: string;
  command?: EntityCommand;

  constructor(
    type: "icon" | "text",
    location: Location,
    { size, icon, text, command }: { size?: Size; icon?: string; text?: string; command?: EntityCommand }
  ) {
    assert(location instanceof Location, "location parameter must be of type Location");
    assert(size === undefined || size instanceof Size, "size parameter must be of type Size");
    assert(icon === undefined || typeof icon === "string", "icon parameter must be of type string");
    assert(text === undefined || typeof text === "string", "text parameter must be of type string");
    assert(
      command === undefined || command instanceof EntityCommand,
      "command parameter must be of type EntityCommand"
    );
    this.type = type;
    this.location = location;
    this.size = size;
    this.icon = icon;
    this.text = text;
    this.command = command;
  }
}

/**
 * Create a text UI item.
 * @param text - The text to show in the UI item.
 * @param x - x-position, 0-based.
 * @param y - y-position, 0-based.
 * @param command - Associated command to the text item.
 * @param size - Item size, defaults to 1 x 1 if not specified.
 * @returns the created UiItem
 * @throws AssertionError if invalid parameters are specified.
 */
export function createUiText(
  text: string,
  x: number,
  y: number,
  command?: string | EntityCommand,
  size?: Size
): UiItem {
  if (typeof command === "string") {
    command = new EntityCommand(command);
  }
  return new UiItem("text", new Location(x, y), { size, text, command });
}

/**
 * Create an icon UI item.
 * @param icon - The icon identifier of the icon to show in the UI item.
 * @param x - x-position, 0-based.
 * @param y - y-position, 0-based.
 * @param command - Associated command to the icon item.
 * @param size - Item size, defaults to 1 x 1 if not specified.
 * @returns the created UiItem
 * @throws AssertionError if invalid parameters are specified.
 */
export function createUiIcon(
  icon: string,
  x: number,
  y: number,
  command?: string | EntityCommand,
  size?: Size
): UiItem {
  if (typeof command === "string") {
    command = new EntityCommand(command);
  }
  return new UiItem("icon", new Location(x, y), { size, icon, command });
}

// Definition of a complete user interface page.
export class UiPage {
  page_id: string;
  name: string;
  grid: Size;
  items: UiItem[];

  constructor(pageId: string, name: string, grid?: Size, items?: UiItem[]) {
    this.page_id = pageId;
    this.name = name;
    this.grid = grid || new Size(4, 6);
    this.items = items || [];
  }

  /**
   * Append the given UiItem to the page items.
   * @param item - The UI item to add.
   */
  add(item: UiItem) {
    this.items.push(item);
  }
}
