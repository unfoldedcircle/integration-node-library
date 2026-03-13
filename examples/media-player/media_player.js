// use integration library in a client project:
// import * as uc from "@unfoldedcircle/integration-api";
// individual classes and enums can also be imported
import * as uc from "../../dist/cjs/index.js";
import {
  BrowseMediaItem,
  BrowseResult,
  KnownMediaClass,
  KnownMediaContentType,
  MediaPlayerAttributes,
  MediaPlayerDeviceClasses,
  MediaPlayerFeatures,
  MediaPlayerStates
} from "../../dist/cjs/index.js";

const driver = new uc.IntegrationAPI();

driver.init("media_player.json");

driver.on(uc.Events.Connect, async () => {
  await driver.setDeviceState(uc.DeviceStates.Connected);
});

driver.on(uc.Events.Disconnect, async () => {
  await driver.setDeviceState(uc.DeviceStates.Disconnected);
});

class MediaPlayer extends uc.MediaPlayer {
  constructor() {
    super(
      "test_mediaplayer",
      { en: "Foobar MediaPlayer" },
      {
        features: [
          MediaPlayerFeatures.OnOff,
          MediaPlayerFeatures.Dpad,
          MediaPlayerFeatures.Home,
          MediaPlayerFeatures.Menu,
          MediaPlayerFeatures.ChannelSwitcher,
          MediaPlayerFeatures.SelectSource,
          MediaPlayerFeatures.PlayPause,
          MediaPlayerFeatures.PlayMedia,
          MediaPlayerFeatures.PlayMediaAction,
          MediaPlayerFeatures.ClearPlaylist,
          MediaPlayerFeatures.BrowseMedia,
          MediaPlayerFeatures.SearchMedia,
          MediaPlayerFeatures.SearchMediaClasses
        ],
        attributes: {
          [MediaPlayerAttributes.State]: MediaPlayerStates.Off,
          [MediaPlayerAttributes.SourceList]: ["Radio", "Streaming", "Favorite 1", "Favorite 2", "Favorite 3"],
          [MediaPlayerAttributes.SearchMediaClasses]: [
            KnownMediaClass.Album,
            KnownMediaClass.Artist,
            KnownMediaClass.Music,
            KnownMediaClass.Radio
          ]
        },
        deviceClass: MediaPlayerDeviceClasses.StreamingBox
      }
    );
  }

  async command(cmdId, params) {
    const parameters = params ? JSON.stringify(params) : "";
    console.log(`Got media-player command request: ${cmdId} ${parameters}`);

    return uc.StatusCodes.Ok;
  }

  async browse(options) {
    const paging = options.paging;
    console.log(
      "Media browsing request for %s: media_id=%s, media_type=%s, offset=%d, limit=%d",
      this.id,
      options.media_id,
      options.media_type,
      paging.offset,
      paging.limit
    );

    if (options.media_id === undefined && options.media_type === undefined) {
      if (paging.page > 1) {
        return BrowseResult.empty();
      }

      return this.browseRoot(paging);
    }

    switch (options.media_id) {
      case "favorites":
        return this.browseFavorites(paging);
      case "radio":
        return this.browseRadio(paging);
      case "albums":
        return this.browseAlbums(paging);
      default:
        return BrowseResult.empty();
    }
  }

  async search(options) {
    const paging = options.paging;
    console.log(
      "Media searching request for %s: '%s', media_id=%s, media_type=%s, filter=%s, offset=%d, limit=%d",
      this.id,
      options.query,
      options.media_id,
      options.media_type,
      JSON.stringify(options.filter),
      paging.offset,
      paging.limit
    );

    return uc.StatusCodes.NotImplemented;
  }

  browseRoot(paging) {
    const root = new BrowseMediaItem("", "Media Directory", {
      media_class: KnownMediaClass.Directory,
      can_browse: true,
      items: [
        new BrowseMediaItem("favorites", "Favorites", {
          media_class: KnownMediaClass.Directory,
          can_browse: true,
          can_play: true
        }),
        new BrowseMediaItem("radio", "Radio", {
          media_class: KnownMediaClass.Radio,
          can_browse: true
        }),
        new BrowseMediaItem("albums", "Albums", {
          media_class: KnownMediaClass.Directory,
          can_browse: true
        })
      ]
    });
    return new BrowseResult(root, new uc.Pagination(1, root.items.length, root.items.length));
  }

  browseFavorites(paging) {
    const maxFavorites = 99;
    const items = [];
    for (let i = paging.offset; i < paging.offset + paging.limit; i++) {
      const favId = i + 1;
      if (favId > maxFavorites) {
        break;
      }
      items.push(
        new BrowseMediaItem(`library://favorite/${favId}`, `Favorite ${favId}`, {
          media_class: KnownMediaClass.Directory,
          media_type: KnownMediaContentType.Music,
          can_play: true
        })
      );
    }
    const favorites = new BrowseMediaItem("favorites", "Favorites", {
      media_class: KnownMediaClass.Directory,
      can_browse: true,
      can_play: true,
      items: items
    });
    return BrowseResult.fromPaging(favorites, paging, maxFavorites);
  }

  browseRadio(paging) {
    const radios = [
      new BrowseMediaItem("library://radio/1", "RTS Couleur 3", {
        media_class: KnownMediaClass.Radio,
        media_type: KnownMediaContentType.Radio,
        can_play: true
      }),
      new BrowseMediaItem("library://radio/3", "Bassdrive", {
        media_class: KnownMediaClass.Radio,
        media_type: KnownMediaContentType.Radio,
        can_play: true
      }),
      new BrowseMediaItem("library://radio/4", "BBC Radio 1", {
        media_class: KnownMediaClass.Radio,
        media_type: KnownMediaContentType.Radio,
        can_play: true
      })
    ];
    const items = [];
    for (let i = paging.offset; i < paging.offset + paging.limit; i++) {
      if (i < radios.length) {
        items.push(radios[i]);
      }
    }

    const radio = new BrowseMediaItem("radio", "Radio", {
      media_class: KnownMediaClass.Directory,
      can_browse: true,
      items: items
    });
    return BrowseResult.fromPaging(radio, paging, 3);
  }

  browseAlbums(paging) {
    const maxAlbums = 1234;
    const items = [];
    for (let i = paging.offset; i < paging.offset + paging.limit; i++) {
      const albumId = i + 1;
      if (albumId > maxAlbums) {
        break;
      }
      items.push(
        new BrowseMediaItem(`library://album/${albumId}`, `Album ${albumId}`, {
          media_class: KnownMediaClass.Album,
          media_type: KnownMediaContentType.Album,
          can_play: true
        })
      );
    }
    const albums = new BrowseMediaItem("albums", "Albums", {
      media_class: KnownMediaClass.Directory,
      can_browse: true,
      items: items
    });
    return BrowseResult.fromPaging(albums, paging, maxAlbums);
  }
}

// add a media-player entity
const mediaPlayerEntity = new MediaPlayer();

driver.addAvailableEntity(mediaPlayerEntity);
