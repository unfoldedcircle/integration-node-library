import test from "ava";
import WebSocket from "ws";
import { IntegrationAPI, Button, Number as NumberEntity, Events, Messages, MsgEvents } from "../index.js";
import { EntityType } from "../lib/entities/entity.js";
import { Entities } from "../lib/entities/entities.js";
import {
  Webview,
  WebviewStates,
  WebviewAttributes,
  WebviewCommands,
  WebviewOptions,
  WebviewAuthType,
  WebviewUserAgent,
  WebviewButton,
  WEBVIEW_FIXED_BUTTONS,
  WebviewButtonFunction,
  WebviewButtonKey
} from "../lib/entities/webview.js";

test("Webview constructor without parameter object creates default Webview class", (t) => {
  const entity = new Webview("test", "Test Webview");

  t.is(entity.id, "test");
  t.deepEqual(entity.name, { en: "Test Webview" });
  t.is(entity.entity_type, EntityType.Webview);
  t.is(entity.icon, undefined);
  t.is(entity.description, undefined);
  t.is(entity.device_id, undefined);
  t.deepEqual(entity.features, []);
  t.deepEqual(entity.attributes, { [WebviewAttributes.State]: WebviewStates.Unknown });
  t.is(entity.device_class, undefined);
  t.is(entity.options, undefined);
  t.is(entity.area, undefined);
  t.is(entity.hasCmdHandler, false);
});

test("Webview constructor with simple URL option", (t) => {
  const entity = new Webview("simple", "Simple Page", {
    options: {
      [WebviewOptions.Url]: "https://www.unfoldedcircle.com"
    }
  });

  t.is(entity.id, "simple");
  t.deepEqual(entity.name, { en: "Simple Page" });
  t.is(entity.entity_type, EntityType.Webview);
  t.deepEqual(entity.options, { url: "https://www.unfoldedcircle.com" });
});

test("Webview constructor with full parameter object", (t) => {
  const entity = new Webview(
    "dashboard-energy",
    { en: "Energy dashboard", de: "Energie-Dashboard" },
    {
      icon: "uc:web",
      description: { en: "Energy monitoring", de: "Energieüberwachung" },
      area: "Living Room",
      attributes: {
        [WebviewAttributes.State]: WebviewStates.On
      },
      options: {
        url: "https://dashboard.example.com/energy?kiosk=1",
        auth: {
          type: WebviewAuthType.Bearer,
          token: "eyJhbGciOiJIUzI1NiJ9.example.token"
        },
        tls: {
          certificate_sha256:
            "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
        },
        cookies: [
          {
            name: "layout",
            value: "compact",
            domain: "dashboard.example.com",
            path: "/",
            secure: true,
            http_only: true,
            expires: "2027-01-01T00:00:00Z"
          }
        ],
        user_agent: WebviewUserAgent.Desktop,
        zoom: 70,
        background_color: "#112233",
        show_navigation: true,
        reload_interval: 60,
        buttons: {
          [WebviewButton.DpadUp]: { action: "function", function: WebviewButtonFunction.ScrollUp },
          [WebviewButton.VolumeUp]: { action: "pass" },
          [WebviewButton.ChannelUp]: { action: "key", key: WebviewButtonKey.ChannelUp },
          [WebviewButton.Red]: { action: "key", key: WebviewButtonKey.ColorF0Red }
        },
        device_api: true
      }
    }
  );

  t.is(entity.id, "dashboard-energy");
  t.deepEqual(entity.name, { en: "Energy dashboard", de: "Energie-Dashboard" });
  t.is(entity.entity_type, EntityType.Webview);
  t.is(entity.icon, "uc:web");
  t.deepEqual(entity.description, { en: "Energy monitoring", de: "Energieüberwachung" });
  t.is(entity.area, "Living Room");
  t.deepEqual(entity.attributes, { state: "ON" });
  t.deepEqual(entity.options, {
    url: "https://dashboard.example.com/energy?kiosk=1",
    auth: {
      type: "bearer",
      token: "eyJhbGciOiJIUzI1NiJ9.example.token"
    },
    tls: {
      certificate_sha256:
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    },
    cookies: [
      {
        name: "layout",
        value: "compact",
        domain: "dashboard.example.com",
        path: "/",
        secure: true,
        http_only: true,
        expires: "2027-01-01T00:00:00Z"
      }
    ],
    user_agent: "desktop",
    zoom: 70,
    background_color: "#112233",
    show_navigation: true,
    reload_interval: 60,
    buttons: {
      DPAD_UP: { action: "function", function: "scroll_up" },
      VOLUME_UP: { action: "pass" },
      CHANNEL_UP: { action: "key", key: "ChannelUp" },
      RED: { action: "key", key: "ColorF0Red" }
    },
    device_api: true
  });
});

