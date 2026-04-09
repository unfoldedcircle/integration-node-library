import test from "ava";
import { EntityType } from "../lib/entities/entity.js";
import { Select, SelectAttributes, SelectStates } from "../lib/entities/select.js";

test("Select constructor without parameter object creates default Select class", (t) => {
  const entity = new Select("test", "Test Select");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Select" });
  t.is(entity.entity_type, EntityType.Select);
  t.is(entity.icon, undefined);
  t.is(entity.description, undefined);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, { [SelectAttributes.State]: SelectStates.Unknown });
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Select constructor with parameter object", (t) => {
  const attributes: Partial<Record<SelectAttributes, SelectStates | string | string[]>> = {
    [SelectAttributes.State]: SelectStates.On,
    [SelectAttributes.CurrentOption]: "option1",
    [SelectAttributes.Options]: ["option1", "option2"]
  };

  const entity = new Select("test", "Test Select", {
    icon: "uc:star",
    description: "unit test",
    attributes,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Select" });
  t.is(entity.entity_type, EntityType.Select);
  t.is(entity.icon, "uc:star");
  t.deepEqual(entity.description, { en: "unit test" });
  t.deepEqual(entity.attributes, {
    state: "ON",
    current_option: "option1",
    options: ["option1", "option2"]
  });
  t.is(entity.area, "Test lab");
});
