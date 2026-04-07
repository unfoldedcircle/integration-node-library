/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { Entity, EntityType, CommandHandler, EntityName, EntityDescription } from "./entity.js";
import log from "../loggers.js";
import { Pagination, Paging, StatusCodes } from "../api_definitions.js";

/**
 * Media-player entity states.
 */
export enum MediaPlayerStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The media player is switched on.
   */
  On = "ON",
  /**
   * The media player is switched off.
   */
  Off = "OFF",
  /**
   * The media player is playing something.
   */
  Playing = "PLAYING",
  /**
   * The media player is paused.
   */
  Paused = "PAUSED",
  /**
   * The device is in low power state and accepting commands.
   */
  Standby = "STANDBY",
  /**
   * The media player is buffering to start playback.
   */
  Buffering = "BUFFERING"
}

/**
 * Media-player entity features.
 */
export enum MediaPlayerFeatures {
  /** The media player can be switched on and off. */
  OnOff = "on_off",
  /** The media player's power state can be toggled. */
  Toggle = "toggle",
  /** The volume level can be set to a specific level. */
  Volume = "volume",
  /** The volume can be adjusted up (louder) and down. */
  VolumeUpDown = "volume_up_down",
  /** The mute state can be toggled. */
  MuteToggle = "mute_toggle",
  /** The volume can be muted. */
  Mute = "mute",
  /** The volume can be un-muted. */
  Unmute = "unmute",
  /** The player supports starting and pausing media playback. */
  PlayPause = "play_pause",
  /** The player supports stopping media playback. */
  Stop = "stop",
  /** The player supports skipping to the next track. */
  Next = "next",
  /** The player supports returning to the previous track. */
  Previous = "previous",
  /** The player supports fast-forwarding the current track. */
  FastForward = "fast_forward",
  /** The player supports rewinding the current track. */
  Rewind = "rewind",
  /** The current track or playlist can be repeated. */
  Repeat = "repeat",
  /** The player supports random playback / shuffling the current playlist. */
  Shuffle = "shuffle",
  /** The player supports seeking the playback position. */
  Seek = "seek",
  /** The player announces the duration of the current media being played. */
  MediaDuration = "media_duration",
  /** The player announces the current position of the media being played. */
  MediaPosition = "media_position",
  /** The player announces the media title. */
  MediaTitle = "media_title",
  /** The player announces the media artist. */
  MediaArtist = "media_artist",
  /** The player announces the media album if music is being played. */
  MediaAlbum = "media_album",
  /** The player provides an image url of the media being played. */
  MediaImageUrl = "media_image_url",
  /** The player announces the content type of media being played. */
  MediaType = "media_type",
  /** Directional pad navigation provides cursor_up, _down, _left, _right, _enter commands. */
  Dpad = "dpad",
  /** Number pad, provides digit_0 .. digit_9 commands. */
  Numpad = "numpad",
  /** Home navigation support with home and back commands. */
  Home = "home",
  /** Menu navigation support with menu and back commands. */
  Menu = "menu",
  /** Context menu (for example, right-clicking or long pressing an item). */
  ContextMenu = "context_menu",
  /** Program guide support with guide and back commands. */
  Guide = "guide",
  /** Information popup / menu support with info and back commands. */
  Info = "info",
  /** Color button support for function_red, _green, _yellow, _blue commands. */
  ColorButtons = "color_buttons",
  /** Channel zapping support with channel_up and _down commands. */
  ChannelSwitcher = "channel_switcher",
  /** Media playback sources or inputs can be selected. */
  SelectSource = "select_source",
  /** Sound modes can be selected, e.g., stereo or surround. */
  SelectSoundMode = "select_sound_mode",
  /** The media can be ejected, e.g., a slot-in CD or USB stick. */
  Eject = "eject",
  /** The player supports opening and closing, e.g., a disc tray. */
  OpenClose = "open_close",
  /** The player supports selecting or switching the audio track. */
  AudioTrack = "audio_track",
  /** The player supports selecting or switching subtitles. */
  Subtitle = "subtitle",
  /** The player has recording capabilities with record, my_recordings, live commands. */
  Record = "record",
  /** The player supports a settings menu. */
  Settings = "settings",
  /** The player supports playing a specific media item. */
  PlayMedia = "play_media",
  /** The player supports the play_media action parameter to either play or enqueue. */
  PlayMediaAction = "play_media_action",
  /** The player allows clearing the active playlist. */
  ClearPlaylist = "clear_playlist",
  /** The player supports browsing media containers. */
  BrowseMedia = "browse_media",
  /** The player supports searching for media items. */
  SearchMedia = "search_media",
  /** The player provides a list of media classes as filter for searches. */
  SearchMediaClasses = "search_media_classes"
}

