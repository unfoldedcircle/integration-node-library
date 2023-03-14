'use strict';

// use package in production
// const uc = require("uc-integration-api");
const uc = require('../../index');
uc.init('light-driver.json');

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

uc.on(uc.EVENTS.SETUP_DRIVER, async (wsHandle, setupData) => {
  console.log('Setting up driver. Setup data: ' + JSON.stringify(setupData));
  // do any initial checks here
  // ...
  await new Promise(resolve => setTimeout(resolve, 300));

  // all good: confirm request. This will start the setup flow
  await uc.acknowledgeCommand(wsHandle);
  console.log('Acknowledged driver setup');

  // implement interactive setup flow, this is just a simulated example
  // ...
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Sending setup progress that we are still busy...');
  await uc.driverSetupProgress(wsHandle);

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Requesting user confirmation to finish setup...');
  await uc.requestDriverSetupUserConfirmation(wsHandle, 'Please click next to continue driver setup');
});

uc.on(uc.EVENTS.SETUP_DRIVER_USER_DATA, async (wsHandle, userData) => {
  console.log('Received user input for driver setup: ' + JSON.stringify(userData));
  await uc.acknowledgeCommand(wsHandle);

  // implement interactive setup flow, this is just a simulated example
  // ...
  await new Promise(resolve => setTimeout(resolve, 700));

  console.log('Driver setup completed!');
  await uc.driverSetupComplete(wsHandle);
});

uc.on(uc.EVENTS.SETUP_DRIVER_USER_CONFIRMATION, async (wsHandle) => {
  console.log('Received user confirmation for driver setup: sending OK');
  await uc.acknowledgeCommand(wsHandle);

  // implement interactive setup flow, this is just a simulated example
  // ...
  await new Promise(resolve => setTimeout(resolve, 700));

  console.log('Sending setup progress that we are still busy...');
  await uc.driverSetupProgress(wsHandle);

  await new Promise(resolve => setTimeout(resolve, 700));

  await uc.requestDriverSetupUserInput(wsHandle, 'Data required',
    [
      { field: { text: { value: '192.168.100.30' } }, id: 'address', label: { en: 'Hostname or IP address' } },
      { field: { password: {} }, id: 'token', label: { en: 'Access token' } },
      { field: { number: { max: 65535, min: 1, value: 1000 } }, id: 'port', label: { en: 'Port' } },
      { field: { checkbox: { value: false } }, id: 'ssl', label: { en: 'Use SSL' } }
    ]);
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

const buttonEntity = new uc.Entities.Button('my_button', 'Push the button!');
uc.availableEntities.addEntity(buttonEntity);

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
    let entity = uc.configuredEntities.getEntity(entityId);
    if (entity == null) {
      console.log('Entity not found');
      await uc.acknowledgeCommand(wsHandle, uc.STATUS_CODES.NOT_FOUND);
      return;
    }

    // let's add some hacky action to the button!
    if (entityId === 'my_button' && cmdId === uc.Entities.Button.COMMANDS.PUSH) {
      cmdId = uc.Entities.Light.COMMANDS.TOGGLE;
      // switch personality
      const light = uc.configuredEntities.getEntity('my_unique_light_id');
      if (light) {
        entity = light;
      }
    }

    // this is just a **very simple and naive** command handler.
    // A real driver should also check the entityType since a command name is not unique among entity types.
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
