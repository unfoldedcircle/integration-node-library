/**
 * User interface definitions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import assert from "node:assert";
// Physical buttons
var BUTTONS;
(function (BUTTONS) {
    BUTTONS["BACK"] = "BACK";
    BUTTONS["HOME"] = "HOME";
    BUTTONS["VOICE"] = "VOICE";
    BUTTONS["VOLUME_UP"] = "VOLUME_UP";
    BUTTONS["VOLUME_DOWN"] = "VOLUME_DOWN";
    BUTTONS["MUTE"] = "MUTE";
    BUTTONS["DPAD_UP"] = "DPAD_UP";
    BUTTONS["DPAD_DOWN"] = "DPAD_DOWN";
    BUTTONS["DPAD_LEFT"] = "DPAD_LEFT";
    BUTTONS["DPAD_RIGHT"] = "DPAD_RIGHT";
    BUTTONS["DPAD_MIDDLE"] = "DPAD_MIDDLE";
    BUTTONS["GREEN"] = "GREEN";
    BUTTONS["YELLOW"] = "YELLOW";
    BUTTONS["RED"] = "RED";
    BUTTONS["BLUE"] = "BLUE";
    BUTTONS["CHANNEL_UP"] = "CHANNEL_UP";
    BUTTONS["CHANNEL_DOWN"] = "CHANNEL_DOWN";
    BUTTONS["PREV"] = "PREV";
    BUTTONS["PLAY"] = "PLAY";
    BUTTONS["NEXT"] = "NEXT";
    BUTTONS["POWER"] = "POWER";
})(BUTTONS || (BUTTONS = {}));
// Remote command definition for a button mapping or UI page definition.
class EntityCommand {
    cmd_id;
    params;
    constructor(cmdId, params) {
        this.cmd_id = cmdId;
        this.params = params;
    }
}
// Physical button command mapping.
class DeviceButtonMapping {
    button;
    short_press;
    long_press;
    constructor(button, shortPress, longPress) {
        assert(shortPress === undefined || shortPress instanceof EntityCommand, "shortPress parameter must be an EntityCommand");
        assert(longPress === undefined || longPress instanceof EntityCommand, "longPress parameter must be an EntityCommand");
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
function createBtnMapping(button, short, long) {
    if (typeof short === "string") {
        short = new EntityCommand(short);
    }
    if (typeof long === "string") {
        long = new EntityCommand(long);
    }
    return new DeviceButtonMapping(button, short, long);
}
// Item size in the button grid. Default size if not specified: 1x1.
class Size {
    width;
    height;
    constructor(width = 1, height = 1) {
        this.width = width;
        this.height = height;
    }
}
// Button placement in the grid with 0-based coordinates.
class Location {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// A user interface item is either an icon or text.
class UiItem {
    type;
    location;
    size;
    icon;
    text;
    command;
    constructor(type, location, { size, icon, text, command }) {
        assert(location instanceof Location, "location parameter must be of type Location");
        assert(size === undefined || size instanceof Size, "size parameter must be of type Size");
        assert(icon === undefined || typeof icon === "string", "icon parameter must be of type string");
        assert(text === undefined || typeof text === "string", "text parameter must be of type string");
        assert(command === undefined || command instanceof EntityCommand, "command parameter must be of type EntityCommand");
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
function createUiText(text, x, y, command, size) {
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
function createUiIcon(icon, x, y, command, size) {
    if (typeof command === "string") {
        command = new EntityCommand(command);
    }
    return new UiItem("icon", new Location(x, y), { size, icon, command });
}
// Definition of a complete user interface page.
class UiPage {
    page_id;
    name;
    grid;
    items;
    constructor(pageId, name, grid, items) {
        this.page_id = pageId;
        this.name = name;
        this.grid = grid || new Size(4, 6);
        this.items = items || [];
    }
    /**
     * Append the given UiItem to the page items.
     * @param item - The UI item to add.
     */
    add(item) {
        this.items.push(item);
    }
}
export { BUTTONS, EntityCommand, DeviceButtonMapping, createBtnMapping, Size, Location, UiItem, createUiText, createUiIcon, UiPage };