/**
 * Media-player entity attributes.
 */
export enum MediaPlayerAttributes {
  /** State of the media player, influenced by the play and power commands. */
  State = "state",
  /** Current volume level. */
  Volume = "volume",
  /** Flag if the volume is muted. */
  Muted = "muted",
  /** Media duration in seconds. */
  MediaDuration = "media_duration",
  /** Current media position in seconds. */
  MediaPosition = "media_position",
  /** Optional timestamp when `media_position` was last updated. */
  MediaPositionUpdatedAt = "media_position_updated_at",
  /** URL to retrieve the album art or an image representing what's being played. */
  MediaImageUrl = "media_image_url",
  /** Title of Playlist currently playing. */
  MediaPlaylist = "media_playlist",
  /** Currently playing media title. */
  MediaTitle = "media_title",
  /** Currently playing media artist. */
  MediaArtist = "media_artist",
  /** Currently playing media album. */
  MediaAlbum = "media_album",
  /** The content ID of media being played. */
  MediaId = "media_id",
  /** The content type of media being played. */
  MediaType = "media_type",
  /** Current repeat mode. */
  Repeat = "repeat",
  /** Shuffle mode on or off. */
  Shuffle = "shuffle",
  /** Currently selected media or input source. */
  Source = "source",
  /** Available media or input sources. */
  SourceList = "source_list",
  /** Currently selected sound mode. */
  SoundMode = "sound_mode",
  /** Available sound modes. */
  SoundModeList = "sound_mode_list",
  /** List of media classes to use as a filter for `search_media`. */
  SearchMediaClasses = "search_media_classes",
  /** Supported media play actions. */
  PlayMediaAction = "play_media_action"
}

/**
 * Media-player entity commands.
 */
