const test = require("ava");
const { Sensor } = require("../lib/entities/entities");

test("Sensor constructor without parameter object creates default Sensor class", (t) => {
  const entity = new Sensor("test", "Test Sensor");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, "sensor");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Sensor constructor with parameter object", (t) => {
  const options = {};
  options[Sensor.OPTIONS.MAX_VALUE] = 42;
  const entity = new Sensor("test", "Test Sensor", {
    attributes: new Map([[Sensor.ATTRIBUTES.STATE, Sensor.STATES.UNAVAILABLE]]),
    options,
    deviceClass: Sensor.DEVICECLASSES.ENERGY,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, "sensor");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, "energy");
  t.deepEqual(entity.options, { max_value: 42 });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Sensor constructor with Object attributes", (t) => {
  const entity = new Sensor("test", "Test Sensor", {
    attributes: { state: Sensor.STATES.ON, value: 100, unit: "%" }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, "sensor");
  t.deepEqual(entity.attributes, { state: "ON", value: 100, unit: "%" });
});
