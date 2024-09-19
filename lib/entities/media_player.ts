/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { TYPES as ENTITYTYPES } from './entity';
import Entity from "./entity";
import log from "../loggers"; 

/**
 * Media-player entity states.
 */
enum STATES {
  UNAVAILABLE = "UNAVAILABLE",
  UNKNOWN = "UNKNOWN",
  ON = "ON",
  OFF= "OFF",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  STANDBY = "STANDBY",
  BUFFERING = "BUFFERING"
}

/**
 * Media-player entity features.
 */
enum FEATURES {
  ON_OFF = "on_off",
  TOGGLE = "toggle",
  VOLUME = "volume",
  VOLUME_UP_DOWN = "volume_up_down",
  MUTE_TOGGLE = "mute_toggle",
  MUTE = "mute",
  UNMUTE = "unmute",
  PLAY_PAUSE = "play_pause",
  STOP = "stop",
  NEXT = "next",
  PREVIOUS = "previous",
  FAST_FORWARD = "fast_forward",
  REWIND = "rewind",
  REPEAT = "repeat",
  SHUFFLE = "shuffle",
  SEEK = "seek",
  MEDIA_DURATION = "media_duration",
  MEDIA_POSITION = "media_position",
  MEDIA_TITLE = "media_title",
  MEDIA_ARTIST = "media_artist",
  MEDIA_ALBUM = "media_album",
  MEDIA_IMAGE_URL = "media_image_url",
  MEDIA_TYPE = "media_type",
  DPAD = "dpad",
  NUMPAD = "numpad",
  HOME = "home",
  MENU = "menu",
  CONTEXT_MENU = "context_menu",
  GUIDE = "guide",
  INFO = "info",
  COLOR_BUTTONS = "color_buttons",
  CHANNEL_SWITCHER = "channel_switcher",
  SELECT_SOURCE = "select_source",
  SELECT_SOUND_MODE = "select_sound_mode",
  EJECT = "eject",
  OPEN_CLOSE = "open_close",
  AUDIO_TRACK = "audio_track",
  SUBTITLE = "subtitle",
  RECORD = "record",
  SETTINGS = "settings"
};

/**
 * Media-player entity attributes.
 */
enum ATTRIBUTES {
  STATE = "state",
  VOLUME = "volume",
  MUTED = "muted",
  MEDIA_DURATION = "media_duration",
  MEDIA_POSITION = "media_position",
  MEDIA_TYPE = "media_type",
  MEDIA_IMAGE_URL = "media_image_url",
  MEDIA_TITLE = "media_title",
  MEDIA_ARTIST = "media_artist",
  MEDIA_ALBUM = "media_album",
  REPEAT = "repeat",
  SHUFFLE = "shuffle",
  SOURCE = "source",
  SOURCE_LIST = "source_list",
  SOUND_MODE = "sound_mode",
  SOUND_MODE_LIST = "sound_mode_list"
};

/**
 * Media-player entity commands.
 */
enum COMMANDS {
  ON = "on",
  OFF = "off",
  TOGGLE = "toggle",
  PLAY_PAUSE = "play_pause",
  STOP = "stop",
  PREVIOUS = "previous",
  NEXT = "next",
  FAST_FORWARD = "fast_forward",
  REWIND = "rewind",
  SEEK = "seek",
  VOLUME = "volume",
  VOLUME_UP = "volume_up",
  VOLUME_DOWN = "volume_down",
  MUTE_TOGGLE = "mute_toggle",
  MUTE = "mute",
  UNMUTE = "unmute",
  REPEAT = "repeat",
  SHUFFLE = "shuffle",
  CHANNEL_UP = "channel_up",
  CHANNEL_DOWN = "channel_down",
  CURSOR_UP = "cursor_up",
  CURSOR_DOWN = "cursor_down",
  CURSOR_LEFT = "cursor_left",
  CURSOR_RIGHT = "cursor_right",
  CURSOR_ENTER = "cursor_enter",
  DIGIT_0 = "digit_0",
  DIGIT_1 = "digit_1",
  DIGIT_2 = "digit_2",
  DIGIT_3 = "digit_3",
  DIGIT_4 = "digit_4",
  DIGIT_5 = "digit_5",
  DIGIT_6 = "digit_6",
  DIGIT_7 = "digit_7",
  DIGIT_8 = "digit_8",
  DIGIT_9 = "digit_9",
  FUNCTION_RED = "function_red",
  FUNCTION_GREEN = "function_green",
  FUNCTION_YELLOW = "function_yellow",
  FUNCTION_BLUE = "function_blue",
  HOME = "home",
  MENU = "menu",
  CONTEXT_MENU = "context_menu",
  GUIDE = "guide",
  INFO = "info",
  BACK = "back",
  SELECT_SOURCE = "select_source",
  SELECT_SOUND_MODE = "select_sound_mode",
  RECORD = "record",
  MY_RECORDINGS = "my_recordings",
  LIVE = "live",
  EJECT = "eject",
  OPEN_CLOSE = "open_close",
  AUDIO_TRACK = "audio_track",
  SUBTITLE = "subtitle",
  SETTINGS = "settings",
  SEARCH = "search"
};

/**
 * Media-player entity device classes.
 */
enum DEVICECLASSES {
  RECEIVER = "receiver",
  SET_TOP_BOX = "set_top_box",
  SPEAKER = "speaker",
  STREAMING_BOX = "streaming_box",
  TV = "tv"
};

/**
 * Media-player entity options.
 */
enum OPTIONS {
  SIMPLE_COMMANDS = "simple_commands",
  VOLUME_STEPS = "volume_steps"
};

/**
 * Media types.
 */
enum MEDIATYPE {
  MUSIC = "MUSIC",
  RADIO = "RADIO",
  TVSHOW = "TVSHOW",
  MOVIE = "MOVIE",
  VIDEO = "VIDEO"
};

/**
 * Repeat modes.
 */
enum REPEATMODE {
  OFF = "OFF",
  ALL = "ALL",
  ONE = "ONE"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_media_player.md media-player entity documentation}
 * for more information.
 */

type CmdHandler = (entity: Entity, command: string, options?: Record<string, unknown>) => Promise<string>;

interface MediaPlayerParams {
  features?: string[];
  attributes?: Map<string, string> | Record<string, string>;
  deviceClass?: string;
  options?: object; // Might need to define a more specific type here
  area?: string;
  cmdHandler?: CmdHandler;
}

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
  constructor(id: string, name: string | Map<string, string> | Record<string, string>, 
  { features, attributes, deviceClass, options, area, cmdHandler }: MediaPlayerParams = {}) {

    let entityName: string | Map<string, string>;
    if (typeof name === "string") {
        entityName = name;
    } else if (name instanceof Map) {
        entityName = name;
    } else {
        entityName = new Map<string, string>(Object.entries(name));
    }
    
    super(id, entityName, ENTITYTYPES.MEDIA_PLAYER, { features, attributes, deviceClass, options, area, cmdHandler });

    log.debug(`MediaPlayer entity created with id: ${this.id}`);
  }
}

export default MediaPlayer;
export { STATES, FEATURES, ATTRIBUTES, COMMANDS, DEVICECLASSES, OPTIONS, MEDIATYPE, REPEATMODE };