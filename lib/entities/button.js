"use strict";

const Entity = require("./entity");

const STATES = {
	UNAVAILABLE: "UNAVAILABLE",
	AVAILABLE: "AVAILABLE",
};

const ATTRIBUTES = {
	STATE: "AVAILABLE",
};

class Button extends Entity {
	constructor(id, name, device_id, area) {
		super(id, name, Entity.TYPES.BUTTON, device_id, ["press"], {}, area);

		console.debug(`Button entity created with id: ${this.id}`);
	}
}

module.exports = Button;
module.exports.STATES = STATES;
module.exports.ATTRIBUTES = ATTRIBUTES;
