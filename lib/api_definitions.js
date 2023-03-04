'use strict';

const DEVICE_STATES = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
};

module.exports.DEVICE_STATES = DEVICE_STATES;

const STATUS_CODES = {
  OK: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

module.exports.STATUS_CODES = STATUS_CODES;

const MESSAGES = {
  AUTHENTICATION: 'authentication',
  GET_DRIVER_VERSION: 'get_driver_version',
  GET_DEVICE_STATE: 'get_device_state',
  GET_AVAILABLE_ENTITIES: 'get_available_entities',
  GET_ENTITY_STATES: 'get_entity_states',
  SUBSCRIBE_EVENTS: 'subscribe_events',
  UNSUBSCRIBE_EVENTS: 'unsubscribe_events',
  ENTITY_COMMAND: 'entity_command'
};

module.exports.MESSAGES = MESSAGES;

const EVENTS = {
  // own events
  ENTITY_COMMAND: 'entity_command',
  ENTITY_ATTRIBUTES_UPDATED: 'entity_attributes_updated',
  SUBSCRIBE_ENTITIES: 'subscribe_entities',
  UNSUBSCRIBE_ENTITIES: 'unsubscribe_entities',

  // integration api events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DRIVER_VERSION: 'driver_version',
  DEVICE_STATE: 'device_state',
  AVAILABLE_ENTITIES: 'available_entities',
  ENTITY_STATES: 'entity_states',
  ENTITY_CHANGE: 'entity_change'
};

module.exports.EVENTS = EVENTS;

const EVENT_CATEGORY = {
  DEVICE: 'DEVICE',
  ENTITY: 'ENTITY'
};

module.exports.EVENT_CATEGORY = EVENT_CATEGORY;
