"use strict";

// use package in production
// const uc = require("uc-integration-api");
const uc = require("../../index");

const fs = require("fs");
const { createSendCmd, createSequenceCmd } = require("../../lib/entities/remote");

// Simple commands supported by this example remote entity
const supportedCommands = [
  "VOLUME_UP",
  "VOLUME_DOWN",
  "HOME",
  "GUIDE",
  "CONTEXT_MENU",
  "CURSOR_UP",
  "CURSOR_DOWN",
  "CURSOR_LEFT",
  "CURSOR_RIGHT",
  "CURSOR_ENTER",
  "MY_RECORDINGS",
  "MY_APPS",
  "REVERSE",
  "PLAY",
  "PAUSE",
  "FORWARD",
  "RECORD"
];

/**
 * Remote-entity command handler.
 *
 * Called by the integration-API if a command is sent to a configured entity.
 *
 * @param {uc.Entities.Entity} entity remote entity
 * @param {string} cmdId command
 * @param {?Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
const cmdHandler = async (entity, cmdId, params = {}) => {
  console.log(`Got ${entity.id} command request: ${cmdId}`);

  let state = null;
  switch (cmdId) {
    case uc.Entities.Remote.COMMANDS.ON:
      state = uc.Entities.Remote.STATES.ON;
      break;
    case uc.Entities.Remote.COMMANDS.OFF:
      state = uc.Entities.Remote.STATES.OFF;
      break;
    case uc.Entities.Remote.COMMANDS.TOGGLE:
      state =
        entity.attributes[uc.Entities.Remote.ATTRIBUTES.STATE] === uc.Entities.Remote.STATES.OFF
          ? uc.Entities.Remote.STATES.ON
          : uc.Entities.Remote.STATES.OFF;
      break;
    case uc.Entities.Remote.COMMANDS.SEND_CMD: {
      const command = params.command;
      // It's up to the integration what to do with an unknown command.
      // If the supported commands are provided as simple_commands, then it's easy to validate.
      if (!supportedCommands.includes(command)) {
        console.error(`Unknown command: ${command}`);
        return uc.STATUS_CODES.BAD_REQUEST;
      }
      const repeat = params.repeat || 1;
      const delay = params.delay || 0;
      const hold = params.hold || 0;
      console.log(`Command: ${command} (repeat=${repeat}, delay=${delay}, hold=${hold})`);
      break;
    }
    case uc.Entities.Remote.COMMANDS.SEND_CMD_SEQUENCE: {
      const sequence = params.sequence;
      const seqRepeat = params.repeat || 1;
      const seqDelay = params.delay || 0;
      console.log(`Command sequence: ${sequence} (repeat=${seqRepeat}, delay=${seqDelay})`);
      break;
    }
    default:
      console.error(`Unsupported command: ${cmdId}`);
      return uc.STATUS_CODES.BAD_REQUEST;
  }

  if (state) {
    const newState = {};
    newState[uc.Entities.Remote.ATTRIBUTES.STATE] = state;
    // const newState = new Map([
    //   [uc.Entities.Remote.ATTRIBUTES.STATE, state]
    // ])
    uc.configuredEntities.updateEntityAttributes(entity.id, newState);
  }

  return uc.STATUS_CODES.OK;
};

// Event listener for connection event
uc.on(uc.EVENTS.CONNECT, async () => {
  // When connected, set device state to CONNECTED
  await uc.setDeviceState(uc.DEVICE_STATES.CONNECTED);
});

uc.on(uc.EVENTS.DISCONNECT, async () => {
  await uc.setDeviceState(uc.DEVICE_STATES.DISCONNECTED);
});

// Create button mappings
const createButtonMappings = () => {
  return [
    uc.ui.createBtnMapping(uc.ui.BUTTONS.HOME, "HOME", "GUIDE"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.CHANNEL_DOWN, "VOLUME_DOWN"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.CHANNEL_UP, "VOLUME_UP"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.DPAD_UP, "CURSOR_UP"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.DPAD_DOWN, "CURSOR_DOWN"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.DPAD_LEFT, "CURSOR_LEFT"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.DPAD_RIGHT, "CURSOR_RIGHT"),
    uc.ui.createBtnMapping(uc.ui.BUTTONS.DPAD_MIDDLE, createSendCmd("CONTEXT_MENU", undefined, undefined, 100)),
    uc.ui.createBtnMapping(
      uc.ui.BUTTONS.BLUE,
      createSequenceCmd(["CURSOR_UP", "CURSOR_RIGHT", "CURSOR_DOWN", "CURSOR_LEFT"], 200)
    ),
    { button: "POWER", short_press: { cmd_id: "remote.toggle" } }
  ];
};

// Create UI pages
const createUi = () => {
  const mainPage = JSON.parse(fs.readFileSync("remote_ui_page.json", "utf-8"));

  const uiPage1 = new uc.ui.UiPage("page1", "Main");
  uiPage1.add(uc.ui.createUiText("Hello remote entity", 0, 0, undefined, new uc.ui.Size(4, 1)));
  uiPage1.add(uc.ui.createUiIcon("uc:home", 0, 2, "HOME"));
  uiPage1.add(uc.ui.createUiIcon("uc:up-arrow-bold", 2, 2, "CURSOR_UP"));
  uiPage1.add(uc.ui.createUiIcon("uc:down-arrow-bold", 2, 4, "CURSOR_DOWN"));
  uiPage1.add(uc.ui.createUiIcon("uc:left-arrow", 1, 3, "CURSOR_LEFT"));
  uiPage1.add(uc.ui.createUiIcon("uc:right-arrow", 3, 3, "CURSOR_RIGHT"));
  uiPage1.add(uc.ui.createUiText("Ok", 2, 3, "CURSOR_ENTER"));

  const uiPage2 = new uc.ui.UiPage("page2", "Page 2");
  uiPage2.add(
    uc.ui.createUiText("Pump up the volume!", 0, 0, createSendCmd("VOLUME_UP", { repeat: 5 }), new uc.ui.Size(4, 2))
  );
  uiPage2.add(
    uc.ui.createUiText(
      "Test sequence",
      0,
      4,
      createSequenceCmd(["CURSOR_UP", "CURSOR_RIGHT", "CURSOR_DOWN", "CURSOR_LEFT"], 200),
      new uc.ui.Size(4, 1)
    )
  );
  uiPage2.add(uc.ui.createUiText("On", 0, 5, "on"));
  uiPage2.add(uc.ui.createUiText("Off", 1, 5, "off"));

  return [mainPage, uiPage1, uiPage2];
};

// -- startup driver

const entity = new uc.Entities.Remote(
  "remote1",
  "Demo remote",
  [uc.Entities.Remote.FEATURES.ON_OFF, uc.Entities.Remote.FEATURES.TOGGLE],
  new Map([[uc.Entities.MediaPlayer.ATTRIBUTES.STATE, uc.Entities.MediaPlayer.STATES.OFF]]),
  supportedCommands,
  createButtonMappings(),
  createUi(),
  "test lab",
  cmdHandler
);

uc.availableEntities.addEntity(entity);

uc.init("remote.json");
