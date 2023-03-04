'use strict';

const Entity = require('./entity');

const STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN',
  ON: 'ON',
  OFF: 'OFF',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
};

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

const DEVICECLASSES = { RECEIVER: 'receiver', SPEAKER: 'speaker' };

const OPTIONS = { VOLUME_STEPS: 'volume_steps' };

class MediaPlayer extends Entity {
  constructor (
    id,
    name,
    deviceId,
    features,
    attributes,
    deviceClass,
    options,
    area
  ) {
    super(
      id,
      name,
      Entity.TYPES.MEDIA_PLAYER,
      deviceId,
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
