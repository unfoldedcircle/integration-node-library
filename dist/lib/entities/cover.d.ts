/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { CommandHandler } from "./entity.js";
import Entity from "./entity.js";
declare enum STATES {
    UNAVAILABLE = "UNAVAILABLE",
    UNKNOWN = "UNKNOWN",
    OPENING = "OPENING",
    OPEN = "OPEN",
    CLOSING = "CLOSING",
    CLOSED = "CLOSED"
}
declare enum FEATURES {
    OPEN = "open",
    CLOSE = "close",
    STOP = "stop",
    POSITION = "position",
    TILT = "tilt",
    TILT_STOP = "tilt_stop",
    TILT_POSITION = "tilt_position"
}
declare enum ATTRIBUTES {
    STATE = "state",
    POSITION = "position",
    TILT_POSITION = "tilt_position"
}
declare enum COMMANDS {
    OPEN = "open",
    CLOSE = "close",
    STOP = "stop",
    POSITION = "position",
    TILT = "tilt",
    TILT_UP = "tilt_up",
    TILT_DOWN = "tilt_down",
    TILT_STOP = "tilt_stop"
}
declare enum DEVICECLASSES {
    BLIND = "blind",
    CURTAIN = "curtain",
    GARAGE = "garage",
    SHADE = "shade",
    DOOR = "door",
    GATE = "gate",
    WINDOW = "window"
}
declare enum OPTIONS {
}
interface CoverParams {
    features?: string[];
    attributes?: Partial<Record<ATTRIBUTES, STATES | number | boolean | string>>;
    deviceClass?: string;
    options?: Partial<Record<OPTIONS, number | string | boolean>> | null;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
declare class Cover extends Entity {
    /**
     * Constructs a new cover entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {CoverParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { features, attributes, deviceClass, options, area, cmdHandler }?: CoverParams);
}
export default Cover;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
