/**
 * Switch-entity definitions.
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
    ON = "ON",
    OFF = "OFF"
}
declare enum FEATURES {
    ON_OFF = "on_off",
    TOGGLE = "toggle"
}
declare enum ATTRIBUTES {
    STATE = "state"
}
declare enum COMMANDS {
    ON = "on",
    OFF = "off",
    TOGGLE = "toggle"
}
declare enum DEVICECLASSES {
    OUTLET = "outlet",
    SWITCH = "switch"
}
declare enum OPTIONS {
    READABLE = "readable"
}
interface SwitchParams {
    features?: string[];
    attributes?: Partial<Record<ATTRIBUTES, STATES>>;
    deviceClass?: DEVICECLASSES;
    options?: Record<OPTIONS, boolean>;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_switch.md switch entity documentation}
 * for more information.
 */
declare class Switch extends Entity {
    /**
     * Constructs a new switch entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {SwitchParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { features, attributes, deviceClass, options, area, cmdHandler }?: SwitchParams);
}
export default Switch;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