export enum MediaPlayerCommands {
  /** Switch on media player. */
  On = "on",
  /** Switch off media player. */
  Off = "off",
  /** Toggle the current power state. */
  Toggle = "toggle",
  /** Toggle play / pause. */
  PlayPause = "play_pause",
  /** Stop playback. */
  Stop = "stop",
  /** Go back to previous track. */
  Previous = "previous",
  /** Skip to next track. */
  Next = "next",
  /** Fast forward current track. */
  FastForward = "fast_forward",
  /** Rewind current track. */
  Rewind = "rewind",
  /** Seek to given position in current track. */
  Seek = "seek",
  /** Set volume to given level. */
  Volume = "volume",
  /** Increase volume. */
  VolumeUp = "volume_up",
  /** Decrease volume. */
  VolumeDown = "volume_down",
  /** Toggle mute state. */
  MuteToggle = "mute_toggle",
  /** Mute volume. */
  Mute = "mute",
  /** Unmute volume. */
  Unmute = "unmute",
  /** Repeat track or playlist. */
  Repeat = "repeat",
  /** Shuffle playlist or start random playback. */
  Shuffle = "shuffle",
  /** Channel up. */
  ChannelUp = "channel_up",
  /** Channel down. */
  ChannelDown = "channel_down",
  /** Directional pad up */
  CursorUp = "cursor_up",
  /** Directional pad down */
  CursorDown = "cursor_down",
  /** Directional pad left */
  CursorLeft = "cursor_left",
  /** Directional pad right */
  CursorRight = "cursor_right",
  /** Directional pad enter */
  CursorEnter = "cursor_enter",
  /** Number pad digit 0 */
  Digit0 = "digit_0",
  /** Number pad digit 1 */
  Digit1 = "digit_1",
  /** Number pad digit 2 */
  Digit2 = "digit_2",
  /** Number pad digit 3 */
  Digit3 = "digit_3",
  /** Number pad digit 4 */
  Digit4 = "digit_4",
  /** Number pad digit 5 */
  Digit5 = "digit_5",
  /** Number pad digit 6 */
  Digit6 = "digit_6",
  /** Number pad digit 7 */
  Digit7 = "digit_7",
  /** Number pad digit 8 */
  Digit8 = "digit_8",
  /** Number pad digit 9 */
  Digit9 = "digit_9",
  /** Function red */
  FunctionRed = "function_red",
  /** Function green */
  FunctionGreen = "function_green",
  /** Function yellow */
  FunctionYellow = "function_yellow",
  /** Function blue */
  FunctionBlue = "function_blue",
  /** Home menu */
  Home = "home",
  /** General menu */
  Menu = "menu",
  /** Context menu */
  ContextMenu = "context_menu",
  /** Program guide menu. */
  Guide = "guide",
  /** Information menu / what's playing. */
  Info = "info",
  /** Back / exit function for menu navigation. */
  Back = "back",
  /** Select media playback source or input from the available sources. */
  SelectSource = "select_source",
  /** Select a sound mode from the available modes. */
  SelectSoundMode = "select_sound_mode",
  /** Start, stop or open recording menu (device dependant). */
  Record = "record",
  /** Open recordings. */
  MyRecordings = "my_recordings",
  /** Switch to live view. */
  Live = "live",
  /** Eject media. */
  Eject = "eject",
  /** Open or close. */
  OpenClose = "open_close",
  /** Switch or select audio track. */
  AudioTrack = "audio_track",
  /** Switch or select subtitle. */
  Subtitle = "subtitle",
  /** Settings menu */
  Settings = "settings",
  /** Play or enqueue a media item. */
  PlayMedia = "play_media",
  /** Remove all items from the playback queue. Current playback behavior is integration-dependent (keep playing the current item or clearing everything). */
  ClearPlaylist = "clear_playlist"
}
/**
 * Media-player entity device classes.
 */
export enum MediaPlayerDeviceClasses {
  /** Audio-video receiver. */
  Receiver = "receiver",
  /** Set-top box for multichannel video and media playback. */
  SetTopBox = "set_top_box",
  /** Smart speakers or stereo device. */
  Speaker = "speaker",
  /** Device for media streaming services. */
  StreamingBox = "streaming_box",
  /** Television device. */
  TV = "tv"
}

/**
 * Media-player entity options.
 */
export enum MediaPlayerOptions {
  /** Additional commands the media-player supports, which are not covered in the feature list. */
  SimpleCommands = "simple_commands",
  /** Number of available volume steps for the set volume command and UI controls. */
  VolumeSteps = "volume_steps",
  /**
   * Bit-field indicating if the `browse` and `search` commands support stable media IDs:
   *
   * - Bit 0: `browse` always returns stable ids.
   * - Bit 1: `browse` supports stable ids with the `stable_ids` parameter.
   * - Bit 2: `search` always returns stable ids.
   * - Bit 3: `search` returns stable ids with the `stable_ids` parameter.
   *
   * Default if not provided: `browse` and `search` always return stable IDs (Bit 0 | Bit 2)
   */
  StableIdSupport = "stable_id_support"
}

/**
 * Bit-field indicating if the `browse` and `search` commands support stable media IDs.
 */
export const StableIdSupport = {
  BrowseAlwaysStableIds: 1 << 0,
  BrowseSupportsStableIdsParam: 1 << 1,
  SearchAlwaysStableIds: 1 << 2,
  SearchSupportsStableIdsParam: 1 << 3
} as const;

