"use strict";

// use package in production
// const uc = require("uc-integration-api");
const uc = require("../../index");
uc.init("light-driver.json");

uc.on(uc.EVENTS.CONNECT, async () => {
  await uc.setDeviceState(uc.DEVICE_STATES.CONNECTED);
});

uc.on(uc.EVENTS.DISCONNECT, async () => {
  await uc.setDeviceState(uc.DEVICE_STATES.DISCONNECTED);
});

uc.on(uc.EVENTS.SUBSCRIBE_ENTITIES, async (entityIds) => {
  // the integration will configure entities and subscribe for entity update events
  // the UC library automatically adds the subscribed entities
  // from available to configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId) => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

uc.on(uc.EVENTS.UNSUBSCRIBE_ENTITIES, async (entityIds) => {
  // when the integration unsubscribed from certain entity updates,
  // the UC library automatically remove the unsubscribed entities
  // from configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId) => {
    console.log(`Unsubscribed entity: ${entityId}`);
  });
});

/**
 * Shared command handler for different entities.
 *
 * Called by the integration-API if a command is sent to a configured entity.
 *
 * @param {uc.Entities.Entity} entity button entity
 * @param {string} cmdId command
 * @param {Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
async function sharedCmdHandler(entity, cmdId, params) {
  // let's add some hacky action to the button!
  if (entity.id === "my_button" && cmdId === uc.Entities.Button.COMMANDS.PUSH) {
    console.log("Got %s push request: toggling light", entity.id);
    // trigger a light command
    const lightEntity = uc.configuredEntities.getEntity("my_unique_light_id");
    if (lightEntity) {
      await lightCmdHandler(lightEntity, uc.Entities.Light.COMMANDS.TOGGLE, undefined);
    }
    return uc.STATUS_CODES.OK;
  }

  if (entity.id === "test_mediaplayer") {
    console.log("Got %s media-player command request: %s", entity.id, cmdId, params || "");

    return uc.STATUS_CODES.OK;
  }

  console.log("Got %s command request: %s", entity.id, cmdId);

  return uc.STATUS_CODES.OK;
}

/**
 * Dedicated light entity command handler.
 *
 * Called by the integration-API if a command is sent to a configured light-entity.
 *
 * @param {uc.Entities.Entity} entity light entity
 * @param {string} cmdId command
 * @param {?Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
async function lightCmdHandler(entity, cmdId, params) {
  console.log("Got %s command request: %s", entity.id, cmdId);

  // in this example we just update the entity, but in reality, you'd turn on the light with your integration
  // and handle the events separately for updating the configured entities
  switch (cmdId) {
    case uc.Entities.Light.COMMANDS.TOGGLE:
      if (entity.attributes.state === uc.Entities.Light.STATES.OFF) {
        uc.configuredEntities.updateEntityAttributes(
          entity.id,
          new Map([
            [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.ON],
            [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 255]
          ])
        );
      } else if (entity.attributes.state === uc.Entities.Light.STATES.ON) {
        uc.configuredEntities.updateEntityAttributes(
          entity.id,
          new Map([
            [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
            [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]
          ])
        );
      }
      break;
    case uc.Entities.Light.COMMANDS.ON:
      // params is optional! Use a default if not provided.
      // A real lamp might store the last brightness value, otherwise the integration could also keep track of the last value.
      uc.configuredEntities.updateEntityAttributes(
        entity.id,
        new Map([
          [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.ON],
          [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, params && params.brightness ? params.brightness : 127]
        ])
      );
      uc.configuredEntities.updateEntityAttributes(
        "test_mediaplayer",
        new Map([[uc.Entities.MediaPlayer.ATTRIBUTES.VOLUME, 24]])
      );
      break;
    case uc.Entities.Light.COMMANDS.OFF:
      uc.configuredEntities.updateEntityAttributes(
        entity.id,
        new Map([
          [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
          [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]
        ])
      );
      break;
    default:
      return uc.STATUS_CODES.NOT_IMPLEMENTED;
  }

  return uc.STATUS_CODES.OK;
}

// create a light entity
// normally you'd create this where your driver exposed the available entities
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const name = new Map([
  ["de", "Mein Lieblingslicht"],
  ["en", "My favorite light"]
]);
const lightEntity = new uc.Entities.Light("my_unique_light_id", name, {
  features: [uc.Entities.Light.FEATURES.ON_OFF, uc.Entities.Light.FEATURES.DIM],
  attributes: new Map([
    [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
    [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]
  ])
});
lightEntity.setCmdHandler(lightCmdHandler);

// add entity as available
// this is important, so the core knows what entities are available
uc.availableEntities.addEntity(lightEntity);

const buttonEntity = new uc.Entities.Button("my_button", "Push the button!", {
  area: "test lab",
  cmdHandler: sharedCmdHandler
});
uc.availableEntities.addEntity(buttonEntity);

// add a media-player entity
const mediaPlayerEntity = new uc.Entities.MediaPlayer("test_mediaplayer", new Map([["en", "Foobar MediaPlayer"]]), {
  features: [
    uc.Entities.MediaPlayer.FEATURES.ON_OFF,
    uc.Entities.MediaPlayer.FEATURES.DPAD,
    uc.Entities.MediaPlayer.FEATURES.HOME,
    uc.Entities.MediaPlayer.FEATURES.MENU,
    uc.Entities.MediaPlayer.FEATURES.CHANNEL_SWITCHER,
    uc.Entities.MediaPlayer.FEATURES.SELECT_SOURCE,
    uc.Entities.MediaPlayer.FEATURES.COLOR_BUTTONS,
    uc.Entities.MediaPlayer.FEATURES.PLAY_PAUSE
  ],
  attributes: new Map([
    [uc.Entities.MediaPlayer.ATTRIBUTES.STATE, uc.Entities.MediaPlayer.STATES.OFF],
    [uc.Entities.MediaPlayer.ATTRIBUTES.SOURCE_LIST, ["Radio", "Streaming", "Favorite 1", "Favorite 2", "Favorite 3"]]
  ]),
  deviceClass: uc.Entities.MediaPlayer.DEVICECLASSES.STREAMING_BOX
});
mediaPlayerEntity.setCmdHandler(sharedCmdHandler);
uc.availableEntities.addEntity(mediaPlayerEntity);
