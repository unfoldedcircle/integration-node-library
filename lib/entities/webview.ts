/**
 * Webview-entity definitions.
 * See <https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_webview.md> for more information.
 *
 * @copyright (c) 2026 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { Entity, EntityType, EntityName, EntityDescription, EntityOptions } from "./entity.js";
import log from "../loggers.js";

/**
 * Web view entity states.
 */
export enum WebviewStates {
  /**
   * The entity is currently not available.
   */
  Unavailable = "UNAVAILABLE",
  /**
   * The entity is available, but the current state is unknown.
   */
  Unknown = "UNKNOWN",
  /**
   * The web view can be shown.
   */
  On = "ON"
}

/**
 * Web view entity features. This entity has no features.
 */
export enum WebviewFeatures {}

/**
 * Web view entity attributes.
 */
export enum WebviewAttributes {
  /**
   * Optional state of the web view.
   */
  State = "state"
}

/**
 * Web view entity commands.
 *
 * The commands are executed by the user interface of the Remote and are never sent to an
 * integration driver. In the Core-API, the command identifier has the entity type prefix, e.g.
 * `webview.open`.
 */
export enum WebviewCommands {
  /**
   * Wake the display and show the web view fullscreen with its start page.
   */
  Open = "open",
  /**
   * Reload the shown page, in the fullscreen web view or in the widget. No effect if the web
   * view isn't shown.
   */
  Reload = "reload",
  /**
   * Clear the HTTP cache of all web views and reload the shown page.
   */
  ClearCache = "clear_cache",
  /**
   * Clear all website data of all web views, then reload the shown page. Credentials entered in
   * a login dialog are kept until the user interface restarts.
   */
  ClearData = "clear_data"
}

/**
 * Web view entity option fields. See {@link WebviewEntityOptions}.
 */
export enum WebviewOptions {
  /**
   * Start page of the web view: absolute `http://` or `https://` URL. Required.
   */
  Url = "url",
  /**
   * Credentials sent to the origin of the `url` option. See {@link WebviewAuth}.
   */
  Auth = "auth",
  /**
   * Exception for an invalid TLS certificate of the host of the `url` option. See {@link WebviewTls}.
   */
  Tls = "tls",
  /**
   * Cookies set before the start page is loaded. See {@link WebviewCookie}.
   */
  Cookies = "cookies",
  /**
   * User agent of the web view. See {@link WebviewUserAgent}.
   */
  UserAgent = "user_agent",
  /**
   * Page zoom in percent: 25..400. Default: 100. Can be overridden by the user.
   */
  Zoom = "zoom",
  /**
   * Background color while the page is loading and behind transparent pages, as `#RRGGBB`.
   * Default: white `#FFFFFF`.
   */
  BackgroundColor = "background_color",
  /**
   * Show back, forward, reload and close controls in the fullscreen web view. Default: false.
   * Can be overridden by the user.
   */
  ShowNavigation = "show_navigation",
  /**
   * Reload the page every n seconds while it is shown: 0 = off, otherwise 10..86400.
   * Default: 0. Can be overridden by the user.
   */
  ReloadInterval = "reload_interval",
  /**
   * Function of single physical buttons in the fullscreen web view. See {@link WebviewButtonAction}.
   * Can be overridden by the user.
   */
  Buttons = "buttons",
  /**
   * Device state API for the pages of the web view: battery state, display state, power source,
   * power profile and standby events. Default: false. Can be overridden by the user.
   */
  DeviceApi = "device_api"
}

/**
 * Web view authentication method.
 */
export enum WebviewAuthType {
  /**
   * No credentials.
   */
  None = "none",
  /**
   * `username` and `password`, sent as answer to an HTTP authentication request (status 401)
   * of the origin. Not sent preemptively.
   */
  Basic = "basic",
  /**
   * `token`, sent as `Authorization: Bearer <token>` header with every request to the origin.
   */
  Bearer = "bearer",
  /**
   * `header_name` and `header_value`, sent as header with every request to the origin, e.g. an
   * API key.
   */
  Header = "header"
}

/**
 * Web view credentials. They are only sent to the origin of the `url` option.
 *
 * `password`, `token` and `header_value` are secrets.
 */
export interface WebviewAuth {
  /** Authentication method. */
  type: WebviewAuthType | string;
  /** `basic`: user name, at most 256 characters. */
  username?: string;
  /** `basic`: password, at most 256 characters. Secret. */
  password?: string;
  /** `bearer`: token, at most 4096 characters. Secret. */
  token?: string;
  /**
   * `header`: name of the HTTP request header, e.g. `X-API-Key`.
   *
   * Not allowed: `Host`, `Cookie`, `Content-Length`, `Content-Type`, `Connection`,
   * `Transfer-Encoding`, `Upgrade`, `Origin`, `Referer`, and names starting with `Proxy-` or
   * `Sec-`.
   */
  header_name?: string;
  /** `header`: value of the HTTP request header, at most 4096 characters. Secret. */
  header_value?: string;
}

/**
 * Exception for an invalid TLS certificate of the host of the `url` option, e.g. a self-signed
 * certificate. The exception only applies to page loads from this host.
 */