/**
 * Pre-defined media content types.
 *
 * The media content type is for playback/content semantics.
 * It represents the type of the media content to play or that is currently playing.
 *
 * An integration may return other values, but the UI will most likely handle them as an "unknown media."
 */
export enum KnownMediaContentType {
  Album = "album",
  App = "app",
  Apps = "apps",
  Artist = "artist",
  Channel = "channel",
  Channels = "channels",
  Composer = "composer",
  Episode = "episode",
  Game = "game",
  Genre = "genre",
  Image = "image",
  Movie = "movie",
  Music = "music",
  Playlist = "playlist",
  Podcast = "podcast",
  Radio = "radio",
  Season = "season",
  Track = "track",
  TvShow = "tv_show",
  Url = "url",
  Video = "video"
}

/**
 * Media content type definition of all known media types, plus custom-defined types.
 */
export type MediaContentType = KnownMediaContentType | (string & {});
// `(string & {})`: “This is still any string, but please don’t eagerly reduce the whole union to plain string.”
// This helps editors offer autocomplete for the known values.

/**
 * Pre-defined media classes.
 *
 * The media class is for browser/structure semantics.
 * It represents how a media item should be presented and organized in the media browser hierarchy.
 *
 * An integration may return other values, but the UI will most likely treat them as generic media without custom icons.
 */
export enum KnownMediaClass {
  Album = "album",
  App = "app",
  Artist = "artist",
  Channel = "channel",
  Composer = "composer",
  Directory = "directory",
  Episode = "episode",
  Game = "game",
  Genre = "genre",
  Image = "image",
  Movie = "movie",
  Music = "music",
  Playlist = "playlist",
  Podcast = "podcast",
  Radio = "radio",
  Season = "season",
  Track = "track",
  TvShow = "tv_show",
  Url = "url",
  Video = "video"
}

/**
 * Media item class type definition of all known class types, plus custom-defined types.
 */
export type MediaClass = KnownMediaClass | (string & {});

/**
 * Media browse options for the media browse client callback.
 */
export interface BrowseOptions {
  /**
   * Optional media content ID to restrict browsing.
   */
  media_id?: string;

  /**
   * Optional media content type to restrict browsing.
   */
  media_type?: MediaContentType;

  /**
   * Hint to return stable media IDs.
   */
  stable_ids?: boolean;

  /**
   * Paging options to limit returned items.
   */
  paging: Paging;
}

/**
 * Media search options for the media search client callback.
 */
export interface SearchOptions {
  /**
   * Free text search query.
   */
  query: string;

  /**
   * Optional media content ID to limit the search scope. E.g., in a previously browsed media item.
   */
  media_id?: string;

  /**
   * Optional media content type to limit the search scope. E.g., in a previously browsed media item.
   */
  media_type?: MediaContentType;

  /**
   * Hint to return stable media IDs.
   */
  stable_ids?: boolean;

  /**
   * Additional user filter to limit the search scope.
   */
  filter?: SearchMediaFilter;

  /**
   * Paging options to limit returned items.
   */
  paging: Paging;
}

/**
 * Filter for media search.
 */
export interface SearchMediaFilter {
  /**
   * Optional list of media classes to filter the results.
   */
  media_classes?: MediaClass[];

  /**
   * TBD not yet finalized
   */
  artist?: string;

  /**
   * TBD not yet finalized
   */
  album?: string;
}

/**
 * Optional fields for constructing a BrowseMediaItem.
 */
export interface BrowseMediaItemOptions {
  /**
   * Optional subtitle.
   */
  subtitle?: string;

  /**
   * Artist name.
   */
  artist?: string;

  /**
   * Album name.
   */
  album?: string;

  /**
   * Media class for further browse, search, or playback actions.
   */
  media_class?: MediaClass;

  /**
   * Media content type for further browse, search, or playback actions.
   */
  media_type?: MediaContentType;

  /**
   * If `true`, the item can be browsed (is a container) by using `media_id` and `media_type`.
   */
  can_browse?: boolean;

