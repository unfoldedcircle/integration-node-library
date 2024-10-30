import test from "ava";
import { EntityType } from "../lib/entities/entity.js";
import { Switch, Options, Features, Attributes, States } from "../lib/entities/switch.js";

test("Switch constructor without parameter object creates default Switch class", (t) => {
  const entity = new Switch("test", "Test Switch");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, EntityType.Switch);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Switch constructor with parameter object", (t) => {
  const options: Record<Options, boolean> = {
    [Options.Readable]: true
  };

  const attributes: Partial<Record<Attributes, States>> = {
    [Attributes.State]: States.Unavailable
  };

  const entity = new Switch("test", "Test Switch", {
    features: [Features.Toggle],
    attributes,
    options,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, EntityType.Switch);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, ["toggle"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, { readable: true });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Switch constructor with Object attributes", (t) => {
  const entity = new Switch("test", "Test Switch", {
    attributes: { state: States.Off }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Switch" });
  t.is(entity.entity_type, EntityType.Switch);
  t.deepEqual(entity.attributes, { state: "OFF" });
});
