// use package in production
// const uc = require("uc-integration-api");
import uc, { CommandHandler, StatusCodes } from "../index.js";

uc.init("driver.json");
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Handling events
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
uc.on(uc.Events.Connect, async () => {
  // act on when the core connects to the integration
  // for example: start polling your devices
  await uc.setDeviceState(uc.DeviceStates.Connected);
});

uc.on(uc.Events.Disconnect, async () => {
  // act on when the core disconnects from the integration
  // for example: stop polling your devices
  await uc.setDeviceState(uc.DeviceStates.Disconnected);
});

uc.on(uc.Events.EnterStandby, async () => {
  // act on when the remote goes to standby
});

uc.on(uc.Events.ExitStandby, async () => {
  // act on when the remote leaves standby
});

uc.on(uc.Events.SubscribeEntities, async () => {
  // The integration will configure entities and subscribe for entity update events.
  // The UC library automatically adds the subscribed entities
  // from the available to the configured pool.
  // You can act on this event if you need for your device handling.
  // ...
});

uc.on(uc.Events.UnsubscribeEntities, async () => {
  // When the integration unsubscribed from certain entity updates,
  // the UC library automatically removes the unsubscribed entities
  // from the configured pool.
  // You can act on this event if you need for your device handling.
  // ...
});

// handle commands coming from the core, either with a shared command handler for all entities, or individual handlers
// per entity or entity type
/**
 * Entity command handler.
 *
 * Called by the integration-API if a command is sent to a configured entity.
 *
 * @param {Entity} entity button entity
 * @param {string} cmdId command
 * @param {Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */

const cmdHandler: CommandHandler = async function (entity, cmdId, params): Promise<StatusCodes> {
  console.log("Got %s command request: %s", entity.id, cmdId, params || "");
  // handle entity commands here
  // execute commands on your integration devices
  // for example start playing a song or change volume
  // Note: you might need to convert values for your desired range and format

  // ...

  // you need to acknowledge if the command was successfully executed with STATUS_CODES.OK
  // or an error code
  return uc.StatusCodes.NotImplemented;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Providing Available entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// your integration should make entities available for the core
// 1. create an entity
const entityId = "unique-id-inside-integration";
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const entityName = "My entity";

const entity = new uc.entities.MediaPlayer(
  // entity id has to be unique, you can provide it or use uc.Entities.generateId()
  entityId,
  // name of the entity
  entityName,
  {
    // define features in an array. Use the pre-defined object to choose features from
    features: [uc.entities.MediaPlayer.Features.OnOff, uc.entities.MediaPlayer.Features.Volume],
    // define default attributes for the entity. Use the pre-defined object to choose attributes from
    attributes: {
      [uc.entities.MediaPlayer.Attributes.State]: uc.entities.MediaPlayer.States.Off,
      [uc.entities.MediaPlayer.Attributes.Volume]: 0
    },
    cmdHandler
  }
);

// 2. add available entity to the core
uc.addEntity(entity);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Updating entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// when your integration driver needs to update an entity based on a device change
// keys and values are attribute key and value pairs
const attributes = {};
uc.updateEntityAttributes(entityId, attributes);

// for example to update a state fo a media player:
uc.updateEntityAttributes(entityId, {
  [uc.entities.MediaPlayer.Attributes.State]: uc.entities.MediaPlayer.States.Playing
});

// or multiple attributes at the same time
uc.updateEntityAttributes(entityId, {
  [uc.entities.MediaPlayer.Attributes.State]: uc.entities.MediaPlayer.States.Playing,
  [uc.entities.MediaPlayer.Attributes.MediaArtist]: "Massive Attack"
});