  /**
   * If `true`, the item can be played directly by using `media_id` and `media_type`.
   */
  can_play?: boolean;

  /**
   * If `true`, a search can be performed on the item by using `media_id` and `media_type`.
   */
  can_search?: boolean;

  /**
   * URL to download the media artwork, or a base64 encoded PNG or JPG image.
   *
   * Use the following URI prefix to use a provided icon: `icon://uc:`, for example, `icon://uc:music`.
   * Please avoid using encoded images whenever possible. Payloads should be as small as possible.
   */
  thumbnail?: string;

  /**
   * Duration in seconds.
   */
  duration?: number;

  /**
   * Child items if this item is a container.
   * Child items may not contain further child items (only one level of nesting is supported).
   * A new browse request must be sent for deeper levels.
   */
  items?: BrowseMediaItem[];
}

/**
 * A media item which can be browsed or played.
 *
 * Created by the client and returned to the library in response to a browse or search request.
 */
export class BrowseMediaItem {
  readonly media_id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly artist?: string;
  readonly album?: string;
  readonly media_class?: MediaClass;
  readonly media_type?: MediaContentType;
  readonly can_browse?: boolean;
  readonly can_play?: boolean;
  readonly can_search?: boolean;
  readonly thumbnail?: string;
  readonly duration?: number;
  readonly items?: BrowseMediaItem[];

  /**
   * @param media_id Unique identifier of the item.
   * @param title    Display name (must be a non-empty string).
   * @param options  Optional metadata fields.
   * @throws {TypeError} if media_id or title are missing or not strings.
   */
  constructor(media_id: string, title: string, options: BrowseMediaItemOptions = {}) {
    if (typeof media_id !== "string") {
      throw new TypeError("BrowseMediaItem: media_id must be a non-empty string");
    }
    if (!title || typeof title !== "string") {
      throw new TypeError("BrowseMediaItem: title must be a non-empty string");
    }

    this.media_id = media_id;
    this.title = title;

    // Spread optional fields explicitly to avoid leaking unexpected properties
    this.subtitle = options.subtitle;
    this.artist = options.artist;
    this.album = options.album;
    this.media_class = options.media_class;
    this.media_type = options.media_type;
    this.can_browse = options.can_browse;
    this.can_play = options.can_play;
    this.can_search = options.can_search;
    this.thumbnail = options.thumbnail;
    this.duration = options.duration;
    this.items = options.items;
  }
}

/**
 * A media item returned as a search result.
 *
 * Currently identical in shape to {@link BrowseMediaItem}.
 * Defined as a subclass to allow search-specific fields (e.g. relevance score) to be added
 * in the future without a breaking change.
 */
export class SearchMediaItem extends BrowseMediaItem {}

/**
 * Response to a browse request.
 *
 * Created by the client and returned to the library in response to a browse request.
 */
export class BrowseResult {
  readonly media: BrowseMediaItem | undefined;
  readonly pagination: Pagination;

  /**
   * @param media      The browsed media item, or `undefined` if not found.
   * @param pagination Pagination metadata for this result page.
   * @throws {TypeError} if media is not a BrowseMediaItem instance or pagination is not a Pagination instance.
   */
  constructor(media: BrowseMediaItem | undefined, pagination: Pagination) {
    if (!(pagination instanceof Pagination)) {
      throw new TypeError("BrowseResult: pagination must be an instance of Pagination");
    }
    if (media !== undefined && !(media instanceof BrowseMediaItem)) {
      throw new TypeError("BrowseResult: media must be an instance of BrowseMediaItem or undefined");
    }

    this.media = media;
    this.pagination = pagination;
  }

  static empty(): BrowseResult {
    return new BrowseResult(undefined, Pagination.empty());
  }

  static fromPaging(media: BrowseMediaItem, paging: Paging, total?: number): BrowseResult {
    return new BrowseResult(media, new Pagination(paging.page, media.items?.length || 0, total));
  }
}

