// use package in production
// const uc = require("uc-integration-api");
//uc.init("light-driver.json");

import uc from "../../index";
import * as fs from "fs";
import * as path from "path";

const initFilePath = path.resolve(__dirname, "light-driver.json");
if (fs.existsSync(initFilePath)) {
  uc.init(initFilePath);
  console.log("File found, initialization successful.");
} else {
  console.error(`Error: File not found at ${initFilePath}`);
  throw new Error(`File not found: ${initFilePath}`);
}

import Button from "../../lib/entities/button";
import Light from "../../lib/entities/light";
import MediaPlayer from "../../lib/entities/media_player";
import {
  FEATURES as MEDIAPLAYER_FEATURES,
  ATTRIBUTES as MEDIAPLAYER_ATTRIBUTES,
  STATES as MEDIAPLAYER_STATES,
  DEVICECLASSES as MEDIAPLAYER_DEVICECLASSES
} from "../../lib/entities/media_player";

import { COMMANDS as BUTTONCOMMANDS } from "../../lib/entities/button";
import { STATUS_CODES } from "http";
import { DEVICE_STATES, EVENTS as API_EVENTS } from "../../lib/api_definitions";
import { CommandHandler } from "../../lib/entities/entity";

import {
  COMMANDS as LIGHT_COMMANDS,
  STATES as LIGHT_STATES,
  ATTRIBUTES as LIGHT_ATTRIBUTES,
  FEATURES as LIGHT_FEATURES
} from "../../lib/entities/light";

uc.on(API_EVENTS.CONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.CONNECTED);
});

uc.on(API_EVENTS.DISCONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.DISCONNECTED);
});

uc.on(API_EVENTS.SUBSCRIBE_ENTITIES, async (entityIds) => {
  // the integration will configure entities and subscribe for entity update events
  // the UC library automatically adds the subscribed entities
  // from available to configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId: string) => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

uc.on(API_EVENTS.UNSUBSCRIBE_ENTITIES, async (entityIds) => {
  // when the integration unsubscribed from certain entity updates,
  // the UC library automatically remove the unsubscribed entities
  // from configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId: string) => {
    console.log(`Unsubscribed entity: ${entityId}`);
  });
});

