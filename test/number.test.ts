import test from "ava";
import { EntityType } from "../lib/entities/entity.js";
import {
  Number,
  NumberStates,
  NumberFeatures,
  NumberAttributes,
  NumberCommands,
  NumberDeviceClasses,
  NumberOptions,
  NumberDisplayMode
} from "../lib/entities/number.js";
import { StatusCodes } from "../lib/api_definitions.js";
import { Entities } from "../lib/entities/entities.js";

test("Number constructor without parameter object creates default Number class", (t) => {
  const entity = new Number("test", "Test Number");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Number" });
  t.is(entity.entity_type, EntityType.Number);
  t.is(entity.icon, undefined);
  t.is(entity.description, undefined);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, { [NumberAttributes.State]: NumberStates.Unknown });
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Number constructor with parameter object", (t) => {
  const options = {
    [NumberOptions.Min]: -10,
    [NumberOptions.Max]: 10,
    [NumberOptions.Step]: 0.5,
    [NumberOptions.Decimals]: 1,
    [NumberOptions.Unit]: "dB",
    [NumberOptions.DisplayMode]: NumberDisplayMode.Slider,
    [NumberOptions.Readable]: true
  };

  const attributes = {
    [NumberAttributes.State]: NumberStates.On,
    [NumberAttributes.Value]: 2.5
  };

  const entity = new Number("bass_control", "Bass", {
    icon: "uc:volume",
    description: "Bass level adjustment",
    features: [NumberFeatures.Value, NumberFeatures.Transition],
    attributes,
    deviceClass: NumberDeviceClasses.AudioLevel,
    options,
    area: "Living Room",
    cmdHandler: async (_entity, cmd, params) => {
      if (cmd === NumberCommands.SetValue && params?.value !== undefined) {
        return StatusCodes.Ok;
      }
      return StatusCodes.NotImplemented;
    }
  });

  t.is(entity.id, "bass_control");
  t.deepEqual(entity.name, { en: "Bass" });
  t.is(entity.entity_type, EntityType.Number);
  t.is(entity.icon, "uc:volume");
  t.deepEqual(entity.description, { en: "Bass level adjustment" });
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, ["value", "transition"]);
  t.deepEqual(entity.attributes, { state: "ON", value: 2.5 });
  t.is(entity.device_class, "audio_level");
  t.deepEqual(entity.options, {
    min: -10,
    max: 10,
    step: 0.5,
    decimals: 1,
    unit: "dB",
    display_mode: "slider",
    readable: true
  });
  t.is(entity.area, "Living Room");
  t.is(entity.hasCmdHandler, true);
});

test("Number constructor with null bounds and unavailable value", (t) => {
  const entity = new Number("unbounded_number", "Unbounded Number", {
    attributes: {
      [NumberAttributes.State]: NumberStates.Unavailable,
      [NumberAttributes.Value]: null
    },
    options: {
      [NumberOptions.Min]: null,
      [NumberOptions.Max]: null,
      [NumberOptions.Step]: 1,
      [NumberOptions.DisplayMode]: NumberDisplayMode.Stepper
    }
  });

  t.is(entity.id, "unbounded_number");
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE", value: null });
  t.deepEqual(entity.options, { min: null, max: null, step: 1, display_mode: "stepper" });
});

test("Number constructor with multilingual name and description", (t) => {
  const entity = new Number(
    "vol",
    { en: "Volume", de: "Lautstärke" },
    {
      description: { en: "Master volume", de: "Gesamtlautstärke" }
    }
  );

  t.is(entity.id, "vol");
  t.deepEqual(entity.name, { en: "Volume", de: "Lautstärke" });
  t.deepEqual(entity.description, { en: "Master volume", de: "Gesamtlautstärke" });
});

test("NumberStates contains expected states", (t) => {
  t.is(NumberStates.Unavailable as string, "UNAVAILABLE");
  t.is(NumberStates.Unknown as string, "UNKNOWN");
  t.is(NumberStates.On as string, "ON");
});

test("NumberFeatures contains expected features", (t) => {
  t.is(NumberFeatures.Value as string, "value");
  t.is(NumberFeatures.Transition as string, "transition");
});

test("NumberAttributes contains expected attributes", (t) => {
  t.is(NumberAttributes.State as string, "state");
  t.is(NumberAttributes.Value as string, "value");
});

test("NumberCommands contains expected commands", (t) => {
  t.is(NumberCommands.SetValue as string, "set_value");
  t.is(NumberCommands.Increment as string, "increment");
  t.is(NumberCommands.Decrement as string, "decrement");
});

