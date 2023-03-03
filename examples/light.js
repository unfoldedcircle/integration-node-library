"use strict";

// use package in production
// const uc = require("uc-integration-api");
const uc = require("../index");
uc.init("driver.json");

uc.on(uc.EVENTS.CONNECT, async () => {
    uc.setDeviceState(uc.DEVICE_STATES.CONNECTED);
});

uc.on(uc.EVENTS.DISCONNECT, async () => {
    uc.setDeviceState(uc.DEVICE_STATES.DISCONNECTED);
});

uc.on(uc.EVENTS.SUBSCRIBE_ENTITIES, async (entities) => {
    // the integration will configure entities and subscribe for entity update events
    // the UC library automatically adds the subscribed entities
    // from available to configured
    // you can act on this event if you need for your device handling
    entities.forEach(entity => {
        console.log(`Subsribed entity: ${JSON.stringify(entity, null, 4)}`);
    });
});

uc.on(uc.EVENTS.UNSUBSCRIBE_ENTITIES, async (entities) => {
    // when the integration unsubscribed from certain entity updates,
    // the UC library automatically remove the unsubscribed entities
    // from configured
    // you can act on this event if you need for your device handling
    entities.forEach(entity => {
        console.log(`Unsubsribed entity: ${JSON.stringify(entity, null, 4)}`);
    });
});

// create a light entity
// normally you'd create this where your driver exposed the available entities
const lightEntity = new uc.Entities.Light(
    "my_unique_light_id",
    "My favorite light",
    uc.getDriverVersion().id,
    [
        uc.Entities.Light.FEATURES.ON_OFF,
        uc.Entities.Light.FEATURES.DIM,
    ],
    {
        [uc.Entities.Light.ATTRIBUTES.STATE]: uc.Entities.Light.STATES.OFF,
        [uc.Entities.Light.ATTRIBUTES.BRIGHTNESS]: 0,
    }
)

// add entity as available
// this is important, so the core knows what entities are available
uc.availableEntities.addEntity(lightEntity);

// when a command request arrives from the core, handle the command
// in this example we just update the entity, but in reality, you'd turn on the light with your integration
// and handle the events separatly for updating the configured entities
uc.on(
    uc.EVENTS.ENTITY_COMMAND,
    async (id, entity_id, entity_type, cmd_id, params) => {
        console.log(
            `ENTITY COMMAND: ${id} ${entity_id} ${entity_type} ${cmd_id} ${JSON.stringify(params, null, 4)}`
        );

        // get the entity from the configured ones
        const entity = uc.configuredEntities.getEntity(entity_id);

        if (entity == null) {
            console.log("Entity not found");
            uc.acknowledgeCommand(id, uc.STATUS_CODES.NOT_FOUND);
            return;
        }

        switch (cmd_id) {
            case uc.Entities.Light.COMMANDS.TOGGLE:
                if (entity.attributes.state == uc.Entities.Light.STATES.OFF) {
                    uc.configuredEntities.updateEntityAttributes(
                        entity.id,
                        [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.ATTRIBUTES.BRIGHTNESS],
                        [uc.Entities.Light.STATES.ON, 255]
                    );
                } else if (entity.attributes.state == uc.Entities.Light.STATES.ON) {
                    uc.configuredEntities.updateEntityAttributes(
                        entity.id,
                        [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.ATTRIBUTES.BRIGHTNESS],
                        [uc.Entities.Light.STATES.OFF, 0]
                    );
                }
                break;
            case uc.Entities.Light.COMMANDS.ON:
                if (params.brightness) {
                    uc.configuredEntities.updateEntityAttributes(
                        entity.id,
                        [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.ATTRIBUTES.BRIGHTNESS],
                        [uc.Entities.Light.STATES.ON, params.brightness]
                    );
                } else {
                    uc.configuredEntities.updateEntityAttributes(
                        entity.id,
                        [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.ATTRIBUTES.BRIGHTNESS],
                        [uc.Entities.Light.STATES.OFF, 0]
                    );
                }
                break;
            case uc.Entities.Light.COMMANDS.OFF:
                uc.configuredEntities.updateEntityAttributes(
                    entity.id,
                    [uc.Entities.Light.ATTRIBUTES.STATE, uc.Entities.Light.ATTRIBUTES.BRIGHTNESS],
                    [uc.Entities.Light.STATES.OFF, 0]
                );
                break;
        }

        // you need to acknoledge if the command was successfully executed
        // we just say OK there, but you need to add logic if the command is 
        // really successfully executed on the device
        uc.acknowledgeCommand(id);
    }
);