/**
 * Shared command handler for different entities.
 *
 * Called by the integration-API if a command is sent to a configured entity.
 *
 * @param {Entity} entity button entity
 * @param {string} cmdId command
 * @param {Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
const sharedCmdHandler: CommandHandler = async function (entity, cmdId, params): Promise<string> {
  // let's add some hacky action to the button!
  if (entity.id === "my_button" && cmdId === BUTTONCOMMANDS.PUSH) {
    console.log("Got %s push request: toggling light", entity.id);
    // trigger a light command
    const lightEntity = uc.getConfiguredEntities().getEntity("my_unique_light_id");
    if (lightEntity) {
      await lightCmdHandler(lightEntity, LIGHT_COMMANDS.TOGGLE);
    }
    return STATUS_CODES.OK ?? "OK";
  }

  if (entity.id === "test_mediaplayer") {
    console.log("Got %s media-player command request: %s", entity.id, cmdId, params || "");

    return STATUS_CODES.OK ?? "OK";
  }

  console.log("Got %s command request: %s", entity.id, cmdId);

  return STATUS_CODES.OK ?? "OK";
};

/**
 * Dedicated light entity command handler.
 *
 * Called by the integration-API if a command is sent to a configured light-entity.
 *
 * @param {Entity} entity light entity
 * @param {string} cmdId command
 * @param {?Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
const lightCmdHandler: CommandHandler = async function (entity, cmdId, params): Promise<string> {
  console.log("Got %s command request: %s", entity.id, cmdId);

  // in this example we just update the entity, but in reality, you'd turn on the light with your integration
  // and handle the events separately for updating the configured entities
  switch (cmdId) {
    case LIGHT_COMMANDS.TOGGLE:
      if (entity.attributes.state === LIGHT_STATES.OFF) {
        uc.getConfiguredEntities().updateEntityAttributes(
          entity.id,
          new Map([
            [LIGHT_ATTRIBUTES.STATE, LIGHT_STATES.ON],
            [LIGHT_ATTRIBUTES.BRIGHTNESS, params && params.brightness ? params.brightness : 255]
          ])
        );
      } else if (entity.attributes.state === LIGHT_STATES.ON) {
        uc.getConfiguredEntities().updateEntityAttributes(
          entity.id,
          new Map([
            [LIGHT_ATTRIBUTES.STATE, LIGHT_STATES.OFF],
            [LIGHT_ATTRIBUTES.BRIGHTNESS, params && params.brightness ? params.brightness : 0]
          ])
        );
      }
      break;
    case LIGHT_COMMANDS.ON:
      // params is optional! Use a default if not provided.
      // A real lamp might store the last brightness value, otherwise the integration could also keep track of the last value.
      uc.getConfiguredEntities().updateEntityAttributes(
        entity.id,
        new Map([
          [LIGHT_ATTRIBUTES.STATE, LIGHT_STATES.ON],
          [LIGHT_ATTRIBUTES.BRIGHTNESS, params && params.brightness ? params.brightness : 127]
        ])
      );
      uc.getConfiguredEntities().updateEntityAttributes(
        "test_mediaplayer",
        new Map([[MEDIAPLAYER_ATTRIBUTES.VOLUME, 24]])
      );
      break;
    case LIGHT_COMMANDS.OFF:
      uc.getConfiguredEntities().updateEntityAttributes(
        entity.id,
        new Map([
          [LIGHT_ATTRIBUTES.STATE, LIGHT_STATES.OFF],
          [LIGHT_ATTRIBUTES.BRIGHTNESS, params && params.brightness ? params.brightness : 0]
        ])
      );
      break;
    default:
      return STATUS_CODES.NOT_IMPLEMENTED ?? "NOT_IMPLEMENTED";
  }

  return STATUS_CODES.OK ?? "OK";
};

// create a light entity
// normally you'd create this where your driver exposed the available entities
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const name = new Map([
  ["de", "Mein Lieblingslicht"],
  ["en", "My favorite light"]
]);
const lightEntity = new Light("my_unique_light_id", name, {
  features: [LIGHT_FEATURES.ON_OFF, LIGHT_FEATURES.DIM],
  attributes: new Map([
    [LIGHT_ATTRIBUTES.STATE, LIGHT_STATES.OFF],
    [LIGHT_ATTRIBUTES.BRIGHTNESS, "0"]
  ])
});
lightEntity.setCmdHandler(lightCmdHandler ?? null);

// add entity as available
// this is important, so the core knows what entities are available
uc.getAvailableEntities().addEntity(lightEntity);

const buttonEntity = new Button("my_button", "Push the button!", {
  area: "test lab",
  cmdHandler: sharedCmdHandler
});
uc.getAvailableEntities().addEntity(buttonEntity);

// add a media-player entity
const mediaPlayerEntity = new MediaPlayer("test_mediaplayer", new Map([["en", "Foobar MediaPlayer"]]), {
  features: [
    MEDIAPLAYER_FEATURES.ON_OFF,
    MEDIAPLAYER_FEATURES.DPAD,
    MEDIAPLAYER_FEATURES.HOME,
    MEDIAPLAYER_FEATURES.MENU,
    MEDIAPLAYER_FEATURES.CHANNEL_SWITCHER,
    MEDIAPLAYER_FEATURES.SELECT_SOURCE,
    MEDIAPLAYER_FEATURES.COLOR_BUTTONS,
    MEDIAPLAYER_FEATURES.PLAY_PAUSE
  ],
  attributes: new Map([
    [MEDIAPLAYER_ATTRIBUTES.STATE, MEDIAPLAYER_STATES.OFF],
    [MEDIAPLAYER_ATTRIBUTES.SOURCE_LIST, '["Radio", "Streaming", "Favorite 1", "Favorite 2", "Favorite 3"]']
  ]),
  deviceClass: MEDIAPLAYER_DEVICECLASSES.STREAMING_BOX
});
mediaPlayerEntity.setCmdHandler(sharedCmdHandler);
uc.getAvailableEntities().addEntity(mediaPlayerEntity);