test("Webview enums contain expected values", (t) => {
  t.is(WebviewStates.Unavailable as string, "UNAVAILABLE");
  t.is(WebviewStates.Unknown as string, "UNKNOWN");
  t.is(WebviewStates.On as string, "ON");

  t.is(WebviewAttributes.State as string, "state");

  t.is(WebviewCommands.Open as string, "open");
  t.is(WebviewCommands.Reload as string, "reload");
  t.is(WebviewCommands.ClearCache as string, "clear_cache");
  t.is(WebviewCommands.ClearData as string, "clear_data");

  t.deepEqual(Object.values(WebviewOptions), [
    "url",
    "auth",
    "tls",
    "cookies",
    "user_agent",
    "zoom",
    "background_color",
    "show_navigation",
    "reload_interval",
    "buttons",
    "device_api"
  ]);

  t.is(WebviewAuthType.None as string, "none");
  t.is(WebviewAuthType.Basic as string, "basic");
  t.is(WebviewAuthType.Bearer as string, "bearer");
  t.is(WebviewAuthType.Header as string, "header");

  t.is(WebviewUserAgent.Default as string, "default");
  t.is(WebviewUserAgent.Mobile as string, "mobile");
  t.is(WebviewUserAgent.Desktop as string, "desktop");

  t.deepEqual([...WEBVIEW_FIXED_BUTTONS], ["HOME", "POWER", "VOICE"]);
  t.is(WebviewButton.DpadMiddle as string, "DPAD_MIDDLE");
  t.is(WebviewButtonFunction.BackOrClose as string, "back_or_close");
  t.is(WebviewButtonKey.ColorF0Red as string, "ColorF0Red");
});

test("Entities pool lifecycle events respect notify option", (t) => {
  const pool = new Entities("available");
  const availableEvents: string[] = [];
  const removedEvents: string[] = [];

  pool.on(Events.EntityAvailable, (entity) => availableEvents.push(entity.id));
  pool.on(Events.EntityRemoved, (entity) => removedEvents.push(entity.id));

  const wv1 = new Webview("wv1", "Webview 1", { options: { url: "https://example.com/1" } });
  const wv2 = new Webview("wv2", "Webview 2", { options: { url: "https://example.com/2" } });

  // Default addAvailableEntity does not notify
  t.true(pool.addAvailableEntity(wv1));
  t.deepEqual(availableEvents, []);

  // Duplicate add returns false and does not notify
  t.false(pool.addAvailableEntity(wv1, { notify: true }));
  t.deepEqual(availableEvents, []);

  // Opt-in notify on addAvailableEntity
  t.true(pool.addAvailableEntity(wv2, { notify: true }));
  t.deepEqual(availableEvents, ["wv2"]);

  // updateEntity notifies by default
  const wv1Updated = new Webview("wv1", "Webview 1 Updated", { options: { url: "https://example.com/1-new" } });
  t.true(pool.updateEntity(wv1Updated));
  t.deepEqual(availableEvents, ["wv2", "wv1"]);
  t.deepEqual(pool.getEntity("wv1")?.options, { url: "https://example.com/1-new" });

  // updateEntity with notify: false suppresses event
  const wv1Silent = new Webview("wv1", "Webview 1 Silent", { options: { url: "https://example.com/1-silent" } });
  t.true(pool.updateEntity(wv1Silent, { notify: false }));
  t.deepEqual(availableEvents, ["wv2", "wv1"]);

  // updateEntity on missing entity returns false
  t.false(pool.updateEntity(new Webview("missing", "Missing", { options: { url: "https://example.com" } })));

  // removeEntity does not notify by default
  t.true(pool.removeEntity("wv1"));
  t.deepEqual(removedEvents, []);

  // removeEntity with notify: true emits event
  t.true(pool.removeEntity("wv2", { notify: true }));
  t.deepEqual(removedEvents, ["wv2"]);
});

/**
 * Helper to create a test IntegrationAPI server on a given port with mDNS disabled.
 */
function createTestDriver(port: number): IntegrationAPI {
  process.env.UC_DISABLE_MDNS_PUBLISH = "true";
  process.env.UC_INTEGRATION_INTERFACE = "127.0.0.1";
  const driver = new IntegrationAPI();
  driver.init({
    driver_id: `test_webview_driver_${port}`,
    version: "1.0.0",
    name: { en: "Test Webview Driver" },
    port
  });
  return driver;
}

