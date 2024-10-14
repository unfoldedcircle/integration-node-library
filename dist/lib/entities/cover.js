/**
 * Cover-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import Entity from "./entity.js";
import log from "../loggers.js";
// Cover entity states
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["OPENING"] = "OPENING";
    STATES["OPEN"] = "OPEN";
    STATES["CLOSING"] = "CLOSING";
    STATES["CLOSED"] = "CLOSED";
})(STATES || (STATES = {}));
// Cover entity features
var FEATURES;
(function (FEATURES) {
    FEATURES["OPEN"] = "open";
    FEATURES["CLOSE"] = "close";
    FEATURES["STOP"] = "stop";
    FEATURES["POSITION"] = "position";
    FEATURES["TILT"] = "tilt";
    FEATURES["TILT_STOP"] = "tilt_stop";
    FEATURES["TILT_POSITION"] = "tilt_position";
})(FEATURES || (FEATURES = {}));
// Cover entity attributes
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
    ATTRIBUTES["POSITION"] = "position";
    ATTRIBUTES["TILT_POSITION"] = "tilt_position";
})(ATTRIBUTES || (ATTRIBUTES = {}));
// Cover entity commands
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["OPEN"] = "open";
    COMMANDS["CLOSE"] = "close";
    COMMANDS["STOP"] = "stop";
    COMMANDS["POSITION"] = "position";
    COMMANDS["TILT"] = "tilt";
    COMMANDS["TILT_UP"] = "tilt_up";
    COMMANDS["TILT_DOWN"] = "tilt_down";
    COMMANDS["TILT_STOP"] = "tilt_stop";
})(COMMANDS || (COMMANDS = {}));
// Cover entity device classes
var DEVICECLASSES;
(function (DEVICECLASSES) {
    DEVICECLASSES["BLIND"] = "blind";
    DEVICECLASSES["CURTAIN"] = "curtain";
    DEVICECLASSES["GARAGE"] = "garage";
    DEVICECLASSES["SHADE"] = "shade";
    DEVICECLASSES["DOOR"] = "door";
    DEVICECLASSES["GATE"] = "gate";
    DEVICECLASSES["WINDOW"] = "window";
})(DEVICECLASSES || (DEVICECLASSES = {}));
// Cover entity options
var OPTIONS;
(function (OPTIONS) {
})(OPTIONS || (OPTIONS = {}));
class Cover extends Entity {
    /**
     * Constructs a new cover entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {CoverParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features = [], attributes = {}, deviceClass, options = null, area, cmdHandler } = {}) {
        super(id, name, ENTITYTYPES.COVER, { features, attributes, deviceClass, options, area, cmdHandler });
        log.debug(`Cover entity created with id: ${this.id}`);
    }
}
export default Cover;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS };
