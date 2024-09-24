import test from "ava";
import Cover from "../lib/entities/cover";
import { FEATURES, ATTRIBUTES, STATES } from "../lib/entities/cover";

test("Cover constructor without parameter object creates default Cover class", (t) => {
  const entity = new Cover("test", "Test Cover");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Cover" });
  t.is(entity.entity_type, "cover");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Cover constructor with parameter object", (t) => {
  const entity = new Cover("test", "Test Cover", {
    features: [FEATURES.TILT],
    attributes: new Map([[ATTRIBUTES.STATE, STATES.UNAVAILABLE]]),
    options: {},
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Cover" });
  t.is(entity.entity_type, "cover");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["tilt"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, {});
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Cover constructor with Object attributes", (t) => {
  const entity = new Cover("test", "Test Cover", {
    attributes: { position: 50 }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Cover" });
  t.is(entity.entity_type, "cover");
  t.deepEqual(entity.attributes, { position: 50 });
});