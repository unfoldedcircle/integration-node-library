"use strict";

const WebSocket = require("ws");
const EventEmitter = require("events");
const fs = require("fs");

const uc = require("./lib/api_definitions");
const Entities = require("./lib/entities/entities");

function log(message) {
	console.log(`[UC Integration API] ${message}`);
}

class IntegrationAPI extends EventEmitter {
	#driverPath;
	#driverInfo;
	#state;
	#server;

	constructor() {
		super();

		this.#driverPath = "driver.json";

		// set default state to connected
		this.#state = uc.DEVICE_STATES.DISCONNECTED;

		// create storage for available and configured entities
		this.availableEntities = new Entities("available");
		this.configuredEntities = new Entities("configured");

		// connect to update events for entity attributes
		this.configuredEntities.on(
			uc.EVENTS.ENTITY_ATTRIBUTES_UPDATED,
			async (entity_id, entity_type, attributes) => {
				const data = {
					entity_id: entity_id,
					entity_type: entity_type,
					attributes: attributes,
				};

				await this.#sendEvent(uc.EVENTS.ENTITY_CHANGE, data, uc.EVENT_CATEGORY.ENTITY);
			}
		);
	}

	init(driverPath) {
		// load driver information from driver.json
		this.#driverPath = driverPath;
		let raw;

		try {
			raw = fs.readFileSync(driverPath);
		} catch (e) {
			throw Error(`Cannot load driver.json: ${e}`)
		}

		try {
			this.#driverInfo = JSON.parse(raw);
			log("Driver info loaded");
		} catch (e) {
			log(`Error parsing driver info: ${e}`);
			throw Error("Error parsing driver info")

		}

		// setup websocket server - remote-core will connect to this
		this.#server = new WebSocket.Server({ port: this.#driverInfo.port });
		this.connection = null;

		this.#server.on("connection", (connection, req) => {
			log("WS: New connection");
			this.connection = connection;

			this.#authentication(true);

			connection.on("message", async (message) => {
				await this.#messageReceived(message);
			});

			connection.on("close", () => {
				log("WS: Connection closed");
				this.connection = null;
			});

			connection.on("error", () => {
				log("WS: Connection error");
				this.connection = null;
			});
		});
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	// send a response to a request
	async #sendResponse(id, msg = "result", msgData, statusCode = uc.STATUS_CODES.OK) {
		const json = {
			kind: "resp",
			req_id: id,
			code: statusCode,
			msg,
			msg_data: msgData,
		};

		if (this.connection != null) {
			const response = JSON.stringify(json);
			log(`Sending response: ${response}`);
			this.connection.send(response);
		}
	}

	// send an event
	async #sendEvent(msg, msgData, cat) {
		const json = {
			kind: "event",
			msg,
			msg_data: msgData,
			cat: cat,
		};

		if (this.connection != null) {
			const response = JSON.stringify(json);
			log(`Sending event: ${response}`);
			this.connection.send(response);
		}
	}

	// process incoming websocket messages
	async #messageReceived(message) {
		let json;
		try {
			json = JSON.parse(message);
		} catch (e) {
			log(`Json parse error: ${e}`);
			return;
		}

		log(`Incoming: ${JSON.stringify(json)}`);

		const kind = json.kind;
		const id = json.id;
		const msg = json.msg;
		const msgData = json.msg_data;

		if (kind === "req") {
			switch (msg) {
				case uc.MESSAGES.GET_DRIVER_VERSION:
					await this.#sendResponse(
						id,
						uc.EVENTS.DRIVER_VERSION,
						this.getDriverVersion()
					);
					break;

				case uc.MESSAGES.GET_DEVICE_STATE:
					await this.#sendResponse(
						id,
						uc.EVENTS.DEVICE_STATE,
						this.#getDeviceState()
					);
					break;

				case uc.MESSAGES.GET_AVAILABLE_ENTITIES:
					await this.#sendResponse(id, uc.EVENTS.AVAILABLE_ENTITIES, {
						available_entities: this.#getAvailableEntities(),
					});
					break;

				case uc.MESSAGES.GET_ENTITY_STATES:
					await this.#sendResponse(
						id,
						uc.EVENTS.ENTITY_STATES,
						this.#getEntityStates()
					);
					break;

				case uc.MESSAGES.ENTITY_COMMAND:
					await this.#entityCommand(id, msgData);
					break;

				case uc.MESSAGES.SUBSCRIBE_EVENTS:
					await this.#sendResponse(
						id,
						"result",
						null,
						await this.#subscribeEvents(msgData) ? uc.STATUS_CODES.OK : uc.STATUS_CODES.NOT_FOUND
					);
					break;

				case uc.MESSAGES.UNSUBSCRIBE_EVENTS:
					await this.#unSubscribeEvents(msgData);

					await this.#sendResponse(
						id,
						"result",
						null
					);
					break;

				default:
					break;
			}
		} else if (kind === "event") {
			switch (msg) {
				case uc.EVENTS.CONNECT:
					this.emit(uc.EVENTS.CONNECT);
					break;

				case uc.EVENTS.DISCONNECT:
					this.emit(uc.EVENTS.DISCONNECT);
					break;

				default:
					break;
			}
		}
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	// private methods
	#authentication(success) {
		this.#sendResponse(
			0,
			uc.MESSAGES.AUTHENTICATION,
			null,
			success ? uc.STATUS_CODES.OK : uc.STATUS_CODES.UNAUTHORIZED
		);
	}

	#getDeviceState() {
		return {
			state: this.#state,
		};
	}

	#getAvailableEntities() {
		// return list of entities
		return this.availableEntities.getEntities();
	}

	async #subscribeEvents(entities) {
		// copy available entities to registered entities
		let res = true;

		entities.entity_ids.forEach((entityId) => {
			const entity = this.availableEntities.getEntity(entityId);
			if (entity != null) {
				if (!this.configuredEntities.addEntity(entity)) {
					res = false;
				}
			}
		});

		this.configuredEntities.saveData();

		this.emit(uc.EVENTS.SUBSCRIBE_ENTITIES, entities.entity_ids);

		return res;
	}

	async #unSubscribeEvents(entities) {
		// remove entities from registered entities
		let res = true;

		entities.entity_ids.forEach((entityId) => {
			if (!this.configuredEntities.removeEntity(entityId)) {
				res = false;
			}
		});

		this.configuredEntities.saveData();

		this.emit(uc.EVENTS.UNSUBSCRIBE_ENTITIES, entities.entity_ids);

		return res;
	}

	#getEntityStates() {
		// simply return entity states from configured entities
		return this.configuredEntities.getStates();
	}

	async #entityCommand(id, data) {
		// emit event, so the driver can act on it
		this.emit(
			uc.MESSAGES.ENTITY_COMMAND,
			id,
			data.entity_id,
			data.entity_type,
			data.cmd_id,
			data.params
		);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	getDriverVersion() {
		return {
			name: this.#driverInfo.name.en,
			version: {
				api: this.#driverInfo.min_core_api,
				driver: this.#driverInfo.version,
			},
		};
	}

	async setDeviceState(state) {
		this.#state = state;

		await this.#sendEvent(
			uc.EVENTS.DEVICE_STATE,
			{
				state: this.#state,
			},
			uc.EVENT_CATEGORY.DEVICE
		);
	}

	async acknowledgeCommand(id, statusCode = uc.STATUS_CODES.OK) {
		await this.#sendResponse(id, "result", null, statusCode);
	}
}

module.exports = new IntegrationAPI();
module.exports.DEVICE_STATES = uc.DEVICE_STATES;
module.exports.EVENTS = uc.EVENTS;
module.exports.STATUS_CODES = uc.STATUS_CODES;
module.exports.Entities = Entities;
