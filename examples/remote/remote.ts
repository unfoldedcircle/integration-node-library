// use package in production
//import * as uc from "uc-integration-api";
import uc from "../../index";

import fs from "fs";
import { createSendCmd, createSequenceCmd } from "../../lib/entities/remote";
import { Entity, Remote } from "../../lib/entities/entities";

import {
  COMMANDS as REMOTECOMMANDS,
  STATES as REMOTESTATES,
  ATTRIBUTES as REMOTEATTRIBUTES,
  FEATURES as REMOTEFEATURES
} from "../../lib/entities/remote";

import { STATUS_CODES } from "http";
import {
  BUTTONS,
  createBtnMapping,
  UiPage,
  createUiText,
  createUiIcon,
  Size,
  DeviceButtonMapping,
  EntityCommand
} from "../../lib/entities/ui";
import { DEVICE_STATES, EVENTS as API_EVENTS } from "../../lib/api_definitions";
import { STATES as MEDIAPLAYERSTATES, ATTRIBUTES as MEDIAPLAYERATTRIBUTES } from "../../lib/entities/media_player";

// Simple commands supported by this example remote entity
const supportedCommands: string[] = [
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

// Command handler interface
interface CmdParams {
  command?: string;
  repeat?: number;
  delay?: number;
  hold?: number;
  sequence?: string[];
}

/**
 * Remote-entity command handler.
 *
 * Called by the integration-API if a command is sent to a configured entity.
 *
 * @param {Entity} entity remote entity
 * @param {string} cmdId command
 * @param {?Object<string, *>} params optional command parameters
 * @return {Promise<string>} status of the command
 */
const cmdHandler = async (entity: Entity, cmdId: string, params: CmdParams = {}): Promise<string> => {
  console.log(`Got ${entity.id} command request: ${cmdId}`);

  let state: string | null = null;
  switch (cmdId) {
    case REMOTECOMMANDS.ON:
      state = REMOTESTATES.ON;
      break;
    case REMOTECOMMANDS.OFF:
      state = REMOTESTATES.OFF;
      break;
    case REMOTECOMMANDS.TOGGLE:
      state = entity.attributes[REMOTEATTRIBUTES.STATE] === REMOTESTATES.OFF ? REMOTESTATES.ON : REMOTESTATES.OFF;
      break;
    case REMOTECOMMANDS.SEND_CMD: {
      const command = params.command ?? "";
      if (!supportedCommands.includes(command)) {
        console.error(`Unknown command: ${command}`);
        return STATUS_CODES.BAD_REQUEST ?? "BAD_REQUEST";
      }
      const repeat = params.repeat || 1;
      const delay = params.delay || 0;
      const hold = params.hold || 0;
      console.log(`Command: ${command} (repeat=${repeat}, delay=${delay}, hold=${hold})`);
      break;
    }
    case REMOTECOMMANDS.SEND_CMD_SEQUENCE: {
      const sequence = params.sequence;
      const seqRepeat = params.repeat || 1;
      const seqDelay = params.delay || 0;
      console.log(`Command sequence: ${sequence} (repeat=${seqRepeat}, delay=${seqDelay})`);
      break;
    }
    default:
      console.error(`Unsupported command: ${cmdId}`);
      return STATUS_CODES.BAD_REQUEST ?? "BAD_REQUEST";
  }

  if (state) {
    const newState: Record<string, string> = {
      [REMOTEATTRIBUTES.STATE]: state
    };
    uc.getConfiguredEntities().updateEntityAttributes(entity.id, newState);
  }

  return STATUS_CODES.OK ?? "OK";
};

// Event listener for connection event
uc.on(API_EVENTS.CONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.CONNECTED);
});

uc.on(API_EVENTS.DISCONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.DISCONNECTED);
});

// Create button mappings
const createButtonMappings = (): Array<DeviceButtonMapping> => {
  return [
    createBtnMapping(BUTTONS.HOME, "HOME", "GUIDE"),
    createBtnMapping(BUTTONS.CHANNEL_DOWN, "VOLUME_DOWN"),
    createBtnMapping(BUTTONS.CHANNEL_UP, "VOLUME_UP"),
    createBtnMapping(BUTTONS.DPAD_UP, "CURSOR_UP"),
    createBtnMapping(BUTTONS.DPAD_DOWN, "CURSOR_DOWN"),
    createBtnMapping(BUTTONS.DPAD_LEFT, "CURSOR_LEFT"),
    createBtnMapping(BUTTONS.DPAD_RIGHT, "CURSOR_RIGHT"),
    createBtnMapping(BUTTONS.DPAD_MIDDLE, createSendCmd("CONTEXT_MENU", { hold: 100 })),
    createBtnMapping(
      BUTTONS.BLUE,
      createSequenceCmd(["CURSOR_UP", "CURSOR_RIGHT", "CURSOR_DOWN", "CURSOR_LEFT"], { delay: 200 })
    ),
    createBtnMapping(BUTTONS.POWER, new EntityCommand("remote.toggle"))
  ];
};

// Create UI pages
const createUi = (): Array<UiPage> => {
  const mainPage = JSON.parse(fs.readFileSync("remote_ui_page.json", "utf-8"));

  const uiPage1 = new UiPage("page1", "Main");
  uiPage1.add(createUiText("Hello remote entity", 0, 0, undefined, new Size(4, 1)));
  uiPage1.add(createUiIcon("uc:home", 0, 2, "HOME"));
  uiPage1.add(createUiIcon("uc:up-arrow-bold", 2, 2, "CURSOR_UP"));
  uiPage1.add(createUiIcon("uc:down-arrow-bold", 2, 4, "CURSOR_DOWN"));
  uiPage1.add(createUiIcon("uc:left-arrow", 1, 3, "CURSOR_LEFT"));
  uiPage1.add(createUiIcon("uc:right-arrow", 3, 3, "CURSOR_RIGHT"));
  uiPage1.add(createUiText("Ok", 2, 3, "CURSOR_ENTER"));

  const uiPage2 = new UiPage("page2", "Page 2");
  uiPage2.add(createUiText("Pump up the volume!", 0, 0, createSendCmd("VOLUME_UP", { repeat: 5 }), new Size(4, 2)));
  uiPage2.add(
    createUiText(
      "Test sequence",
      0,
      4,
      createSequenceCmd(["CURSOR_UP", "CURSOR_RIGHT", "CURSOR_DOWN", "CURSOR_LEFT"], { delay: 200 }),
      new Size(4, 1)
    )
  );
  uiPage2.add(createUiText("On", 0, 5, "on"));
  uiPage2.add(createUiText("Off", 1, 5, "off"));

  return [mainPage, uiPage1, uiPage2];
};

// -- startup driver

const attributes: Partial<Record<REMOTEATTRIBUTES, REMOTESTATES>> = {
  [REMOTEATTRIBUTES.STATE]: REMOTESTATES.OFF
};

const entity = new Remote("remote1", "Demo remote", {
  features: [REMOTEFEATURES.ON_OFF, REMOTEFEATURES.TOGGLE],
  attributes,
  simpleCommands: supportedCommands,
  buttonMapping: createButtonMappings(),
  uiPages: createUi(),
  cmdHandler
});

uc.addEntity(entity);
uc.init("remote.json");
