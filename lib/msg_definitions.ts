/**
 * Integration driver API WS message definitions for Unfolded Circle Remote devices.
 *
 * @copyright (c) 2026 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

import { BrowseMediaItem, MediaContentType, SearchMediaFilter, SearchMediaItem } from "./entities/media_player";
import { Pagination, PagingOptions } from "./api_definitions";

/**
 * Payload data of `browse_media` request message in `msg_data` property.
 */
export interface BrowseMediaMsgData {
  /**
   * media-player entity ID to browse.
   */
  entity_id: string;

  /**
   * Optional media content ID to restrict browsing.
   */
  media_id?: string;

  /**
   * Optional media content type to restrict browsing.
   */
  media_type?: MediaContentType;

  /**
   * Optional paging object to limit returned items.
   */
  paging?: PagingOptions;
}

/**
 * Payload data of `search_media` request message in `msg_data` property.
 *
 * Search for media items in a media-player entity.
 */
export interface SearchMediaMsgData {
  /**
   * media-player entity ID to search in.
   */
  entity_id: string;

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
   * Optional paging object to limit returned items.
   */
  paging?: PagingOptions;
}

/**
 * Media browse response payload in the `msg_data` property.
 */
export interface BrowseMediaResponseMsgData {
  /**
   * Media browse result. Absent if no item was found.
   */
  media?: BrowseMediaItem;

  /**
   * Pagination information for this result page.
   */
  pagination: Pagination;
}

/**
 * Media search response payload in the `msg_data` property.
 */
export interface SearchMediaResponseMsgData {
  /**
   * Media search results.
   */
  media: SearchMediaItem[];

  /**
   * Pagination information for this result page.
   */
  pagination: Pagination;
}