/**
 * Helper to connect a mock Remote WebSocket client that automatically answers
 * `get_supported_entity_types` and `get_version` requests.
 */
function connectMockRemote(
  port: number,
  supportedEntityTypes: string[],
  supportedTypesDelayMs = 0
): Promise<{
  ws: WebSocket;
  messages: Record<string, unknown>[];
  waitForMsg: (msg: string) => Promise<Record<string, unknown>>;
}> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    const messages: Record<string, unknown>[] = [];
    const waiters: Array<{ msg: string; resolve: (data: Record<string, unknown>) => void }> = [];

    const waitForMsg = (msg: string): Promise<Record<string, unknown>> => {
      const existingIdx = messages.findIndex((m) => m.msg === msg);
      if (existingIdx !== -1) {
        const [found] = messages.splice(existingIdx, 1);
        return Promise.resolve(found);
      }
      return new Promise((resolve) => {
        waiters.push({ msg, resolve });
      });
    };

    ws.on("message", (raw) => {
      const parsed = JSON.parse(raw.toString()) as Record<string, unknown>;

      // Auto-respond to Remote metadata requests from driver
      if (parsed.kind === "req" && parsed.msg === Messages.GetSupportedEntityTypes) {
        const sendResp = () => {
          ws.send(
            JSON.stringify({
              kind: "resp",
              req_id: parsed.id,
              code: 200,
              msg: MsgEvents.SupportedEntityTypes,
              msg_data: supportedEntityTypes
            })
          );
        };
        if (supportedTypesDelayMs > 0) {
          setTimeout(sendResp, supportedTypesDelayMs);
        } else {
          sendResp();
        }
        return;
      }

      if (parsed.kind === "req" && parsed.msg === Messages.GetVersion) {
        ws.send(
          JSON.stringify({
            kind: "resp",
            req_id: parsed.id,
            code: 200,
            msg: MsgEvents.Version,
            msg_data: {
              model: "UCR3",
              api: "0.58.0",
              core: "2.14.0"
            }
          })
        );
        return;
      }

      const waiterIdx = waiters.findIndex((w) => w.msg === parsed.msg);
      if (waiterIdx !== -1) {
        const [waiter] = waiters.splice(waiterIdx, 1);
        waiter.resolve(parsed);
      } else {
        messages.push(parsed);
      }
    });

    ws.on("open", () => resolve({ ws, messages, waitForMsg }));
    ws.on("error", reject);
  });
}

test.serial(
  "IntegrationAPI sends webview entities and entity_available/entity_removed to supported Remote",
  async (t) => {
    const port = 19186;
    const driver = createTestDriver(port);

    const webview = new Webview("dash", "Dashboard", {
      options: {
        url: "https://dashboard.example.com",
        auth: { type: WebviewAuthType.Bearer, token: "initial-token" }
      }
    });
    driver.addAvailableEntity(webview);

    const { ws, waitForMsg } = await connectMockRemote(port, ["button", "light", "webview"]);

    try {
      // Wait for authentication response
      const auth = await waitForMsg(Messages.Authentication);
      t.is(auth.code, 200);

      // Request available_entities -> should include webview
      ws.send(JSON.stringify({ kind: "req", id: 10, msg: Messages.GetAvailableEntities }));
      const availResp = await waitForMsg(MsgEvents.AvailableEntities);
      const availList = (availResp.msg_data as { available_entities: Record<string, unknown>[] }).available_entities;
      t.is(availList.length, 1);
      t.is(availList[0].entity_id, "dash");
      t.is(availList[0].entity_type, EntityType.Webview);

      // Subscribe to dash so it's also in configured entities
      ws.send(
        JSON.stringify({ kind: "req", id: 11, msg: Messages.SubscribeEvents, msg_data: { entity_ids: ["dash"] } })
      );
      await waitForMsg("result");
      t.true(driver.getConfiguredEntities().contains("dash"));

      // Update webview credentials -> emits entity_available & syncs configured entity
      const updatedWebview = new Webview("dash", "Dashboard", {
        options: {
          url: "https://dashboard.example.com",
          auth: { type: WebviewAuthType.Bearer, token: "rotated-token" }
        }
      });
      const availEventPromise = waitForMsg(MsgEvents.EntityAvailable);
      t.true(driver.updateAvailableEntity(updatedWebview));

      const availEvent = await availEventPromise;
      t.is(availEvent.kind, "event");
      t.is(availEvent.cat, "ENTITY");
      t.is((availEvent.msg_data as Record<string, unknown>).entity_id, "dash");
      t.deepEqual((availEvent.msg_data as Record<string, unknown>).options, {
        url: "https://dashboard.example.com",
        auth: { type: "bearer", token: "rotated-token" }
      });
      // Configured entity should also be updated
      t.deepEqual(driver.getConfiguredEntities().getEntity("dash")?.options, {
        url: "https://dashboard.example.com",
        auth: { type: "bearer", token: "rotated-token" }
      });

      // Remove entity -> emits entity_removed
      const removedEventPromise = waitForMsg(MsgEvents.EntityRemoved);
      t.true(driver.removeAvailableEntity("dash"));

      const removedEvent = await removedEventPromise;
      t.is(removedEvent.kind, "event");
      t.is(removedEvent.cat, "ENTITY");
      t.deepEqual(removedEvent.msg_data, {
        entity_id: "dash",
        entity_type: "webview"
      });

      // Query Remote version & supported entity types
      const version = await driver.getRemoteVersion();
      t.is(version.model, "UCR3");
      t.is(version.api, "0.58.0");

      const supportedTypes = await driver.getSupportedEntityTypes();
      t.deepEqual(supportedTypes, ["button", "light", "webview"]);
    } finally {
      ws.close();
      await driver.close();
    }
  }
);

