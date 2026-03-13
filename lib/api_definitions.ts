/**
 * Integration driver API definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

// Define device states
export enum DeviceStates {
  Connected = "CONNECTED",
  Connecting = "CONNECTING",
  Disconnected = "DISCONNECTED",
  Error = "ERROR"
}

// Define status codes
export enum StatusCodes {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Timeout = 408,
  Conflict = 409,
  ServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503
}

// Define request/response messages
// FIXME properly define request, response and event messages according to Integration-API specs!
export enum Messages {
  Authentication = "authentication",
  GetDriverVersion = "get_driver_version",
  GetDeviceState = "get_device_state",
  GetAvailableEntities = "get_available_entities",
  GetEntityStates = "get_entity_states",
  SubscribeEvents = "subscribe_events",
  UnsubscribeEvents = "unsubscribe_events",
  EntityCommand = "entity_command",
  GetDriverMetadata = "get_driver_metadata",
  SetupDriver = "setup_driver",
  SetDriverUserData = "set_driver_user_data",
  BrowseMedia = "browse_media",
  SearchMedia = "search_media"
}

// Define event messages
export enum MsgEvents {
  Connect = "connect",
  Disconnect = "disconnect",
  EnterStandby = "enter_standby",
  ExitStandby = "exit_standby",
  DriverVersion = "driver_version",
  DeviceState = "device_state",
  AvailableEntities = "available_entities",
  EntityStates = "entity_states",
  EntityChange = "entity_change",
  DriverMetadata = "driver_metadata",
  MediaBrowse = "media_browse",
  MediaSearch = "media_search",
  DriverSetupChange = "driver_setup_change",
  AbortDriverSetup = "abort_driver_setup",
  GenerateOauth2AuthUrl = "generate_oauth2_auth_url",
  Oauth2AuthUrl = "oauth2_auth_url",
  CreateOauth2Cfg = "create_oauth2_cfg",
  GetOauth2Token = "get_oauth2_token",
  Oauth2Token = "oauth2_token",
  DeleteOauth2Token = "delete_oauth2_token",
  Oauth2Authorization = "oauth2_authorization",
  Oauth2Refreshed = "oauth2_refreshed"
}

export enum Events {
  EntityAttributesUpdated = "entity_attributes_updated",
  SubscribeEntities = "subscribe_entities",
  UnsubscribeEntities = "unsubscribe_entities",
  SetupDriver = "setup_driver",
  SetupDriverUserData = "setup_driver_user_data",
  SetupDriverUserConfirmation = "setup_driver_user_confirmation",
  SetupDriverAbort = "setup_driver_abort",
  Connect = "connect",
  Disconnect = "disconnect",
  EnterStandby = "enter_standby",
  ExitStandby = "exit_standby",
  Oauth2Authorization = "oauth2_authorization",
  Oauth2Refreshed = "oauth2_refreshed"
}

// Define event categories
export enum EventCategory {
  Device = "DEVICE",
  Entity = "ENTITY"
}

/**
 * More detailed error reason for `state: ERROR` condition.
 */
export enum IntegrationSetupError {
  None = "NONE",
  NotFound = "NOT_FOUND",
  ConnectionRefused = "CONNECTION_REFUSED",
  AuthorizationError = "AUTHORIZATION_ERROR",
  Timeout = "TIMEOUT",
  Other = "OTHER"
}

/**
 * Driver setup request base class.
 */
export class SetupDriver {
  // Base class logic here
}

/**
 * Start driver setup.
 *
 * If a driver includes a `setup_data_schema` object in its driver metadata, it enables the dynamic
 * driver setup process.
 *
 * The `reconfigure` flag indicates if the user wants to reconfigure an already configured driver in the Remote.
 * It's up to the driver on how to handle a reconfiguration request and run a different logic. For example, this
 * allows to show an options screen to change certain values, or present the option to modify, add or delete
 * provided device entities.
 *
 * The `setupData` parameter holds the user input result of a SettingsPage as key values.
 * - key: id of the field
 * - value: entered user value as string. This is either the entered text or number, selected checkbox state or the
 *          selected dropdown item id.
 *
 * ⚠️ Non-native string values as numbers or booleans are represented as string values!
 *
 * The integration driver has to respond with one of the following action objects:
 * - `RequestUserInput`: request a user input
 * - `RequestUserConfirmation`: request a user confirmation
 * - `SetupComplete` finishes the setup process and the UC Remote creates an integration instance.
 * - `SetupError` aborts the setup process.
 */
export class DriverSetupRequest extends SetupDriver {
  reconfigure: boolean;
  setupData: { [key: string]: string };

  constructor(reconfigure: boolean, setupData: { [key: string]: string }) {
    super();
    this.reconfigure = reconfigure;
    this.setupData = setupData;
  }
}

/**
 * Provide requested driver setup data to the integration driver in a setup process.
 */
export class UserDataResponse extends SetupDriver {
  inputValues: { [key: string]: string };

  constructor(inputValues: { [key: string]: string }) {
    super();
    this.inputValues = inputValues;
  }
}

/**
 * Provide user confirmation response to the integration driver in a setup process.
 */
export class UserConfirmationResponse extends SetupDriver {
  confirm: boolean;

  constructor(confirm: boolean) {
    super();
    this.confirm = confirm;
  }
}

/**
 * Abort notification.
 */
export class AbortDriverSetup extends SetupDriver {
  error: string;

  constructor(error: string) {
    super();
    this.error = error;
  }
}

