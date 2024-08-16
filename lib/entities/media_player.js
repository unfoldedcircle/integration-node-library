/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
"use strict";

const Entity = require("./entity");

/**
 * Media-player entity states.
 *
 * @type {{UNAVAILABLE: string, UNKNOWN: string, ON: string, OFF: string, PLAYING: string, PAUSED: string, STANDBY: string, BUFFERING: string}}
 */
const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  ON: "ON",
  OFF: "OFF",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  STANDBY: "STANDBY",
  BUFFERING: "BUFFERING"
};

/**
 * Media-player entity features.
 *
 * @type {{REPEAT: string, TOGGLE: string, RECORD: string, UNMUTE: string, SHUFFLE: string, SETTINGS: string, GUIDE: string, INFO: string, MEDIA_DURATION: string, SUBTITLE: string, PREVIOUS: string, DPAD: string, SELECT_SOURCE: string, SELECT_SOUND_MODE: string, MEDIA_ALBUM: string, PLAY_PAUSE: string, NEXT: string, MEDIA_TYPE: string, REWIND: string, CHANNEL_SWITCHER: string, SEEK: string, EJECT: string, NUMPAD: string, VOLUME_UP_DOWN: string, STOP: string, FAST_FORWARD: string, VOLUME: string, AUDIO_TRACK: string, MEDIA_ARTIST: string, ON_OFF: string, MUTE_TOGGLE: string, COLOR_BUTTONS: string, MEDIA_TITLE: string, MEDIA_IMAGE_URL: string, MEDIA_POSITION: string, OPEN_CLOSE: string, MENU: string, MUTE: string, HOME: string, CONTEXT_MENU: string}}
 */
const FEATURES = {
  ON_OFF: "on_off",
  TOGGLE: "toggle",
  VOLUME: "volume",
  VOLUME_UP_DOWN: "volume_up_down",
  MUTE_TOGGLE: "mute_toggle",
  MUTE: "mute",
  UNMUTE: "unmute",
  PLAY_PAUSE: "play_pause",
  STOP: "stop",
  NEXT: "next",
  PREVIOUS: "previous",
  FAST_FORWARD: "fast_forward",
  REWIND: "rewind",
  REPEAT: "repeat",
  SHUFFLE: "shuffle",
  SEEK: "seek",
  MEDIA_DURATION: "media_duration",
  MEDIA_POSITION: "media_position",
  MEDIA_TITLE: "media_title",
  MEDIA_ARTIST: "media_artist",
  MEDIA_ALBUM: "media_album",
  MEDIA_IMAGE_URL: "media_image_url",
  MEDIA_TYPE: "media_type",
  DPAD: "dpad",
  NUMPAD: "numpad",
  HOME: "home",
  MENU: "menu",
  CONTEXT_MENU: "context_menu",
  GUIDE: "guide",
  INFO: "info",
  COLOR_BUTTONS: "color_buttons",
  CHANNEL_SWITCHER: "channel_switcher",
  SELECT_SOURCE: "select_source",
  SELECT_SOUND_MODE: "select_sound_mode",
  EJECT: "eject",
  OPEN_CLOSE: "open_close",
  AUDIO_TRACK: "audio_track",
  SUBTITLE: "subtitle",
  RECORD: "record",
  SETTINGS: "settings"
};

/**
 * Media-player entity attributes.
 *
 * @type {{REPEAT: string, SOURCE_LIST: string, VOLUME: string, SOUND_MODE_LIST: string, MEDIA_ARTIST: string, STATE: string, SHUFFLE: string, MEDIA_DURATION: string, MUTED: string, MEDIA_TITLE: string, MEDIA_IMAGE_URL: string, SOUND_MODE: string, MEDIA_POSITION: string, MEDIA_ALBUM: string, MEDIA_TYPE: string, SOURCE: string}}
 */
const ATTRIBUTES = {
  STATE: "state",
  VOLUME: "volume",
  MUTED: "muted",
  MEDIA_DURATION: "media_duration",
  MEDIA_POSITION: "media_position",
  MEDIA_TYPE: "media_type",
  MEDIA_IMAGE_URL: "media_image_url",
  MEDIA_TITLE: "media_title",
  MEDIA_ARTIST: "media_artist",
  MEDIA_ALBUM: "media_album",
  REPEAT: "repeat",
  SHUFFLE: "shuffle",
  SOURCE: "source",
  SOURCE_LIST: "source_list",
  SOUND_MODE: "sound_mode",
  SOUND_MODE_LIST: "sound_mode_list"
};

