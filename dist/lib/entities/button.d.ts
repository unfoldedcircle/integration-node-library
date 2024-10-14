/**
 * Button-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { CommandHandler } from "./entity.js";
import Entity from "./entity.js";
declare enum STATES {
    UNAVAILABLE = "UNAVAILABLE",
    AVAILABLE = "AVAILABLE"
}
declare enum ATTRIBUTES {
    STATE = "state"
}
declare enum COMMANDS {
    PUSH = "push"
}
interface ButtonParams {
    state?: STATES;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_button.md button entity documentation}
 * for more information.
 */
declare class Button extends Entity {
    /**
     * Constructs a new button entity.
     *
     * - The one-and-only `press` feature is automatically added.
     * - STATES.AVAILABLE is set if no entity-state is provided.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {ButtonParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, { state, area, cmdHandler }?: ButtonParams);
}
export default Button;
export { STATES, ATTRIBUTES, COMMANDS };
