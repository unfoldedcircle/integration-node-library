import test from "ava";
import Sensor from "../lib/entities/sensor";
import { OPTIONS, STATES, ATTRIBUTES, DEVICECLASSES } from "../lib/entities/sensor";

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
  const options: Partial<Record<OPTIONS, any>> = {
    [OPTIONS.MAX_VALUE]: 42
  };

  const attributes: Partial<Record<ATTRIBUTES, STATES | number>> = {
    [ATTRIBUTES.STATE]: STATES.UNAVAILABLE
  };

  const entity = new Sensor("test", "Test Sensor", {
    attributes,
    options,
    deviceClass: DEVICECLASSES.ENERGY,
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
  const attributes: Partial<Record<ATTRIBUTES, STATES | number | string>> = {
    [ATTRIBUTES.STATE]: STATES.ON,
    [ATTRIBUTES.VALUE]: 100,
    [ATTRIBUTES.UNIT]: "%"
  };

  const entity = new Sensor("test", "Test Sensor", {
    attributes
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Sensor" });
  t.is(entity.entity_type, "sensor");
  t.deepEqual(entity.attributes, { state: "ON", value: 100, unit: "%" });
});
