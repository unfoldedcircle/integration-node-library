'use strict';

const Entity = require('./entity');

/**
 * Media-player entity states.
 *
 * @type {{PAUSED: string, UNAVAILABLE: string, UNKNOWN: string, OFF: string, PLAYING: string, ON: string}}
 */
const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  ON: 'ON',
  OFF: 'OFF',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
};

/**
 * Media-player entity features.
 *
 * @type {{REPEAT: string, TOGGLE: string, UNMUTE: string, SHUFFLE: string, MEDIA_DURATION: string, PREVIOUS: string, MEDIA_ALBUM: string, PLAY_PAUSE: string, NEXT: string, MEDIA_TYPE: string, REWIND: string, SEEK: string, VOLUME_UP_DOWN: string, STOP: string, FAST_FORWARD: string, VOLUME: string, MEDIA_ARTIST: string, ON_OFF: string, MUTE_TOGGLE: string, MEDIA_TITLE: string, MEDIA_IMAGE_URL: string, SOUND_MODE: string, MEDIA_POSITION: string, SOURCE: string, MUTE: string}}
 */
const FEATURES = {
  ON_OFF: 'on_off',
  TOGGLE: 'toggle',
  VOLUME: 'volume',
  VOLUME_UP_DOWN: 'volume_up_down',
  MUTE_TOGGLE: 'mute_toggle',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  PLAY_PAUSE: 'play_pause',
  STOP: 'stop',
  NEXT: 'next',
  PREVIOUS: 'previous',
  FAST_FORWARD: 'fast_forward',
  REWIND: 'rewind',
  REPEAT: 'repeat',
  SHUFFLE: 'shuffle',
  SEEK: 'seek',
  MEDIA_DURATION: 'media_duration',
  MEDIA_POSITION: 'media_position',
  MEDIA_TITLE: 'media_title',
  MEDIA_ARTIST: 'media_artist',
  MEDIA_ALBUM: 'media_album',
  MEDIA_IMAGE_URL: 'media_image_url',
  MEDIA_TYPE: 'media_type',
  SOURCE: 'source',
  SOUND_MODE: 'sound_mode'
};

/**
 * Media-player entity attributes.
 *
 * @type {{REPEAT: string, SOURCE_LIST: string, VOLUME: string, SOUND_MODE_LIST: string, MEDIA_ARTIST: string, STATE: string, SHUFFLE: string, MEDIA_DURATION: string, MUTED: string, MEDIA_TITLE: string, MEDIA_IMAGE_URL: string, SOUND_MODE: string, MEDIA_POSITION: string, MEDIA_ALBUM: string, MEDIA_TYPE: string, SOURCE: string}}
 */
const ATTRIBUTES = {
  STATE: 'state',
  VOLUME: 'volume',
  MUTED: 'muted',
  MEDIA_DURATION: 'media_duration',
  MEDIA_POSITION: 'media_position',
  MEDIA_TYPE: 'media_type',
  MEDIA_IMAGE_URL: 'media_image_url',
  MEDIA_TITLE: 'media_title',
  MEDIA_ARTIST: 'media_artist',
  MEDIA_ALBUM: 'media_album',
  REPEAT: 'repeat',
  SHUFFLE: 'shuffle',
  SOURCE: 'source',
  SOURCE_LIST: 'source_list',
  SOUND_MODE: 'sound_mode',
  SOUND_MODE_LIST: 'sound_mode_list'
};

/**
 * Media-player entity commands.
 *
 * @type {{REPEAT: string, TOGGLE: string, STOP: string, FAST_FORWARD: string, SEARCH: string, VOLUME: string, MUTE_TOGGLE: string, UNMUTE: string, SHUFFLE: string, VOLUME_DOWN: string, OFF: string, PREVIOUS: string, SOUND_MODE: string, PLAY_PAUSE: string, NEXT: string, SOURCE: string, REWIND: string, VOLUME_UP: string, MUTE: string, SEEK: string, ON: string}}
 */
const COMMANDS = {
  ON: 'on',
  OFF: 'off',
  TOGGLE: 'toggle',
  PLAY_PAUSE: 'play_pause',
  STOP: 'stop',
  PREVIOUS: 'previous',
  NEXT: 'next',
  FAST_FORWARD: 'fast_forward',
  REWIND: 'rewind',
  SEEK: 'seek',
  VOLUME: 'volume',
  VOLUME_UP: 'volume_up',
  VOLUME_DOWN: 'volume_down',
  MUTE_TOGGLE: 'mute_toggle',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  REPEAT: 'repeat',
  SHUFFLE: 'shuffle',
  SOURCE: 'source',
  SOUND_MODE: 'sound_mode',
  SEARCH: 'search'
};

/**
 * Media-player entity device classes.
 *
 * @type {{SPEAKER: string, RECEIVER: string}}
 */
const DEVICECLASSES = { RECEIVER: 'receiver', SPEAKER: 'speaker' };

/**
 * Media-player entity options.
 *
 * @type {{VOLUME_STEPS: string}}
 */
const OPTIONS = { VOLUME_STEPS: 'volume_steps' };

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
  constructor (
    id,
    name,
    features,
    attributes,
    deviceClass = undefined,
    options = null,
    area = undefined
  ) {
    super(
      id,
      name,
      Entity.TYPES.MEDIA_PLAYER,
      features,
      attributes,
      deviceClass,
      options,
      area
    );

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
