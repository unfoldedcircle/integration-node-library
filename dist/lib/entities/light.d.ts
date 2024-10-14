/**
 * Light-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { CommandHandler } from "./entity.js";
import Entity from "./entity.js";
/**
 * Light entity states.
 */
declare enum STATES {
    UNAVAILABLE = "UNAVAILABLE",
    UNKNOWN = "UNKNOWN",
    ON = "ON",
    OFF = "OFF"
}
/**
 * Light entity features.
 */
declare enum FEATURES {
    ON_OFF = "on_off",
    TOGGLE = "toggle",
    DIM = "dim",
    COLOR = "color",
    COLOR_TEMPERATURE = "color_temperature"
}
/**
 * Light entity attributes.
 */
declare enum ATTRIBUTES {
    STATE = "state",
    HUE = "hue",
    SATURATION = "saturation",
    BRIGHTNESS = "brightness",
    COLOR_TEMPERATURE = "color_temperature"
}
/**
 * Light entity commands.
 */
declare enum COMMANDS {
    ON = "on",
    OFF = "off",
    TOGGLE = "toggle"
}
/**
 * Light entity device classes.
 */
declare const DEVICECLASSES: Record<string, unknown>;
/**
 * Light entity options.
 */
declare enum OPTIONS {
    COLOR_TEMPERATURE_STEPS = "color_temperature_steps"
}
interface LightParams {
    features?: string[];
    attributes?: Partial<Record<ATTRIBUTES, STATES | number | boolean | string>>;
    deviceClass?: string;
    options?: Partial<Record<OPTIONS, number | string | boolean>> | null;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_light.md light entity documentation}
 * for more information.
 */
declare class Light extends Entity {
    /**
     * Constructs a new light entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {LightParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { features, attributes, deviceClass, options, area }?: LightParams);
}
export default Light;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
