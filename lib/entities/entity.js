"use strict";

const TYPES = {
	COVER: "cover",
	BUTTON: "button",
	CLIMATE: "climate",
	LIGHT: "light",
	MEDIA_PLAYER: "media_player",
	SENSOR: "sensor",
	SWITCH: "switch",
};

class Entity {
	constructor(
		id,
		name,
		entity_type,
		device_id,
		features,
		attributes,
		deviceClass,
		options,
		area
	) {
		this.id = id;
		this.name = name;
		this.entity_type = entity_type;
		this.device_id = device_id;
		this.features = features;
		this.attributes = attributes;
		this.device_class = deviceClass;
		this.options = options;
		this.area = area;
	}
}

module.exports = Entity;
module.exports.TYPES = TYPES;
