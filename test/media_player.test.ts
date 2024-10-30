import test from "ava";
import { MediaPlayer, Options, Features, States, Attributes } from "../lib/entities/media_player.js";
import { EntityType } from "../lib/entities/entity.js";

test("MediaPlayer constructor without parameter object creates default MediaPlayer class", (t) => {
  const entity = new MediaPlayer("test", "Test MediaPlayer");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, EntityType.MediaPlayer);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, {});
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("MediaPlayer constructor with parameter object", (t) => {
  const options: Partial<Record<Options, number>> = {
    [Options.VolumeSteps]: 10
  };

  const attributes: Partial<Record<Attributes, States | number>> = {
    [Attributes.State]: States.Unavailable,
    [Attributes.Volume]: 22
  };

  const entity = new MediaPlayer("test", "Test MediaPlayer", {
    features: [Features.Menu],
    attributes,
    options,
    area: "Test lab"
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, EntityType.MediaPlayer);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, ["menu"]);
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE", volume: 22 });
  t.is(entity.device_class, undefined);
  t.deepEqual(entity.options, { volume_steps: 10 });
  t.is(entity.area, "Test lab");
  t.is(entity.hasCmdHandler, false);
});

test("MediaPlayer constructor with Object attributes", (t) => {
  const defaultAttributes: Partial<Record<Attributes, number | boolean>> = {
    [Attributes.Shuffle]: false,
    [Attributes.Muted]: false,
    [Attributes.Volume]: 25
  };

  const entity = new MediaPlayer("test", "Test MediaPlayer", {
    attributes: defaultAttributes
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test MediaPlayer" });
  t.is(entity.entity_type, EntityType.MediaPlayer);
  t.deepEqual(entity.attributes, { shuffle: false, muted: false, volume: 25 });
});
