import test from "ava";
import MediaPlayer from "../lib/entities/media_player";
import { OPTIONS, FEATURES, STATES, ATTRIBUTES } from "../lib/entities/media_player";

test("MediaPlayer constructor without parameter object creates default MediaPlayer class", (t) => {
  const entity = new MediaPlayer("test", "Test MediaPlayer");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, "media_player");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, null);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("MediaPlayer constructor with parameter object", (t) => {
  const options: Partial<Record<OPTIONS, any>> = {};
  options[OPTIONS.VOLUME_STEPS] = 10;
  const attributes = new Map<string, any>([
    [ATTRIBUTES.STATE, STATES.UNAVAILABLE],
    [ATTRIBUTES.VOLUME, 22]
  ]);

  const entity = new MediaPlayer("test", "Test MediaPlayer", {
    features: [FEATURES.MENU],
    attributes: attributes,
    options,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, "media_player");
  t.is(entity.device_id, null);
  t.deepEqual(entity.features, ["menu"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE", volume: 22 });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, { volume_steps: 10 });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

/*
test("MediaPlayer constructor with Object attributes", (t) => {
  const entity = new MediaPlayer("test", "Test MediaPlayer", {
    attributes: { shuffle: false, muted: false, volume: 25 }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, "media_player");
  t.deepEqual(entity.attributes, { shuffle: false, muted: false, volume: 25 });
});
*/