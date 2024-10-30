import test from "ava";
import { EntityType } from "../lib/entities/entity.js";
import { Sensor, Options, States, Attributes, DeviceClasses } from "../lib/entities/sensor.js";

test("Sensor constructor without parameter object creates default Sensor class", (t) => {
  const entity = new Sensor("test", "Test Sensor");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, EntityType.Sensor);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Sensor constructor with parameter object", (t) => {
  const options: Partial<Record<Options, number>> = {
    [Options.MaxValue]: 42
  };

  const attributes: Partial<Record<Attributes, States | number>> = {
    [Attributes.State]: States.Unavailable
  };

  const entity = new Sensor("test", "Test Sensor", {
    attributes,
    options,
    deviceClass: DeviceClasses.Energy,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, EntityType.Sensor);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
  t.is(entity.device_class, "energy");
  t.deepEqual(entity.options, { max_value: 42 });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("Sensor constructor with Object attributes", (t) => {
  const attributes: Partial<Record<Attributes, States | number | string>> = {
    [Attributes.State]: States.On,
    [Attributes.Value]: 100,
    [Attributes.Unit]: "%"
  };

  const entity = new Sensor("test", "Test Sensor", {
    attributes
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, EntityType.Sensor);
  t.deepEqual(entity.attributes, { state: "ON", value: 100, unit: "%" });
});
