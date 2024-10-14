/**
 * User interface definitions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
declare enum BUTTONS {
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
declare class EntityCommand {
    cmd_id: string;
    params?: Record<string, string | number | string[]>;
    constructor(cmdId: string, params?: Record<string, string | number | string[]>);
}
declare class DeviceButtonMapping {
    button: BUTTONS;
    short_press?: EntityCommand;
    long_press?: EntityCommand;
    constructor(button: BUTTONS, shortPress?: EntityCommand, longPress?: EntityCommand);
}
/**
 * Create a physical button command mapping.
 * @param button - Physical button identifier, one of BUTTONS.
 * @param short - Associated short-press command to the physical button.
 * @param long - Associated long-press command to the physical button.
 * @returns the created DeviceButtonMapping
 * @throws AssertionError if shortPress or longPress arguments are of a wrong type.
 */
declare function createBtnMapping(button: BUTTONS, short?: string | EntityCommand, long?: string | EntityCommand): DeviceButtonMapping;
declare class Size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
}
declare class Location {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
declare class UiItem {
    type: "icon" | "text";
    location: Location;
    size?: Size;
    icon?: string;
    text?: string;
    command?: EntityCommand;
    constructor(type: "icon" | "text", location: Location, { size, icon, text, command }: {
        size?: Size;
        icon?: string;
        text?: string;
        command?: EntityCommand;
    });
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
declare function createUiText(text: string, x: number, y: number, command?: string | EntityCommand, size?: Size): UiItem;
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
declare function createUiIcon(icon: string, x: number, y: number, command?: string | EntityCommand, size?: Size): UiItem;
declare class UiPage {
    page_id: string;
    name: string;
    grid: Size;
    items: UiItem[];
    constructor(pageId: string, name: string, grid?: Size, items?: UiItem[]);
    /**
     * Append the given UiItem to the page items.
     * @param item - The UI item to add.
     */
    add(item: UiItem): void;
}
export { BUTTONS, EntityCommand, DeviceButtonMapping, createBtnMapping, Size, Location, UiItem, createUiText, createUiIcon, UiPage };
