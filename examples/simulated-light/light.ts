// use package in production
// const uc = require("uc-integration-api");
//uc.init("light-driver.json");
import uc, { CommandHandler, StatusCodes } from "../../index.js";

uc.init("light-driver.json");

uc.on(uc.Events.Connect, async () => {
  await uc.setDeviceState(uc.DeviceStates.Connected);
});

uc.on(uc.Events.Disconnect, async () => {
  await uc.setDeviceState(uc.DeviceStates.Disconnected);
});

uc.on(uc.Events.SubscribeEntities, async (entityIds) => {
  // the integration will configure entities and subscribe for entity update events
  // the UC library automatically adds the subscribed entities
  // from available to configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId: string) => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

uc.on(uc.Events.UnsubscribeEntities, async (entityIds: string[]) => {
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
const sharedCmdHandler: CommandHandler = async function (entity, cmdId, params): Promise<StatusCodes> {
  // let's add some hacky action to the button!
  if (entity.id === "my_button" && cmdId === uc.entities.Button.Commands.Push) {
    console.log("Got %s push request: toggling light", entity.id);
    // trigger a light command
    const lightEntity = uc.getConfiguredEntities().getEntity("my_unique_light_id");
    if (lightEntity) {
      await lightCmdHandler(lightEntity, uc.entities.Light.Commands.Toggle, undefined);
    }
    return uc.StatusCodes.Ok;
  }

  if (entity.id === "test_mediaplayer") {
    console.log("Got %s media-player command request: %s", entity.id, cmdId, params || "");

    return uc.StatusCodes.Ok;
  }

  console.log("Got %s command request: %s", entity.id, cmdId);

  return uc.StatusCodes.Ok;
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
const lightCmdHandler: CommandHandler = async function (entity, cmdId, params): Promise<StatusCodes> {
  console.log("Got %s command request: %s", entity.id, cmdId);

  // in this example we just update the entity, but in reality, you'd turn on the light with your integration
  // and handle the events separately for updating the configured entities
  switch (cmdId) {
    case uc.entities.Light.Commands.Toggle:
      if (entity.attributes?.state === uc.entities.Light.States.Off) {
        uc.getConfiguredEntities().updateEntityAttributes(entity.id, {
          [uc.entities.Light.Attributes.State]: uc.entities.Light.States.On,
          [uc.entities.Light.Attributes.Brightness]: 255
        });
      } else if (entity.attributes?.state === uc.entities.Light.States.On) {
        uc.getConfiguredEntities().updateEntityAttributes(entity.id, {
          [uc.entities.Light.Attributes.State]: uc.entities.Light.States.Off,
          [uc.entities.Light.Attributes.Brightness]: 0
        });
      }
      break;
    case uc.entities.Light.Commands.On:
      // params is optional! Use a default if not provided.
      // A real lamp might store the last brightness value, otherwise the integration could also keep track of the last value.
      uc.getConfiguredEntities().updateEntityAttributes(entity.id, {
        [uc.entities.Light.Attributes.State]: uc.entities.Light.States.On,
        [uc.entities.Light.Attributes.Brightness]: params && params.brightness ? params.brightness : 127
      });
      uc.getConfiguredEntities().updateEntityAttributes("test_mediaplayer", {
        [uc.entities.MediaPlayer.Attributes.Volume]: 24
      });
      break;
    case uc.entities.Light.Commands.Off:
      uc.getConfiguredEntities().updateEntityAttributes(entity.id, {
        [uc.entities.Light.Attributes.State]: uc.entities.Light.States.Off,
        [uc.entities.Light.Attributes.Brightness]: 0
      });
      break;
    default:
      return uc.StatusCodes.NotImplemented;
  }

  return uc.StatusCodes.Ok;
};

// create a light entity
// normally you'd create this where your driver exposed the available entities
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const name = {
  ["de"]: "Mein Lieblingslicht",
  ["en"]: "My favorite light"
};

const lightEntity = new uc.entities.Light("my_unique_light_id", name, {
  features: [uc.entities.Light.Features.OnOff, uc.entities.Light.Features.Dim],
  attributes: {
    [uc.entities.Light.Attributes.State]: uc.entities.Light.States.Off,
    [uc.entities.Light.Attributes.Brightness]: 0
  }
});
lightEntity.setCmdHandler(lightCmdHandler);

// add entity as available
// this is important, so the core knows what entities are available
uc.getAvailableEntities().addEntity(lightEntity);

const buttonEntity = new uc.entities.Button("my_button", "Push the button!", {
  area: "test lab",
  cmdHandler: sharedCmdHandler
});
uc.getAvailableEntities().addEntity(buttonEntity);

// add a media-player entity
const mediaPlayerEntity = new uc.entities.MediaPlayer(
  "test_mediaplayer",
  { en: "Foobar MediaPlayer" },
  {
    features: [
      uc.entities.MediaPlayer.Features.OnOff,
      uc.entities.MediaPlayer.Features.Dpad,
      uc.entities.MediaPlayer.Features.Home,
      uc.entities.MediaPlayer.Features.Menu,
      uc.entities.MediaPlayer.Features.ChannelSwitcher,
      uc.entities.MediaPlayer.Features.SelectSource,
      uc.entities.MediaPlayer.Features.ColorButtons,
      uc.entities.MediaPlayer.Features.PlayPause
    ],
    attributes: {
      [uc.entities.MediaPlayer.Attributes.State]: uc.entities.MediaPlayer.States.Off,
      [uc.entities.MediaPlayer.Attributes.SourceList]: ["Radio", "Streaming", "Favorite 1", "Favorite 2", "Favorite 3"]
    },
    deviceClass: uc.entities.MediaPlayer.DeviceClasses.StreamingBox
  }
);
mediaPlayerEntity.setCmdHandler(sharedCmdHandler);
uc.getAvailableEntities().addEntity(mediaPlayerEntity);
