"use strict";

const Entity = require("./entity");

const STATES = {
	UNAVAILABLE: "UNAVAILABLE",
	UNKNOWN: "UNKNOWN",
	ON: "ON",
	OFF: "OFF",
};

const FEATURES = {
	ON_OFF: "on_off",
	TOGGLE: "toggle",
	DIM: "dim",
	COLOR: "color",
	COLOR_TEMPERATURE: "color_temperature",
};

const ATTRIBUTES = {
	STATE: "state",
	HUE: "hue",
	SATURATION: "saturation",
	BRIGHTNESS: "brightness",
	COLOR_TEMPERATURE: "color_temperature",
};

const COMMANDS = {
	ON: "on",
	OFF: "off",
	TOGGLE: "toggle",
};

const DEVICECLASSES = {};

const OPTIONS = { COLOR_TEMPERATURE_STEPS: "color_temperature_steps" };

class Light extends Entity {
	constructor(
		id,
		name,
		device_id,
		features,
		attributes,
		deviceClass,
		options,
		area
	) {
		super(
			id,
			name,
			Entity.TYPES.LIGHT,
			device_id,
			features,
			attributes,
			deviceClass,
			options,
			area
		);

		console.debug(`Light entity created with id: ${this.id}`);
	}
}

module.exports = Light;
module.exports.STATES = STATES;
module.exports.FEATURES = FEATURES;
module.exports.ATTRIBUTES = ATTRIBUTES;
module.exports.COMMANDS = COMMANDS;
module.exports.DEVICECLASSES = DEVICECLASSES;
module.exports.OPTIONS = OPTIONS;
