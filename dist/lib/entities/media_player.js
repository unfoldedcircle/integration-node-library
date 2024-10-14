/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import { TYPES as ENTITYTYPES } from "./entity.js";
import Entity from "./entity.js";
import log from "../loggers.js";
/**
 * Media-player entity states.
 */
var STATES;
(function (STATES) {
    STATES["UNAVAILABLE"] = "UNAVAILABLE";
    STATES["UNKNOWN"] = "UNKNOWN";
    STATES["ON"] = "ON";
    STATES["OFF"] = "OFF";
    STATES["PLAYING"] = "PLAYING";
    STATES["PAUSED"] = "PAUSED";
    STATES["STANDBY"] = "STANDBY";
    STATES["BUFFERING"] = "BUFFERING";
})(STATES || (STATES = {}));
/**
 * Media-player entity features.
 */
var FEATURES;
(function (FEATURES) {
    FEATURES["ON_OFF"] = "on_off";
    FEATURES["TOGGLE"] = "toggle";
    FEATURES["VOLUME"] = "volume";
    FEATURES["VOLUME_UP_DOWN"] = "volume_up_down";
    FEATURES["MUTE_TOGGLE"] = "mute_toggle";
    FEATURES["MUTE"] = "mute";
    FEATURES["UNMUTE"] = "unmute";
    FEATURES["PLAY_PAUSE"] = "play_pause";
    FEATURES["STOP"] = "stop";
    FEATURES["NEXT"] = "next";
    FEATURES["PREVIOUS"] = "previous";
    FEATURES["FAST_FORWARD"] = "fast_forward";
    FEATURES["REWIND"] = "rewind";
    FEATURES["REPEAT"] = "repeat";
    FEATURES["SHUFFLE"] = "shuffle";
    FEATURES["SEEK"] = "seek";
    FEATURES["MEDIA_DURATION"] = "media_duration";
    FEATURES["MEDIA_POSITION"] = "media_position";
    FEATURES["MEDIA_TITLE"] = "media_title";
    FEATURES["MEDIA_ARTIST"] = "media_artist";
    FEATURES["MEDIA_ALBUM"] = "media_album";
    FEATURES["MEDIA_IMAGE_URL"] = "media_image_url";
    FEATURES["MEDIA_TYPE"] = "media_type";
    FEATURES["DPAD"] = "dpad";
    FEATURES["NUMPAD"] = "numpad";
    FEATURES["HOME"] = "home";
    FEATURES["MENU"] = "menu";
    FEATURES["CONTEXT_MENU"] = "context_menu";
    FEATURES["GUIDE"] = "guide";
    FEATURES["INFO"] = "info";
    FEATURES["COLOR_BUTTONS"] = "color_buttons";
    FEATURES["CHANNEL_SWITCHER"] = "channel_switcher";
    FEATURES["SELECT_SOURCE"] = "select_source";
    FEATURES["SELECT_SOUND_MODE"] = "select_sound_mode";
    FEATURES["EJECT"] = "eject";
    FEATURES["OPEN_CLOSE"] = "open_close";
    FEATURES["AUDIO_TRACK"] = "audio_track";
    FEATURES["SUBTITLE"] = "subtitle";
    FEATURES["RECORD"] = "record";
    FEATURES["SETTINGS"] = "settings";
})(FEATURES || (FEATURES = {}));
/**
 * Media-player entity attributes.
 */
