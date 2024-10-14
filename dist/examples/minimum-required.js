// use package in production
// const uc = require("uc-integration-api");
import uc from "../index.js";
import MediaPlayer from "../lib/entities/media_player.js";
import { FEATURES as MEDIAPLAYER_FEATURES, ATTRIBUTES as MEDIAPLAYER_ATTRIBUTES, STATES as MEDIAPLAYER_STATES } from "../lib/entities/media_player.js";
import { STATUS_CODES } from "http";
import { DEVICE_STATES, EVENTS as API_EVENTS } from "../lib/api_definitions.js";
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Handling events
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
uc.on(API_EVENTS.CONNECT, async () => {
    // act on when the core connects to the integration
    // for example: start polling your devices
    await uc.setDeviceState(DEVICE_STATES.CONNECTED);
});
uc.on(API_EVENTS.DISCONNECT, async () => {
    // act on when the core disconnects from the integration
    // for example: stop polling your devices
    await uc.setDeviceState(DEVICE_STATES.DISCONNECTED);
});
uc.on(API_EVENTS.ENTER_STANDBY, async () => {
    // act on when the remote goes to standby
});
uc.on(API_EVENTS.EXIT_STANDBY, async () => {
    // act on when the remote leaves standby
});
uc.on(API_EVENTS.SUBSCRIBE_ENTITIES, async () => {
    // The integration will configure entities and subscribe for entity update events.
    // The UC library automatically adds the subscribed entities
    // from the available to the configured pool.
    // You can act on this event if you need for your device handling.
    // ...
});
uc.on(API_EVENTS.UNSUBSCRIBE_ENTITIES, async () => {
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
const cmdHandler = async function (entity, cmdId, params) {
    console.log("Got %s command request: %s", entity.id, cmdId, params || "");
    // handle entity commands here
    // execute commands on your integration devices
    // for example start playing a song or change volume
    // Note: you might need to convert values for your desired range and format
    // ...
    // you need to acknowledge if the command was successfully executed with STATUS_CODES.OK
    // or an error code
    return STATUS_CODES.NOT_IMPLEMENTED ?? "NOT_IMPLEMENTED";
};
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Providing Available entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// your integration should make entities available for the core
// 1. create an entity
const entityId = "unique-id-inside-integration";
// The entity name can either be string (which will be mapped to english), or a Map with multiple language entries.
const entityName = "My entity";
const defaultAttributes = {
    [MEDIAPLAYER_ATTRIBUTES.STATE]: MEDIAPLAYER_STATES.OFF,
    [MEDIAPLAYER_ATTRIBUTES.VOLUME]: 0
};
const entity = new MediaPlayer(
// entity id has to be unique, you can provide it or use uc.Entities.generateId()
entityId, 
// name of the entity
entityName, {
    // define features in an array. Use the pre-defined object to choose features from
    features: [MEDIAPLAYER_FEATURES.ON_OFF, MEDIAPLAYER_FEATURES.VOLUME],
    // define default attributes for the entity. Use the pre-defined object to choose attributes from
    attributes: defaultAttributes,
    cmdHandler
});
// 2. add available entity to the core
uc.addEntity(entity);
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Updating entities
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// when your integration driver needs to update an entity based on a device change
// keys and values are attribute key and value pairs
const attributes = new Map([]);
uc.updateEntityAttributes(entityId, attributes);
// for example to update a state fo a media player:
uc.updateEntityAttributes(entityId, new Map([[MEDIAPLAYER_ATTRIBUTES.STATE, MEDIAPLAYER_STATES.PLAYING]]));
// or multiple attributes at the same time
uc.updateEntityAttributes(entityId, new Map([
    [MEDIAPLAYER_ATTRIBUTES.STATE, MEDIAPLAYER_STATES.PLAYING],
    [MEDIAPLAYER_ATTRIBUTES.MEDIA_ARTIST, "Massive Attack"]
]));