test("NumberDeviceClasses contains all expected device classes", (t) => {
  const expectedClasses: Record<string, string> = {
    AudioLevel: "audio_level",
    Battery: "battery",
    Current: "current",
    Duration: "duration",
    Energy: "energy",
    Humidity: "humidity",
    Illuminance: "illuminance",
    Power: "power",
    Temperature: "temperature",
    Voltage: "voltage"
  };

  for (const [key, value] of Object.entries(expectedClasses)) {
    t.is(NumberDeviceClasses[key as keyof typeof NumberDeviceClasses], value as NumberDeviceClasses);
    const entity = new Number(`number_${value}`, `Number ${key}`, {
      deviceClass: value as NumberDeviceClasses
    });
    t.is(entity.device_class, value);
  }
});

test("NumberOptions contains all expected options", (t) => {
  t.is(NumberOptions.Min as string, "min");
  t.is(NumberOptions.Max as string, "max");
  t.is(NumberOptions.Step as string, "step");
  t.is(NumberOptions.Decimals as string, "decimals");
  t.is(NumberOptions.Unit as string, "unit");
  t.is(NumberOptions.DisplayMode as string, "display_mode");
  t.is(NumberOptions.Readable as string, "readable");
});

test("NumberDisplayMode contains all expected display modes", (t) => {
  t.is(NumberDisplayMode.Auto as string, "auto");
  t.is(NumberDisplayMode.Slider as string, "slider");
  t.is(NumberDisplayMode.Stepper as string, "stepper");
});

test("Number command execution and handler", async (t) => {
  const entity = new Number("target_temp", "Target Temperature", {
    features: [NumberFeatures.Value, NumberFeatures.Transition],
    attributes: { [NumberAttributes.Value]: 21 }
  });

  // Default without handler returns NotImplemented
  t.is(await entity.command(NumberCommands.SetValue, { value: 22 }), StatusCodes.NotImplemented);

  // Set handler
  let lastCmd: string | undefined;
  let lastParams: Record<string, string | number | boolean> | undefined;

  entity.setCmdHandler(async (_entity, cmd, params) => {
    lastCmd = cmd;
    lastParams = params;
    if (cmd === NumberCommands.SetValue) {
      return StatusCodes.Ok;
    }
    if (cmd === NumberCommands.Increment || cmd === NumberCommands.Decrement) {
      return StatusCodes.Ok;
    }
    return StatusCodes.NotFound;
  });

  t.is(entity.hasCmdHandler, true);

  const resSetValue = await entity.command(NumberCommands.SetValue, { value: 23.5, duration: 1000 });
  t.is(resSetValue, StatusCodes.Ok);
  t.is(lastCmd, NumberCommands.SetValue);
  t.deepEqual(lastParams, { value: 23.5, duration: 1000 });

  const resInc = await entity.command(NumberCommands.Increment, { step: 0.5 });
  t.is(resInc, StatusCodes.Ok);
  t.is(lastCmd, NumberCommands.Increment);
  t.deepEqual(lastParams, { step: 0.5 });

  const resDec = await entity.command(NumberCommands.Decrement, { step: 1 });
  t.is(resDec, StatusCodes.Ok);
  t.is(lastCmd, NumberCommands.Decrement);
  t.deepEqual(lastParams, { step: 1 });
});

test("Number entity in Entities pool management", (t) => {
  const entities = new Entities("configured");
  const entity = new Number("fan_speed", "Fan Speed", {
    attributes: { [NumberAttributes.State]: NumberStates.On, [NumberAttributes.Value]: 50 },
    options: { [NumberOptions.Min]: 0, [NumberOptions.Max]: 100, [NumberOptions.Step]: 1 }
  });

  t.true(entities.addAvailableEntity(entity));
  t.true(entities.contains("fan_speed"));
  t.is(entities.getEntity("fan_speed"), entity);

  const exportedEntities = entities.getEntities();
  t.is(exportedEntities.length, 1);
  t.is(exportedEntities[0].entity_id, "fan_speed");
  t.is(exportedEntities[0].entity_type, EntityType.Number);
  t.deepEqual(exportedEntities[0].options, { min: 0, max: 100, step: 1 });

  let eventFired = false;
  entities.on("entity_attributes_updated", (id, type, attrs) => {
    t.is(id, "fan_speed");
    t.is(type, EntityType.Number);
    t.deepEqual(attrs, { value: 75 });
    eventFired = true;
  });

  t.true(entities.updateEntityAttributes("fan_speed", { value: 75 }));
  t.true(eventFired);
  t.is(entity.attributes?.value, 75);

  const states = entities.getStates();
  t.is(states.length, 1);
  t.is(states[0].entity_id, "fan_speed");
  t.is(states[0].entity_type, EntityType.Number);
  t.deepEqual(states[0].attributes, { state: "ON", value: 75 });
});
