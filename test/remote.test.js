const test = require("ava");
const { createSequenceCmd, createSendCmd } = require("../lib/entities/remote");
const { EntityCommand } = require("../lib/entities/ui");

const { AssertionError } = require("node:assert");
const { Remote } = require("../lib/entities/entities");

test("createSequenceCmd with an undefined sequence throws an assert", (t) => {
  t.throws(
    () => {
      createSequenceCmd(undefined);
    },
    { instanceOf: AssertionError }
  );
});

test("createSequenceCmd with an empty sequence array throws an assert", (t) => {
  t.throws(
    () => {
      createSequenceCmd([]);
    },
    { instanceOf: AssertionError }
  );
});

test("createSequenceCmd without optional params doesn't include fields", (t) => {
  const result = createSequenceCmd(["foo", "bar"]);

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"] });
});

test("createSequenceCmd with value 0 for delay and repeat returns values", (t) => {
  const result = createSequenceCmd(["foo", "bar"], { delay: 0, repeat: 0 });

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"], delay: 0, repeat: 0 });
});

test("createSequenceCmd with delay returns parameter field", (t) => {
  const result = createSequenceCmd(["foo", "bar"], { delay: 100 });

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"], delay: 100 });
});

test("createSequenceCmd with repeat returns parameter field", (t) => {
  const result = createSequenceCmd(["foo", "bar"], { repeat: 2 });

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"], repeat: 2 });
});

test("createSendCmd with an undefined command throws an assert", (t) => {
  t.throws(
    () => {
      createSendCmd(undefined);
    },
    { instanceOf: AssertionError }
  );
});

test("createSendCmd with an empty command throws an assert", (t) => {
  t.throws(
    () => {
      createSendCmd("");
    },
    { instanceOf: AssertionError }
  );
});

test("createSendCmd without optional params doesn't include fields", (t) => {
  const result = createSendCmd("foobar");

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd");
  t.deepEqual(result.params, { command: "foobar" });
});

test("createSendCmd with optional params returns fields", (t) => {
  const result = createSendCmd("foobar", { delay: 1, repeat: 2, hold: 3 });

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd");
  t.deepEqual(result.params, { command: "foobar", delay: 1, repeat: 2, hold: 3 });
});

test("Remote constructor without parameter object creates default remote class", (t) => {
  const remote = new Remote("test", "Test Remote");

  t.is(remote.id, "test");
  t.deepEqual(remote.name, { en: "Test Remote" });
  t.is(remote.entity_type, "remote");
  t.is(remote.device_id, null);
  t.deepEqual(remote.features, []);
  t.is(remote.attributes, null);
  t.is(remote.device_class, undefined);
  t.deepEqual(remote.options, {});
  t.is(remote.area, undefined);
  t.is(remote.hasCmdHandler, false);
});

test("Remote constructor with parameter object", (t) => {
  const remote = new Remote("test", "Test Remote", {
    features: [Remote.FEATURES.SEND_CMD],
    attributes: new Map([[Remote.ATTRIBUTES.STATE, Remote.STATES.ON]]),
    simpleCommands: ["foobar", "foo", "bar"],
    area: "Test lab"
  });

  t.is(remote.id, "test");
  t.deepEqual(remote.name, { en: "Test Remote" });
  t.is(remote.entity_type, "remote");
  t.is(remote.device_id, null);
  t.deepEqual(remote.features, ["send_cmd"]);
  t.deepEqual(remote.attributes, { state: "ON" });
  t.is(remote.device_class, undefined);
  t.deepEqual(remote.options, { simple_commands: ["foobar", "foo", "bar"] });
  t.is(remote.area, "Test lab");
  t.is(remote.hasCmdHandler, false);
});

test("Remote constructor with Object attributes", (t) => {
  const entity = new Remote("test", "Test Remote", {
    attributes: { state: Remote.STATES.UNAVAILABLE }
  });

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Remote" });
  t.is(entity.entity_type, "remote");
  t.deepEqual(entity.attributes, { state: "UNAVAILABLE" });
});