test.serial("IntegrationAPI omits webview entities and skips lifecycle events for older Remote", async (t) => {
  const port = 19187;
  const driver = createTestDriver(port);

  driver.addAvailableEntity(new Button("btn1", "Button 1"));
  driver.addAvailableEntity(new Webview("dash", "Dashboard", { options: { url: "https://dashboard.example.com" } }));

  // Older Remote without `webview` in supported_entity_types
  const { ws, messages, waitForMsg } = await connectMockRemote(port, ["button", "light"]);

  try {
    await waitForMsg(Messages.Authentication);

    // Request available_entities -> should only contain button, omitting webview
    ws.send(JSON.stringify({ kind: "req", id: 20, msg: Messages.GetAvailableEntities }));
    const availResp = await waitForMsg(MsgEvents.AvailableEntities);
    const availList = (availResp.msg_data as { available_entities: Record<string, unknown>[] }).available_entities;
    t.is(availList.length, 1);
    t.is(availList[0].entity_id, "btn1");
    t.is(availList[0].entity_type, EntityType.Button);

    // Updating / removing should NOT send entity_available or entity_removed to older Remote
    t.true(
      driver.updateAvailableEntity(
        new Webview("dash", "Dashboard", { options: { url: "https://dashboard.example.com/v2" } })
      )
    );
    t.true(driver.removeAvailableEntity("dash"));

    // Send a round-trip request to flush any pending messages on the socket
    ws.send(JSON.stringify({ kind: "req", id: 21, msg: Messages.GetDeviceState }));
    await waitForMsg(MsgEvents.DeviceState);

    const lifecycleMsgs = messages.filter(
      (m) => m.msg === MsgEvents.EntityAvailable || m.msg === MsgEvents.EntityRemoved
    );
    t.deepEqual(lifecycleMsgs, []);
  } finally {
    ws.close();
    await driver.close();
  }
});

test.serial(
  "IntegrationAPI always waits for supported_entity_types and filters unsupported non-webview entities",
  async (t) => {
    const port = 19188;
    const driver = createTestDriver(port);

    // No webview entities — only button and number
    driver.addAvailableEntity(new Button("btn1", "Button 1"));
    driver.addAvailableEntity(new NumberEntity("num1", "Number 1"));

    // Delay the supported_entity_types response so get_available_entities arrives while it is still in-flight
    const { ws, waitForMsg } = await connectMockRemote(port, ["button", "light"], 50);

    try {
      await waitForMsg(Messages.Authentication);

      // Request available_entities immediately -> should still wait for supported_entity_types and omit number
      ws.send(JSON.stringify({ kind: "req", id: 30, msg: Messages.GetAvailableEntities }));
      const availResp = await waitForMsg(MsgEvents.AvailableEntities);
      const availList = (availResp.msg_data as { available_entities: Record<string, unknown>[] }).available_entities;
      t.is(availList.length, 1);
      t.is(availList[0].entity_id, "btn1");
      t.is(availList[0].entity_type, EntityType.Button);
    } finally {
      ws.close();
      await driver.close();
    }
  }
);