/**
 * Media-player entity commands.
 *
 * @type {{FUNCTION_BLUE: string, TOGGLE: string, RECORD: string, SHUFFLE: string, SETTINGS: string, INFO: string, SELECT_SOUND_MODE: string, CURSOR_DOWN: string, PLAY_PAUSE: string, FUNCTION_RED: string, CHANNEL_UP: string, STOP: string, FAST_FORWARD: string, SEARCH: string, VOLUME: string, AUDIO_TRACK: string, MUTE_TOGGLE: string, CURSOR_UP: string, FUNCTION_GREEN: string, FUNCTION_YELLOW: string, DIGIT_0: string, DIGIT_1: string, MUTE: string, DIGIT_6: string, DIGIT_7: string, DIGIT_8: string, DIGIT_9: string, REPEAT: string, DIGIT_2: string, DIGIT_3: string, DIGIT_4: string, DIGIT_5: string, UNMUTE: string, VOLUME_DOWN: string, GUIDE: string, SUBTITLE: string, OFF: string, PREVIOUS: string, LIVE: string, CURSOR_LEFT: string, SELECT_SOURCE: string, NEXT: string, REWIND: string, VOLUME_UP: string, SEEK: string, EJECT: string, ON: string, MY_RECORDINGS: string, CURSOR_ENTER: string, CURSOR_RIGHT: string, OPEN_CLOSE: string, BACK: string, CHANNEL_DOWN: string, MENU: string, HOME: string, CONTEXT_MENU: string}}
 */
const COMMANDS = {
  ON: "on",
  OFF: "off",
  TOGGLE: "toggle",
  PLAY_PAUSE: "play_pause",
  STOP: "stop",
  PREVIOUS: "previous",
  NEXT: "next",
  FAST_FORWARD: "fast_forward",
  REWIND: "rewind",
  SEEK: "seek",
  VOLUME: "volume",
  VOLUME_UP: "volume_up",
  VOLUME_DOWN: "volume_down",
  MUTE_TOGGLE: "mute_toggle",
  MUTE: "mute",
  UNMUTE: "unmute",
  REPEAT: "repeat",
  SHUFFLE: "shuffle",
  CHANNEL_UP: "channel_up",
  CHANNEL_DOWN: "channel_down",
  CURSOR_UP: "cursor_up",
  CURSOR_DOWN: "cursor_down",
  CURSOR_LEFT: "cursor_left",
  CURSOR_RIGHT: "cursor_right",
  CURSOR_ENTER: "cursor_enter",
  DIGIT_0: "digit_0",
  DIGIT_1: "digit_1",
  DIGIT_2: "digit_2",
  DIGIT_3: "digit_3",
  DIGIT_4: "digit_4",
  DIGIT_5: "digit_5",
  DIGIT_6: "digit_6",
  DIGIT_7: "digit_7",
  DIGIT_8: "digit_8",
  DIGIT_9: "digit_9",
  FUNCTION_RED: "function_red",
  FUNCTION_GREEN: "function_green",
  FUNCTION_YELLOW: "function_yellow",
  FUNCTION_BLUE: "function_blue",
  HOME: "home",
  MENU: "menu",
  CONTEXT_MENU: "context_menu",
  GUIDE: "guide",
  INFO: "info",
  BACK: "back",
  SELECT_SOURCE: "select_source",
  SELECT_SOUND_MODE: "select_sound_mode",
  RECORD: "record",
  MY_RECORDINGS: "my_recordings",
  LIVE: "live",
  EJECT: "eject",
  OPEN_CLOSE: "open_close",
  AUDIO_TRACK: "audio_track",
  SUBTITLE: "subtitle",
  SETTINGS: "settings",
  SEARCH: "search"
};

/**
 * Media-player entity device classes.
 *
 * @type {{RECEIVER: string, SET_TOP_BOX: string, SPEAKER: string, STREAMING_BOX: string, TV: string}}
 */
const DEVICECLASSES = {
  RECEIVER: "receiver",
  SET_TOP_BOX: "set_top_box",
  SPEAKER: "speaker",
  STREAMING_BOX: "streaming_box",
  TV: "tv"
};

/**
 * Media-player entity options.
 *
 * @type {{SIMPLE_COMMANDS: string, VOLUME_STEPS: string}}
 */
const OPTIONS = {
  SIMPLE_COMMANDS: "simple_commands",
  VOLUME_STEPS: "volume_steps"
};

/**
 * Media types.
 *
 * @type {{MUSIC: string, MOVIE: string, VIDEO: string, TVSHOW: string, RADIO: string}}
 */
const MEDIATYPE = {
  MUSIC: "MUSIC",
  RADIO: "RADIO",
  TVSHOW: "TVSHOW",
  MOVIE: "MOVIE",
  VIDEO: "VIDEO"
};

/**
 * Repeat modes.
 *
 * @type {{ALL: string, ONE: string, OFF: string}}
 */
const REPEATMODE = {
  OFF: "OFF",
  ALL: "ALL",
  ONE: "ONE"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_media_player.md media-player entity documentation}
 * for more information.
 */
class MediaPlayer extends Entity {
  /**
   * Constructs a new media-player entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string | Map<string, string> | Object<string, string> } name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map / Object containing multiple language strings.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} [deviceClass] Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} [area] Optional area or room.
   * @param {?function(Entity, string, Object.<string, *> | undefined):Promise<string>} cmdHandler Callback handler for entity commands, returning a {@link STATUS_CODES}
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id, name, features, attributes, deviceClass, options = null, area, cmdHandler = null) {
    super(id, name, Entity.TYPES.MEDIA_PLAYER, { features, attributes, deviceClass, options, area, cmdHandler });

    console.debug(`MediaPlayer entity created with id: ${this.id}`);
  }
}

module.exports = MediaPlayer;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
module.exports.MEDIATYPE = MEDIATYPE;
module.exports.REPEATMODE = REPEATMODE;
