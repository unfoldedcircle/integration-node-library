import test from "ava";
import Switch from "../lib/entities/switch";
import { OPTIONS, FEATURES, ATTRIBUTES, STATES } from "../lib/entities/switch";

test("Switch constructor without parameter object creates default Switch class", (t) => {
  const entity = new Switch("test", "Test Switch");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, "switch");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Switch constructor with parameter object", (t) => {
  const options: Record<OPTIONS, boolean> = {
    [OPTIONS.READABLE]: true
  };

  const entity = new Switch("test", "Test Switch", {
    features: [FEATURES.TOGGLE],
    attributes: new Map([[ATTRIBUTES.STATE, STATES.UNAVAILABLE]]),
    options,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, "switch");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["toggle"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, { readable: true });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Switch constructor with Object attributes", (t) => {
  const entity = new Switch("test", "Test Switch", {
    attributes: { state: STATES.OFF }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, "switch");
  t.deepEqual(entity.attributes, { state: "OFF" });
});
