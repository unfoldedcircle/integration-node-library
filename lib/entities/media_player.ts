/**
 * Media-player-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/tree/main/doc/entities> for more information.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { Entity, EntityType, CommandHandler, EntityName } from "./entity.js";
import log from "../loggers.js";
import { Pagination, Paging, StatusCodes } from "../api_definitions.js";

/**
 * Media-player entity states.
 */
export enum MediaPlayerStates {
  Unavailable = "UNAVAILABLE",
  Unknown = "UNKNOWN",
  On = "ON",
  Off = "OFF",
  Playing = "PLAYING",
  Paused = "PAUSED",
  Standby = "STANDBY",
  Buffering = "BUFFERING"
}

/**
 * Media-player entity features.
 */
export enum MediaPlayerFeatures {
  OnOff = "on_off",
  Toggle = "toggle",
  Volume = "volume",
  VolumeUpDown = "volume_up_down",
  MuteToggle = "mute_toggle",
  Mute = "mute",
  Unmute = "unmute",
  PlayPause = "play_pause",
  Stop = "stop",
  Next = "next",
  Previous = "previous",
  FastForward = "fast_forward",
  Rewind = "rewind",
  Repeat = "repeat",
  Shuffle = "shuffle",
  Seek = "seek",
  MediaDuration = "media_duration",
  MediaPosition = "media_position",
  MediaTitle = "media_title",
  MediaArtist = "media_artist",
  MediaAlbum = "media_album",
  MediaImageUrl = "media_image_url",
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
  State = "state",
  Volume = "volume",
  Muted = "muted",
  MediaDuration = "media_duration",
  MediaPosition = "media_position",
  MediaPositionUpdatedAt = "media_position_updated_at",
  MediaImageUrl = "media_image_url",
  MediaPlaylist = "media_playlist",
  MediaTitle = "media_title",
  MediaArtist = "media_artist",
  MediaAlbum = "media_album",
  MediaId = "media_id",
  MediaType = "media_type",
  Repeat = "repeat",
  Shuffle = "shuffle",
  Source = "source",
  SourceList = "source_list",
  SoundMode = "sound_mode",
  SoundModeList = "sound_mode_list",
  SearchMediaClasses = "search_media_classes"
}

/**
 * Media-player entity commands.
 */
export enum MediaPlayerCommands {
  On = "on",
  Off = "off",
  Toggle = "toggle",
  PlayPause = "play_pause",
  Stop = "stop",
  Previous = "previous",
  Next = "next",
  FastForward = "fast_forward",
  Rewind = "rewind",
  Seek = "seek",
  Volume = "volume",
  VolumeUp = "volume_up",
  VolumeDown = "volume_down",
  MuteToggle = "mute_toggle",
  Mute = "mute",
  Unmute = "unmute",
  Repeat = "repeat",
  Shuffle = "shuffle",
  ChannelUp = "channel_up",
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
  Digit0 = "digit_0",
  Digit1 = "digit_1",
  Digit2 = "digit_2",
  Digit3 = "digit_3",
  Digit4 = "digit_4",
  Digit5 = "digit_5",
  Digit6 = "digit_6",
  Digit7 = "digit_7",
  Digit8 = "digit_8",
  Digit9 = "digit_9",
  FunctionRed = "function_red",
  FunctionGreen = "function_green",
  FunctionYellow = "function_yellow",
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
  Receiver = "receiver",
  SetTopBox = "set_top_box",
  Speaker = "speaker",
  StreamingBox = "streaming_box",
  TV = "tv"
}

/**
 * Media-player entity options.
 */
export enum MediaPlayerOptions {
  SimpleCommands = "simple_commands",
  VolumeSteps = "volume_steps"
}

/**
 * Pre-defined media content types.
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
 * Media play actions.
 */
export enum MediaPlayAction {
  PlayNow = "PLAY_NOW",
  PlayNext = "PLAY_NEXT",
  AddToQueue = "ADD_TO_QUEUE"
}

/**
 * Repeat modes.
 */
export enum RepeatMode {
  Off = "OFF",
  All = "ALL",
  One = "ONE"
}

export interface MediaPlayerParams {
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
   * @param {MediaPlayerParams} [params] Entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(
    id: string,
    name: EntityName,
    { features, attributes, deviceClass, options, area, cmdHandler }: MediaPlayerParams = {}
  ) {
    super(id, name, EntityType.MediaPlayer, { features, attributes, deviceClass, options, area, cmdHandler });

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
    log.warn("Media browsing not supported for %s", this.id);

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
    log.warn("Media searching not supported for %s", this.id);

    return StatusCodes.NotImplemented;
  }
}
