'use strict';

// use package in production
// const uc = require("uc-integration-api");
const uc = require('../index');
uc.init('driver.json');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Handling events
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
uc.on(uc.EVENTS.CONNECT, async () => {
  // act on when the core connects to the integration
  // for example: start polling your devices
  await uc.setDeviceState(uc.DEVICE_STATES.CONNECTED);
});

uc.on(uc.EVENTS.DISCONNECT, async () => {
  // act on when the core disconnects from the integration
  // for example: stop polling your devices
  await uc.setDeviceState(uc.DEVICE_STATES.DISCONNECTED);
});

uc.on(uc.EVENTS.SUBSCRIBE_ENTITIES, async (entityIds) => {
  // the integration will configure entities and subscribe for entity update events
  // the UC library automatically adds the subscribed entities
  // from available to configured
  // you can act on this event if you need for your device handling

  // ...
});

uc.on(uc.EVENTS.UNSUBSCRIBE_ENTITIES, async (entityIds) => {
  // when the integration unsubscribed from certain entity updates,
  // the UC library automatically remove the unsubscribed entities
  // from configured
  // you can act on this event if you need for your device handling

  // ...
});

// handle commands coming from the core
uc.on(
  uc.EVENTS.ENTITY_COMMAND,
  async (wsHandle, entityId, entityType, cmdId, params) => {
    console.log(
            `ENTITY COMMAND: ${entityId} ${entityType} ${cmdId} ${JSON.stringify(params, null, 4)}`
    );

    // handle entity commands here
    // execute commands on your integration devices
    // for example start playing a song or change volume
    // Note: you might need to convert values for your desired range and format

    // ...

    // you need to acknowledge if the command was successfully executed
    // default is uc.STATUS_CODES.OK
    const statusCode = uc.STATUS_CODES.NOT_FOUND;
    await uc.acknowledgeCommand(wsHandle, statusCode);
  }
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Providing Available entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// your integration should make entities available for the core
// 1. create an entity
const entityId = 'unique-id-inside-integration';
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const entityName = 'My entity';

const entity = new uc.Entities.MediaPlayer(
  // entity id has to be unique, you can provide it or use uc.Entities.generateId()
  entityId,
  // name of the entity
  entityName,
  // define features in an array. Use the pre-defined object to choose features from
  [uc.Entities.MediaPlayer.FEATURES.ON_OFF, uc.Entities.MediaPlayer.FEATURES.VOLUME],
  // define default attributes for the entity. Use the pre-defined object to choose attributes from
  new Map([
    [uc.Entities.MediaPlayer.ATTRIBUTES.STATE, uc.Entities.MediaPlayer.STATES.OFF],
    [uc.Entities.MediaPlayer.ATTRIBUTES.VOLUME, 0]
  ])
);

// 2. add available entity to the core
uc.availableEntities.addEntity(entity);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Updating entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// when your integration driver needs to update an entity based on a device change
// keys and values are attribute key and value pairs
const attributes = new Map([]);
uc.configuredEntities.updateEntityAttributes(entityId, attributes);

// for example to update a state fo a media player:
uc.configuredEntities.updateEntityAttributes(entityId,
  new Map([[uc.Entities.MediaPlayer.ATTRIBUTES.STATE, uc.Entities.MediaPlayer.STATES.PLAYING]]));

// or multiple attributes at the same time
uc.configuredEntities.updateEntityAttributes(
  entityId,
  new Map([[uc.Entities.MediaPlayer.ATTRIBUTES.STATE, uc.Entities.MediaPlayer.STATES.PLAYING],
    [uc.Entities.MediaPlayer.ATTRIBUTES.MEDIA_ARTIST, 'Massive Attack']]));
