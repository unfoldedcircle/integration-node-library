const test = require("ava");
const { Climate } = require("../lib/entities/entities");

test("Climate constructor without parameter object creates default Climate class", (t) => {
  const entity = new Climate("test", "Test Climate");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Climate" });
  t.is(entity.entity_type, "climate");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.is(entity.attributes, null);
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Climate constructor with parameter object", (t) => {
  const options = {};
  options[Climate.OPTIONS.TEMPERATURE_UNIT] = "C";
  const entity = new Climate("test", "Test Climate", {
    features: [Climate.FEATURES.COOL],
    attributes: new Map([[Climate.ATTRIBUTES.STATE, Climate.STATES.UNAVAILABLE]]),
    options,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Climate" });
  t.is(entity.entity_type, "climate");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["cool"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, { temperature_unit: "C" });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Climate constructor with Object attributes", (t) => {
  const entity = new Climate("test", "Test Climate", {
    attributes: { state: "COOL" }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Climate" });
  t.is(entity.entity_type, "climate");
  t.deepEqual(entity.attributes, { state: "COOL" });
});
