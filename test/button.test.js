const test = require("ava");
const { Button } = require("../lib/entities/entities");

test("Button constructor without parameter object creates default Button class", (t) => {
  const entity = new Button("test", "Test Button");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Button" });
  t.is(entity.entity_type, "button");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["press"]);
  t.deepEqual(entity.attributes, { state: "AVAILABLE" });
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Button constructor with parameter object", (t) => {
  const entity = new Button("test", "Test Button", {
    state: Button.STATES.UNAVAILABLE,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Button" });
  t.is(entity.entity_type, "button");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["press"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});
