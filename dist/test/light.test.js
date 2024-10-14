import test from "ava";
import Light, { FEATURES, STATES, ATTRIBUTES } from "../lib/entities/light.js";
test("Light constructor without parameter object creates default Light class", (t) => {
    const entity = new Light("test", "Test Light");
    t.is(entity.id, "test");
    t.deepEqual(entity.name, { en: "Test Light" });
    t.is(entity.entity_type, "light");
    t.is(entity.device_id, null);
    t.deepEqual(entity.features, []);
    t.deepEqual(entity.attributes, {});
    t.is(entity.device_class, undefined);
    t.is(entity.options, null);
    t.is(entity.area, undefined);
    t.is(entity.hasCmdHandler, false);
});
test("Light constructor with parameter object", (t) => {
    const attributes = {
        [ATTRIBUTES.STATE]: STATES.UNAVAILABLE
    };
    const entity = new Light("test", "Test Light", {
        features: [FEATURES.COLOR_TEMPERATURE],
        attributes,
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
