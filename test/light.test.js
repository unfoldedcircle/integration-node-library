const test = require("ava");
const { Light } = require("../lib/entities/entities");

test("Light constructor without parameter object creates default Light class", (t) => {
  const entity = new Light("test", "Test Light");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Light" });
  t.is(entity.entity_type, "light");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.is(entity.attributes, null);
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Light constructor with parameter object", (t) => {
  const entity = new Light("test", "Test Light", {
    features: [Light.FEATURES.COLOR_TEMPERATURE],
    attributes: new Map([[Light.ATTRIBUTES.STATE, Light.STATES.UNAVAILABLE]]),
    options: {},
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Light" });
  t.is(entity.entity_type, "light");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["color_temperature"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, {});
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Light constructor with Object attributes", (t) => {
  const entity = new Light("test", "Test Light", {
    attributes: { brightness: 33 }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Light" });
  t.is(entity.entity_type, "light");
  t.deepEqual(entity.attributes, { brightness: 33 });
});