export interface WebviewTls {
  /**
   * SHA-256 fingerprint of the expected DER-encoded server certificate: 64 hexadecimal
   * digits, optionally separated by `:`, case-insensitive. An invalid certificate is only
   * accepted if its fingerprint matches.
   */
  certificate_sha256?: string;
  /**
   * Accept any invalid certificate of the host. Only used if `certificate_sha256` is not set.
   * Default: false.
   */
  allow_invalid_certificate?: boolean;
}

/**
 * Cookie of a web view, set before the start page is loaded, each time the web view is opened.
 */
export interface WebviewCookie {
  /** Cookie name, 1..256 characters. */
  name: string;
  /** Cookie value according to RFC 6265, at most 4096 characters. Secret. */
  value: string;
  /**
   * Domain of the cookie: the host of the `url` option or a parent domain of it. If not set,
   * the cookie is only sent to the host of the `url` option.
   */
  domain?: string;
  /** Path of the cookie. Default: `/`. */
  path?: string;
  /** Only send the cookie over HTTPS. Default: `true` for an `https://` URL, `false` otherwise. */
  secure?: boolean;
  /** Hide the cookie from scripts of the page. Default: false. */
  http_only?: boolean;
  /** Expiry date as ISO 8601 date-time string. If not set, the cookie is a session cookie. */
  expires?: string;
}

/**
 * Predefined user agents of a web view, sent in the `User-Agent` header and returned in
 * `navigator.userAgent`. A custom user agent string (at most 256 characters) may also be used.
 */
export enum WebviewUserAgent {
  /**
   * The user agent of the Remote, which identifies the Remote and its firmware version.
   */
  Default = "default",
  /**
   * The user agent of a common mobile browser, e.g. to get the mobile layout of a page.
   */
  Mobile = "mobile",
  /**
   * The user agent of a common desktop browser, e.g. to get the desktop layout of a page.
   */
  Desktop = "desktop"
}

/**
 * Physical button of the Remote which can be changed in the fullscreen web view, with the same
 * identifier as in the button mapping of an activity.
 *
 * Not every Remote model has all buttons: {@link WebviewButton.Red}, {@link WebviewButton.Green},
 * {@link WebviewButton.Yellow} and {@link WebviewButton.Blue} are only on the Remote Two,
 * {@link WebviewButton.Record}, {@link WebviewButton.Stop} and {@link WebviewButton.Menu} only
 * on the Remote 3. The buttons in {@link WEBVIEW_FIXED_BUTTONS} can't be changed.
 */
export enum WebviewButton {
  Back = "BACK",
  DpadUp = "DPAD_UP",
  DpadDown = "DPAD_DOWN",
  DpadLeft = "DPAD_LEFT",
  DpadRight = "DPAD_RIGHT",
  DpadMiddle = "DPAD_MIDDLE",
  VolumeUp = "VOLUME_UP",
  VolumeDown = "VOLUME_DOWN",
  ChannelUp = "CHANNEL_UP",
  ChannelDown = "CHANNEL_DOWN",
  Mute = "MUTE",
  Prev = "PREV",
  Play = "PLAY",
  Next = "NEXT",
  Stop = "STOP",
  Record = "RECORD",
  Menu = "MENU",
  Red = "RED",
  Green = "GREEN",
  Yellow = "YELLOW",
  Blue = "BLUE"
}

/**
 * Physical buttons with a fixed function in the web view, which can't be changed: `HOME` always
 * closes the web view, `POWER` and `VOICE` keep their normal function.
 */
export const WEBVIEW_FIXED_BUTTONS = ["HOME", "POWER", "VOICE"] as const;

/**
 * Web view function of a physical button.
 */
export enum WebviewButtonFunction {
  /** Zoom the page in by one step. The changed zoom isn't saved to the entity. */
  ZoomIn = "zoom_in",
  /** Zoom the page out by one step. The changed zoom isn't saved to the entity. */
  ZoomOut = "zoom_out",
  /** Zoom back to the effective `zoom` option of the web view. */
  ZoomReset = "zoom_reset",
  /** Scroll the page up by a small step. */
  ScrollUp = "scroll_up",
  /** Scroll the page down by a small step. */
  ScrollDown = "scroll_down",
  /** Scroll the page up by one screen. */
  PageUp = "page_up",
  /** Scroll the page down by one screen. */
  PageDown = "page_down",
  /** Scroll to the top of the page. */
  Top = "top",
  /** Scroll to the bottom of the page. */
  Bottom = "bottom",
  /** Go back in the history of the web view. */
  Back = "back",
  /** Go forward in the history of the web view. */
  Forward = "forward",
  /** Go back in the history, or close the web view on its first page. */
  BackOrClose = "back_or_close",
  /** Reload the page. */
  Reload = "reload",
  /** Stop loading the page. */
  Stop = "stop",
  /** Close the web view and return to the previous screen. */
  Close = "close",
  /** Show or hide the navigation controls. The change isn't saved to the entity. */
  ToggleNavigation = "toggle_navigation",
  /** Move the focus to the next element of the page, like `Tab` on a keyboard. */
  FocusNext = "focus_next",
  /** Move the focus to the previous element of the page, like `Shift+Tab` on a keyboard. */
  FocusPrevious = "focus_previous",
  /** The button does nothing. */
  None = "none"
}

