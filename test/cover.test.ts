import test from "ava";
import { Cover, Features, Attributes, States } from "../lib/entities/cover.js";
import { EntityType } from "../lib/entities/entity.js";

test("Cover constructor without parameter object creates default Cover class", (t) => {
  const entity = new Cover("test", "Test Cover");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Cover" });
  t.is(entity.entity_type, EntityType.Cover);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Cover constructor with parameter object", (t) => {
  const attributes: Partial<Record<Attributes, States | number>> = {
    [Attributes.State]: States.Unavailable
  };

  const entity = new Cover("test", "Test Cover", {
    features: [Features.Tilt],
    attributes,
    options: {},
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Cover" });
  t.is(entity.entity_type, EntityType.Cover);
  t.is(entity.device_id, undefined);
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
  t.is(entity.entity_type, EntityType.Cover);
  t.deepEqual(entity.attributes, { position: 50 });
});