/**
 * Response to a search request.
 *
 * Created by the client and returned to the library in response to a search request.
 */
export class SearchResult {
  readonly media: SearchMediaItem[];
  readonly pagination: Pagination;

  /**
   * @param media      Array of matching media items. Pass an empty array if no results were found.
   * @param pagination Pagination metadata for this result page.
   * @throws {TypeError} if media is not an array or pagination is not a Pagination instance.
   */
  constructor(media: SearchMediaItem[], pagination: Pagination) {
    if (!Array.isArray(media)) {
      throw new TypeError("SearchResult: media must be an array");
    }
    if (!(pagination instanceof Pagination)) {
      throw new TypeError("SearchResult: pagination must be an instance of Pagination");
    }

    this.media = media;
    this.pagination = pagination;
  }
}

/**
 * Pre-defined media play actions with UI support.
 */
export enum KnownMediaPlayAction {
  /** Start playback immediately. */
  PlayNow = "PLAY_NOW",
  /** Add to the queue after the current item. */
  PlayNext = "PLAY_NEXT",
  /** Add to the end of the queue. */
  AddToQueue = "ADD_TO_QUEUE"
}

/**
 * Media play action type definition of all known actions, plus custom-defined actions.
 */
export type MediaPlayAction = KnownMediaPlayAction | (string & {});

/**
 * Repeat modes.
 */
export enum RepeatMode {
  /** No repeat */
  Off = "OFF",
  /** Repeat all */
  All = "ALL",
  /** Repeat current track */
  One = "ONE"
}

export interface MediaPlayerParams {
  icon?: string;
  description?: EntityDescription;
  features?: MediaPlayerFeatures[];
  attributes?: Partial<
    Record<MediaPlayerAttributes, MediaPlayerStates | RepeatMode | string | string[] | number | boolean>
  >;
  deviceClass?: MediaPlayerDeviceClasses;
  options?: Partial<Record<MediaPlayerOptions, string[] | number>>;
  area?: string;
  cmdHandler?: CommandHandler;
}

/**
 * A media player entity controls playback of media on a device.
 *
 * This could be an online music streaming service, a TV, a stereo, or a video player.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_media_player.md media-player entity documentation}
 * for more information.
 */
export class MediaPlayer extends Entity {
  /**
   * Constructs a new media-player entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {EntityName} name The human-readable name of the entity.
   *        Either a string, which will be mapped to English, or a Map / Object containing multiple language strings.
   * @param {MediaPlayerParams} [params] Media-player-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { icon, description, features, attributes, deviceClass, options, area, cmdHandler }: MediaPlayerParams = {}
  ) {
    super(id, name, EntityType.MediaPlayer, {
      icon,
      description,
      features,
      attributes,
      deviceClass,
      options,
      area,
      cmdHandler
    });

    log.debug(`MediaPlayer entity created with id: ${this.id}`);
  }

  /**
   * Default browse media item handler. Returns status code `NotImplemented`.
   *
   * A client needs to add the `BrowseMedia` feature and override this method if it wants to handle browse requests.
   *
   * @param {BrowseOptions} options the browse options.
   * @return {Promise<StatusCodes | BrowseResult>} command status code in case of an error, otherwise the browse result.
   */
  async browse(options: BrowseOptions): Promise<StatusCodes | BrowseResult> {
    log.warn("Media browsing not supported for %s. Request: %s", this.id, JSON.stringify(options));

    return StatusCodes.NotImplemented;
  }

  /**
   * Default search media item handler. Returns status code `NotImplemented`.
   *
   * A client needs to add the `SearchMedia` feature and override this method if it wants to handle search requests.
   *
   * @param {SearchOptions} query the search query options.
   * @return {Promise<StatusCodes | BrowseResult>} command status code in case of an error, otherwise the search result.
   */
  async search(query: SearchOptions): Promise<StatusCodes | SearchResult> {
    log.warn("Media searching not supported for %s. Request: %s", this.id, JSON.stringify(query));

    return StatusCodes.NotImplemented;
  }
}
