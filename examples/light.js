'use strict';

// use package in production
// const uc = require("uc-integration-api");
const uc = require('../index');
uc.init('driver.json');

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
  entityIds.forEach(entityId => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

uc.on(uc.EVENTS.UNSUBSCRIBE_ENTITIES, async (entityIds) => {
  // when the integration unsubscribed from certain entity updates,
  // the UC library automatically remove the unsubscribed entities
  // from configured
  // you can act on this event if you need for your device handling
  entityIds.forEach(entityId => {
    console.log(`Unsubscribed entity: ${entityId}`);
  });
});

// create a light entity
// normally you'd create this where your driver exposed the available entities
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const name = new Map([['de', 'Mein Lieblingslicht'], ['en', 'My favorite light']]);
const lightEntity = new uc.Entities.Light(
  'my_unique_light_id',
  name,
  [uc.Entities.Light.FEATURES.ON_OFF, uc.Entities.Light.FEATURES.DIM],
  new Map([
    [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
    [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]
  ])
);

// add entity as available
// this is important, so the core knows what entities are available
uc.availableEntities.addEntity(lightEntity);

// when a command request arrives from the core, handle the command
// in this example we just update the entity, but in reality, you'd turn on the light with your integration
// and handle the events separately for updating the configured entities
uc.on(
  uc.EVENTS.ENTITY_COMMAND,
  async (wsHandle, entityId, entityType, cmdId, params) => {
    console.log(
            `ENTITY COMMAND: ${entityId} ${entityType} ${cmdId} ${params ? JSON.stringify(params) : ''}`
    );

    // get the entity from the configured ones
    const entity = uc.configuredEntities.getEntity(entityId);

    if (entity == null) {
      console.log('Entity not found');
      await uc.acknowledgeCommand(wsHandle, uc.STATUS_CODES.NOT_FOUND);
      return;
    }

    switch (cmdId) {
      case uc.Entities.Light.COMMANDS.TOGGLE:
        if (entity.attributes.state === uc.Entities.Light.STATES.OFF) {
          uc.configuredEntities.updateEntityAttributes(
            entity.id,
            new Map([
              [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.ON],
              [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 255]])
          );
        } else if (entity.attributes.state === uc.Entities.Light.STATES.ON) {
          uc.configuredEntities.updateEntityAttributes(
            entity.id,
            new Map([
              [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
              [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]])
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
            [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, (params && params.brightness) ? params.brightness : 127]])
        );
        break;
      case uc.Entities.Light.COMMANDS.OFF:
        uc.configuredEntities.updateEntityAttributes(
          entity.id,
          new Map([
            [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.STATES.OFF],
            [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS, 0]])
        );
        break;
    }

    // you need to acknowledge if the command was successfully executed
    // we just say OK there, but you need to add logic if the command is
    // really successfully executed on the device
    await uc.acknowledgeCommand(wsHandle);
  }
);