/**
 * Key event of a physical button, sent to the page.
 *
 * Values match `KeyboardEvent.key` of the UI Events key values specification.
 */
export enum WebviewButtonKey {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  Enter = "Enter",
  Escape = "Escape",
  Backspace = "Backspace",
  Tab = "Tab",
  PageUp = "PageUp",
  PageDown = "PageDown",
  Home = "Home",
  End = "End",
  ContextMenu = "ContextMenu",
  BrowserBack = "BrowserBack",
  BrowserForward = "BrowserForward",
  BrowserRefresh = "BrowserRefresh",
  BrowserStop = "BrowserStop",
  Exit = "Exit",
  AudioVolumeUp = "AudioVolumeUp",
  AudioVolumeDown = "AudioVolumeDown",
  AudioVolumeMute = "AudioVolumeMute",
  ChannelUp = "ChannelUp",
  ChannelDown = "ChannelDown",
  MediaPlayPause = "MediaPlayPause",
  MediaPlay = "MediaPlay",
  MediaPause = "MediaPause",
  MediaStop = "MediaStop",
  MediaRecord = "MediaRecord",
  MediaRewind = "MediaRewind",
  MediaFastForward = "MediaFastForward",
  MediaTrackPrevious = "MediaTrackPrevious",
  MediaTrackNext = "MediaTrackNext",
  ColorF0Red = "ColorF0Red",
  ColorF1Green = "ColorF1Green",
  ColorF2Yellow = "ColorF2Yellow",
  ColorF3Blue = "ColorF3Blue"
}

/**
 * Action of a physical button in the fullscreen web view.
 */
export type WebviewButtonAction =
  | { action: "pass" }
  | { action: "function"; function: WebviewButtonFunction | string }
  | { action: "key"; key: WebviewButtonKey | string };

/**
 * Web view entity options.
 *
 * The origin (scheme, host and port) of the `url` option is the scope of `auth`, `cookies` and
 * `tls`: they are never applied to another origin.
 */
export interface WebviewEntityOptions {
  /**
   * Start page of the web view. Absolute `http://` or `https://` URL, without user name and
   * password. The URL is not a secret: don't put tokens in the query string.
   */
  url: string;
  /** Credentials sent to the origin of the `url` option. */
  auth?: WebviewAuth;
  /** Exception for an invalid TLS certificate of the host of the `url` option. */
  tls?: WebviewTls;
  /** Cookies set before the start page is loaded, each time the web view is opened. At most 20. */
  cookies?: WebviewCookie[];
  /** User agent of the web view. Default: {@link WebviewUserAgent.Default}. */
  user_agent?: WebviewUserAgent | string;
  /** Page zoom in percent: 25..400. Default: 100. */
  zoom?: number;
  /**
   * Background color while the page is loading and behind transparent pages, as `#RRGGBB`.
   * Empty or not set: white `#FFFFFF`.
   */
  background_color?: string;
  /** Show back, forward, reload and close controls in the fullscreen web view. Default: false. */
  show_navigation?: boolean;
  /** Reload the page every n seconds while it is shown: 0 = off, otherwise 10..86400. Default: 0. */
  reload_interval?: number;
  /**
   * Function of single physical buttons in the fullscreen web view, by button identifier.
   * Only contains the buttons which differ from the global web view settings of the Remote.
   */
  buttons?: Partial<Record<WebviewButton | string, WebviewButtonAction>>;
  /**
   * Enable the device state API for all top-level pages of the web view: the battery state with
   * `navigator.getBattery()`, the `freeze` and `resume` events on `document`, and
   * `window.deviceHost` with the display state, the power source and the power profile.
   * Default: false.
   */
  device_api?: boolean;
}

export interface WebviewParams {
  icon?: string;
  description?: EntityDescription;
  attributes?: Partial<Record<WebviewAttributes, WebviewStates | string>>;
  options?: WebviewEntityOptions | EntityOptions;
  area?: string;
}

/**
 * A web view entity shows a web page on the Remote, fullscreen or in an activity widget.
 *
 * The web page is rendered by the user interface of the Remote. The integration driver only
 * provides the entity definition and never receives commands for a web view entity.
 *
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_webview.md web view entity documentation}
 * for more information.
 */
export class Webview extends Entity {
  /**
   * Constructs a new web view entity.
   *
   * @param id The entity identifier. Must be unique inside the integration driver.
   * @param name The human-readable name of the entity.
   * @param params Webview-entity parameters.
   * @throws AssertionError if invalid parameters are specified.
   */
  constructor(id: string, name: EntityName, { icon, description, attributes, options, area }: WebviewParams = {}) {
    super(id, name, EntityType.Webview, {
      icon,
      description,
      attributes: attributes as Record<string, string | number | boolean | string[] | null>,
      options: options as EntityOptions,
      area
    });

    log.debug(`Webview entity created with id: ${this.id}`);
  }
}