/**
 * Setup action response base class.
 */
export class SetupAction {
  // Base class logic here
}

/**
 * Setup action to request user input.
 */
export class RequestUserInput extends SetupAction {
  title: string | Map<string, string> | { [key: string]: string };
  settings: Array<{ [key: string]: object | string }>;

  constructor(
    title: string | Map<string, string> | { [key: string]: string },
    settings: Array<{ [key: string]: object | string }>
  ) {
    super();
    this.title = title;
    this.settings = settings;
  }
}

/**
 * Setup action to request a user confirmation.
 * Create a new user confirmation request.
 * All text strings are either a simple string, which will be mapped to English, or a Map / Object containing multiple language strings.
 * @param {string | Map<string, string>|Object.<string, string>} title Confirmation page title of the request screen.
 * @param {string | Map<string, string>|Object.<string, string> | null} header Optional header text.
 * @param {string | null} image Optional base64 encoded image which will be shown between the header and footer texts.
 * @param {string | Map<string, string>|Object.<string, string> | null} footer Optional footer text.
 */
export class RequestUserConfirmation extends SetupAction {
  title: string | Map<string, string> | { [key: string]: string };
  header?: string | Map<string, string> | { [key: string]: string };
  image?: string;
  footer?: string | Map<string, string> | { [key: string]: string };

  constructor(
    title: string | Map<string, string> | { [key: string]: string },
    header?: string | Map<string, string> | { [key: string]: string },
    image?: string,
    footer?: string | Map<string, string> | { [key: string]: string }
  ) {
    super();
    this.title = title;
    this.header = header;
    this.image = image;
    this.footer = footer;
  }
}

/**
 * Setup action to abort setup process due to an error.
 */
export class SetupError extends SetupAction {
  errorType: string;

  constructor(errorType: string = IntegrationSetupError.Other) {
    super();
    this.errorType = errorType;
  }
}

/**
 * Setup action to complete a successful setup process.
 */
export class SetupComplete extends SetupAction {
  // Marks setup as complete
}

export interface Developer {
  name?: string;
  url?: string;
  email?: string;
}

export interface DriverInfo {
  driver_id: string;
  name: Record<string, string>;
  driver_url?: string;
  port?: number;
  version: string;
  min_core_api?: string;
  icon?: string;
  description?: Record<string, string>;
  developer?: Developer;
  home_page?: string;
  setup_data_schema?: object;
  release_date?: string;
}

export interface Oauth2Token {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

/**
 * Raw, unvalidated paging input — e.g. from a parsed query string or request body.
 */
export interface PagingOptions {
  /**
   * Page number, 1-based.
   */
  page?: number;

  /**
   * Number of items returned per page.
   */
  limit?: number;
}

/**
 * Paging query parameters.
 *
 * All parameters are optional; defaults are applied if omitted.
 * Validates input on construction — throws RangeError on invalid values.
 */
export class Paging {
  private readonly _page: number | undefined;
  private readonly _limit: number | undefined;

  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  /**
   * @param page  Page number, 1-based. Defaults to 1 if omitted.
   * @param limit Number of items per page. Max 100. Defaults to 10 if omitted.
   * @throws {RangeError} if page < 1 or limit is outside [1, 100].
   */
  constructor(page?: number, limit?: number) {
    if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
      throw new RangeError(`Invalid page number: ${page}. Must be an integer >= 1.`);
    }
    if (limit !== undefined && (limit < 1 || limit > Paging.MAX_LIMIT || !Number.isInteger(limit))) {
      throw new RangeError(`Invalid limit: ${limit}. Must be an integer between 1 and ${Paging.MAX_LIMIT}.`);
    }
    this._page = page;
    this._limit = limit;
  }

  /** Page number, 1-based. */
  get page(): number {
    return this._page ?? Paging.DEFAULT_PAGE;
  }

  /** Number of items per page. */
  get limit(): number {
    return this._limit ?? Paging.DEFAULT_LIMIT;
  }

  /** Overall item start offset, 0-based. */
  get offset(): number {
    return this.limit * (this.page - 1);
  }

  /** Returns a default Paging instance (page=1, limit=10). */
  static default(): Paging {
    return new Paging();
  }

  /** Construct from a raw, unvalidated options object (e.g. from a request body). */
  static fromOptions(options: PagingOptions = {}): Paging {
    return new Paging(options.page, options.limit);
  }
}

/**
 * Pagination metadata returned by the client.
 */
export class Pagination {
  readonly page: number;
  readonly limit: number;
  readonly total?: number;

  /**
   * @param page  Current page number, 1-based. Must correspond to the requested page.
   * @param limit Number of items returned in this page (1–100).
   * @param total Optional if known: Total number of available items across all pages.
   * @throws {RangeError} if any parameter violates its constraints.
   */
  constructor(page: number, limit: number, total?: number) {
    if (!Number.isInteger(page) || page < 1) {
      throw new RangeError(`Pagination: page must be an integer >= 1, got ${page}`);
    }
    if (!Number.isInteger(limit) || limit < 0 || limit > 100) {
      throw new RangeError(`Pagination: limit must be an integer between 0 and 100, got ${limit}`);
    }
    if (total && (!Number.isInteger(total) || total < 0)) {
      throw new RangeError(`Pagination: total must be a non-negative integer, got ${total}`);
    }

    this.page = page;
    this.limit = limit;
    this.total = total;
  }

  static empty(): Pagination {
    return new Pagination(1, 0, 0);
  }
}
