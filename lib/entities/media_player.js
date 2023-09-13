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
 * @type {{REPEAT: string, TOGGLE: string, UNMUTE: string, SHUFFLE: string, MEDIA_DURATION: string, PREVIOUS: string, DPAD: string, SELECT_SOURCE: string, SELECT_SOUND_MODE: string, MEDIA_ALBUM: string, PLAY_PAUSE: string, NEXT: string, MEDIA_TYPE: string, REWIND: string, CHANNEL_SWITCHER: string, SEEK: string, VOLUME_UP_DOWN: string, STOP: string, FAST_FORWARD: string, VOLUME: string, MEDIA_ARTIST: string, ON_OFF: string, MUTE_TOGGLE: string, COLOR_BUTTONS: string, MEDIA_TITLE: string, MEDIA_IMAGE_URL: string, MEDIA_POSITION: string, MENU: string, MUTE: string, HOME: string}}
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
  HOME: "home",
  MENU: "menu",
  COLOR_BUTTONS: "color_buttons",
  CHANNEL_SWITCHER: "channel_switcher",
  SELECT_SOURCE: "select_source",
  SELECT_SOUND_MODE: "select_sound_mode"
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
 * @type {{FUNCTION_BLUE: string, REPEAT: string, TOGGLE: string, UNMUTE: string, SHUFFLE: string, VOLUME_DOWN: string, OFF: string, PREVIOUS: string, CURSOR_LEFT: string, SELECT_SOURCE: string, SELECT_SOUND_MODE: string, CURSOR_DOWN: string, PLAY_PAUSE: string, FUNCTION_RED: string, NEXT: string, REWIND: string, VOLUME_UP: string, SEEK: string, ON: string, CURSOR_ENTER: string, CHANNEL_UP: string, STOP: string, FAST_FORWARD: string, SEARCH: string, VOLUME: string, MUTE_TOGGLE: string, CURSOR_UP: string, FUNCTION_GREEN: string, CURSOR_RIGHT: string, FUNCTION_YELLOW: string, BACK: string, CHANNEL_DOWN: string, MENU: string, MUTE: string, HOME: string}}
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
  FUNCTION_RED: "function_red",
  FUNCTION_GREEN: "function_green",
  FUNCTION_YELLOW: "function_yellow",
  FUNCTION_BLUE: "function_blue",
  HOME: "home",
  MENU: "menu",
  BACK: "back",
  SELECT_SOURCE: "select_source",
  SELECT_SOUND_MODE: "select_sound_mode",
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
 * @type {{VOLUME_STEPS: string}}
 */
const OPTIONS = { VOLUME_STEPS: "volume_steps" };

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_media_player.md media-player entity documentation}
 * for more information.
 */
class MediaPlayer extends Entity {
  /**
   * Constructs a new media-player entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string|Map} name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} deviceClass Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} area Optional area or room.
   */
  constructor(id, name, features, attributes, deviceClass = undefined, options = null, area = undefined) {
    super(id, name, Entity.TYPES.MEDIA_PLAYER, features, attributes, deviceClass, options, area);

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
