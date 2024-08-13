/**
 * User interface definitions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

const assert = require("node:assert");
/**
 * Physical buttons.
 * @type {{CHANNEL_UP: string, BLUE: string, POWER: string, VOLUME_DOWN: string, GREEN: string, RED: string, PLAY: string, VOICE: string, DPAD_UP: string, DPAD_DOWN: string, PREV: string, DPAD_RIGHT: string, NEXT: string, BACK: string, DPAD_MIDDLE: string, CHANNEL_DOWN: string, YELLOW: string, VOLUME_UP: string, MUTE: string, HOME: string, DPAD_LEFT: string}}
 */
const BUTTONS = {
  BACK: "BACK",
  HOME: "HOME",
  VOICE: "VOICE",
  VOLUME_UP: "VOLUME_UP",
  VOLUME_DOWN: "VOLUME_DOWN",
  MUTE: "MUTE",
  DPAD_UP: "DPAD_UP",
  DPAD_DOWN: "DPAD_DOWN",
  DPAD_LEFT: "DPAD_LEFT",
  DPAD_RIGHT: "DPAD_RIGHT",
  DPAD_MIDDLE: "DPAD_MIDDLE",
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED: "RED",
  BLUE: "BLUE",
  CHANNEL_UP: "CHANNEL_UP",
  CHANNEL_DOWN: "CHANNEL_DOWN",
  PREV: "PREV",
  PLAY: "PLAY",
  NEXT: "NEXT",
  POWER: "POWER"
};

/**
 * Remote command definition for a button mapping or UI page definition.
 */
class EntityCommand {
  /**
   * Constructs a new EntityCommand.
   * @param {string} cmdId - Command identifier.
   * @param {Object.<string, (string|number|Array<string>)>} [params] - Optional parameters for the command.
   */
  constructor(cmdId, params) {
    this.cmd_id = cmdId;
    this.params = params;
  }
}

/**
 * Physical button command mapping.
 */
class DeviceButtonMapping {
  /**
   * Constructs a new Physical button command mapping.
   * @param {string} button - Physical button identifier.
   * @param {EntityCommand} [shortPress] - Short press command of the button.
   * @param {EntityCommand} [longPress] - Long press command of the button.
   * @throws AssertionError if shortPress or longPress arguments are of a wrong type.
   */
  constructor(button, shortPress, longPress) {
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
 * @param {string} button physical button identifier, one of {@link BUTTONS}.
 * @param {string|EntityCommand} [short] associated short-press command to the physical button.
 *              A string parameter corresponds to a simple command, whereas an
 *              ``EntityCommand`` allows to customize the command.
 * @param {string|EntityCommand} [long] associated long-press command to the physical button
 * @return {DeviceButtonMapping} the created DeviceButtonMapping
 * @throws AssertionError if shortPress or longPress arguments are of a wrong type.
 */
function createBtnMapping(button, short, long) {
  if (typeof short === "string") {
    short = new EntityCommand(short);
  }
  if (typeof long === "string") {
    long = new EntityCommand(long);
  }
  return new DeviceButtonMapping(button, short, long);
}

/**
 * Item size in the button grid. Default size if not specified: 1x1.
 */
class Size {
  /**
   * Constructs a new Size.
   * @param {number} [width=1] - Width of the item.
   * @param {number} [height=1] - Height of the item.
   */
  constructor(width = 1, height = 1) {
    this.width = width;
    this.height = height;
  }
}

/**
 * Button placement in the grid with 0-based coordinates.
 */
class Location {
  /**
   * Constructs a new Location.
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * A user interface item is either an icon or text.
 *
 * - Icon and text items can be static or linked to a command specified in the `command` field.
 * - Default size is 1x1 if not specified.
 */
class UiItem {
  /**
   * Constructs a new UiItem
   * @param {string} type - Type of the UI item ("icon" or "text").
   * @param {Location} location - Location of the item in the grid.
   * @param {Size} [size] - Size of the item.
   * @param {string} [icon] - Icon identifier.
   * @param {string} [text] - Text to display.
   * @param {EntityCommand} [command] - Associated command.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(type, location, size, icon, text, command) {
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
 * @param {string} text the text to show in the UI item.
 * @param {number} x x-position, 0-based.
 * @param {number} y y-position, 0-based.
 * @param {string|EntityCommand} [cmd] associated command to the text item. A string parameter corresponds to
 *            a simple command, whereas an ``EntityCommand`` allows to customize the
 *            command for example with number of repeats.
 * @param {Size} [size] item size, defaults to 1 x 1 if not specified.
 * @return {UiItem} the created UiItem
 * @throws AssertionError if invalid parameters are specified.
 */
function createUiText(text, x, y, cmd, size) {
  if (typeof cmd === "string") {
    cmd = new EntityCommand(cmd);
  }
  return new UiItem("text", new Location(x, y), size, undefined, text, cmd);
}

/**
 * Create an icon UI item.
 *
 * The icon identifier consists of a prefix and a resource identifier,
 * separated by `:`. Available prefixes:
 *   - `uc:` - integrated icon font
 *   - `custom:` - custom resource
 * @param {string} icon the icon identifier of the icon to show in the UI item.
 * @param {number} x x-position, 0-based.
 * @param {number} y y-position, 0-based.
 * @param {string|EntityCommand} [cmd] associated command to the text item. A string parameter corresponds to
 *            a simple command, whereas an `EntityCommand` allows to customize the
 *            command for example with number of repeats.
 * @param {Size} [size] item size, defaults to 1 x 1 if not specified.
 * @return {UiItem} the created UiItem
 * @throws AssertionError if invalid parameters are specified.
 */
function createUiIcon(icon, x, y, cmd, size) {
  if (typeof cmd === "string") {
    cmd = new EntityCommand(cmd);
  }
  return new UiItem("icon", new Location(x, y), size, icon, undefined, cmd);
}

/**
 * Definition of a complete user interface page.
 */
class UiPage {
  /**
   * Constructs a new UiPage.
   *
   * Default grid size is 4x6 if not specified.
   * @param {string} pageId - Page identifier.
   * @param {string} name - Page name.
   * @param {Size} [grid] - Grid size.
   * @param {Array<UiItem>} [items] - List of UI items on the page.
   */
  constructor(pageId, name, grid, items) {
    this.page_id = pageId;
    this.name = name;
    this.grid = grid || new Size(4, 6);
    this.items = items || [];
  }

  /**
   * Append the given UiItem to the page items.
   * @param {UiItem} item - The UI item to add.
   */
  add(item) {
    this.items.push(item);
  }
}

module.exports = {
  BUTTONS,
  EntityCommand,
  DeviceButtonMapping,
  createBtnMapping,
  Size,
  Location,
  UiItem,
  createUiText,
  createUiIcon,
  UiPage
};