var ATTRIBUTES;
(function (ATTRIBUTES) {
    ATTRIBUTES["STATE"] = "state";
    ATTRIBUTES["VOLUME"] = "volume";
    ATTRIBUTES["MUTED"] = "muted";
    ATTRIBUTES["MEDIA_DURATION"] = "media_duration";
    ATTRIBUTES["MEDIA_POSITION"] = "media_position";
    ATTRIBUTES["MEDIA_TYPE"] = "media_type";
    ATTRIBUTES["MEDIA_IMAGE_URL"] = "media_image_url";
    ATTRIBUTES["MEDIA_TITLE"] = "media_title";
    ATTRIBUTES["MEDIA_ARTIST"] = "media_artist";
    ATTRIBUTES["MEDIA_ALBUM"] = "media_album";
    ATTRIBUTES["REPEAT"] = "repeat";
    ATTRIBUTES["SHUFFLE"] = "shuffle";
    ATTRIBUTES["SOURCE"] = "source";
    ATTRIBUTES["SOURCE_LIST"] = "source_list";
    ATTRIBUTES["SOUND_MODE"] = "sound_mode";
    ATTRIBUTES["SOUND_MODE_LIST"] = "sound_mode_list";
})(ATTRIBUTES || (ATTRIBUTES = {}));
/**
 * Media-player entity commands.
 */
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["ON"] = "on";
    COMMANDS["OFF"] = "off";
    COMMANDS["TOGGLE"] = "toggle";
    COMMANDS["PLAY_PAUSE"] = "play_pause";
    COMMANDS["STOP"] = "stop";
    COMMANDS["PREVIOUS"] = "previous";
    COMMANDS["NEXT"] = "next";
    COMMANDS["FAST_FORWARD"] = "fast_forward";
    COMMANDS["REWIND"] = "rewind";
    COMMANDS["SEEK"] = "seek";
    COMMANDS["VOLUME"] = "volume";
    COMMANDS["VOLUME_UP"] = "volume_up";
    COMMANDS["VOLUME_DOWN"] = "volume_down";
    COMMANDS["MUTE_TOGGLE"] = "mute_toggle";
    COMMANDS["MUTE"] = "mute";
    COMMANDS["UNMUTE"] = "unmute";
    COMMANDS["REPEAT"] = "repeat";
    COMMANDS["SHUFFLE"] = "shuffle";
    COMMANDS["CHANNEL_UP"] = "channel_up";
    COMMANDS["CHANNEL_DOWN"] = "channel_down";
    COMMANDS["CURSOR_UP"] = "cursor_up";
    COMMANDS["CURSOR_DOWN"] = "cursor_down";
    COMMANDS["CURSOR_LEFT"] = "cursor_left";
    COMMANDS["CURSOR_RIGHT"] = "cursor_right";
    COMMANDS["CURSOR_ENTER"] = "cursor_enter";
    COMMANDS["DIGIT_0"] = "digit_0";
    COMMANDS["DIGIT_1"] = "digit_1";
    COMMANDS["DIGIT_2"] = "digit_2";
    COMMANDS["DIGIT_3"] = "digit_3";
    COMMANDS["DIGIT_4"] = "digit_4";
    COMMANDS["DIGIT_5"] = "digit_5";
    COMMANDS["DIGIT_6"] = "digit_6";
    COMMANDS["DIGIT_7"] = "digit_7";
    COMMANDS["DIGIT_8"] = "digit_8";
    COMMANDS["DIGIT_9"] = "digit_9";
    COMMANDS["FUNCTION_RED"] = "function_red";
    COMMANDS["FUNCTION_GREEN"] = "function_green";
    COMMANDS["FUNCTION_YELLOW"] = "function_yellow";
    COMMANDS["FUNCTION_BLUE"] = "function_blue";
    COMMANDS["HOME"] = "home";
    COMMANDS["MENU"] = "menu";
    COMMANDS["CONTEXT_MENU"] = "context_menu";
    COMMANDS["GUIDE"] = "guide";
    COMMANDS["INFO"] = "info";
    COMMANDS["BACK"] = "back";
    COMMANDS["SELECT_SOURCE"] = "select_source";
    COMMANDS["SELECT_SOUND_MODE"] = "select_sound_mode";
    COMMANDS["RECORD"] = "record";
    COMMANDS["MY_RECORDINGS"] = "my_recordings";
    COMMANDS["LIVE"] = "live";
    COMMANDS["EJECT"] = "eject";
    COMMANDS["OPEN_CLOSE"] = "open_close";
    COMMANDS["AUDIO_TRACK"] = "audio_track";
    COMMANDS["SUBTITLE"] = "subtitle";
    COMMANDS["SETTINGS"] = "settings";
    COMMANDS["SEARCH"] = "search";
})(COMMANDS || (COMMANDS = {}));
/**
 * Media-player entity device classes.
 */
var DEVICECLASSES;
(function (DEVICECLASSES) {
    DEVICECLASSES["RECEIVER"] = "receiver";
    DEVICECLASSES["SET_TOP_BOX"] = "set_top_box";
    DEVICECLASSES["SPEAKER"] = "speaker";
    DEVICECLASSES["STREAMING_BOX"] = "streaming_box";
    DEVICECLASSES["TV"] = "tv";
})(DEVICECLASSES || (DEVICECLASSES = {}));
/**
 * Media-player entity options.
 */
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["SIMPLE_COMMANDS"] = "simple_commands";
    OPTIONS["VOLUME_STEPS"] = "volume_steps";
})(OPTIONS || (OPTIONS = {}));
/**
 * Media types.
 */
var MEDIATYPE;
(function (MEDIATYPE) {
    MEDIATYPE["MUSIC"] = "MUSIC";
    MEDIATYPE["RADIO"] = "RADIO";
    MEDIATYPE["TVSHOW"] = "TVSHOW";
    MEDIATYPE["MOVIE"] = "MOVIE";
    MEDIATYPE["VIDEO"] = "VIDEO";
})(MEDIATYPE || (MEDIATYPE = {}));
/**
 * Repeat modes.
 */
var REPEATMODE;
(function (REPEATMODE) {
    REPEATMODE["OFF"] = "OFF";
    REPEATMODE["ALL"] = "ALL";
    REPEATMODE["ONE"] = "ONE";
})(REPEATMODE || (REPEATMODE = {}));
class MediaPlayer extends Entity {
    /**
     * Constructs a new media-player entity.
     *
     * @param {string} id The entity identifier. Must be unique inside the integration driver.
     * @param {string | Map<string, string> | Record<string, string>} name The human-readable name of the entity.
     *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
     * @param {MediaPlayerParams} [params] Entity parameters.
     * @throws AssertionError if invalid parameters are specified.
     */
    constructor(id, name, { features, attributes, deviceClass, options, area, cmdHandler } = {}) {
        let entityName;
        if (typeof name === "string") {
            entityName = name;
        }
        else if (name instanceof Map) {
            entityName = name;
        }
        else {
            entityName = new Map(Object.entries(name));
        }
        super(id, entityName, ENTITYTYPES.MEDIA_PLAYER, { features, attributes, deviceClass, options, area, cmdHandler });
        log.debug(`MediaPlayer entity created with id: ${this.id}`);
    }
}
export default MediaPlayer;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS, MEDIATYPE, REPEATMODE };
