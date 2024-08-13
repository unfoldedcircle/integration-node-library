const test = require("ava");
const { createSequenceCmd, createSendCmd } = require("../lib/entities/remote");
const { EntityCommand } = require("../lib/entities/ui");

const { AssertionError } = require("node:assert");

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
  const result = createSequenceCmd(["foo", "bar"], 0, 0);

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"], delay: 0, repeat: 0 });
});

test("createSequenceCmd with delay returns parameter field", (t) => {
  const result = createSequenceCmd(["foo", "bar"], 100);

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd_sequence");
  t.deepEqual(result.params, { sequence: ["foo", "bar"], delay: 100 });
});

test("createSequenceCmd with repeat returns parameter field", (t) => {
  const result = createSequenceCmd(["foo", "bar"], undefined, 2);

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
  const result = createSendCmd("foobar", 1, 2, 3);

  t.true(result instanceof EntityCommand, "result must be an EntityCommand");
  t.is(result.cmd_id, "send_cmd");
  t.deepEqual(result.params, { command: "foobar", delay: 1, repeat: 2, hold: 3 });
});
