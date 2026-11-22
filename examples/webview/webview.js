// use integration library in a client project:
// import * as uc from "@unfoldedcircle/integration-api";
import * as uc from "../../dist/cjs/index.js";
import {
  WebviewAttributes,
  WebviewAuthType,
  WebviewButton,
  WebviewButtonFunction,
  WebviewButtonKey,
  WebviewOptions,
  WebviewStates,
  WebviewUserAgent
} from "../../dist/cjs/index.js";

const driver = new uc.IntegrationAPI();

driver.init("webview.json");

// 1. Simple webview entity with URL only
const simpleWebview = new uc.Webview("simple_webview", "Unfolded Circle", {
  options: {
    [WebviewOptions.Url]: "https://www.unfoldedcircle.com"
  }
});

driver.addAvailableEntity(simpleWebview);

// 2. Complex webview entity with login credentials and additional options
function createDashboardWebview(password) {
  return new uc.Webview(
    "dashboard_webview",
    {
      en: "Energy Dashboard",
      de: "Energie-Dashboard"
    },
    {
      icon: "uc:web",
      description: {
        en: "Local home energy monitoring dashboard",
        de: "Lokales Energie-Dashboard"
      },
      area: "Living Room",
      attributes: {
        [WebviewAttributes.State]: WebviewStates.On
      },
      options: {
        [WebviewOptions.Url]: "https://dashboard.home.arpa/energy?kiosk=1",
        [WebviewOptions.Auth]: {
          type: WebviewAuthType.Basic,
          username: "remote",
          password
        },
        [WebviewOptions.Tls]: {
          allow_invalid_certificate: true
        },
        [WebviewOptions.Cookies]: [
          {
            name: "theme",
            value: "dark",
            http_only: false
          }
        ],
        [WebviewOptions.UserAgent]: WebviewUserAgent.Desktop,
        [WebviewOptions.Zoom]: 75,
        [WebviewOptions.BackgroundColor]: "#121212",
        [WebviewOptions.ShowNavigation]: true,
        [WebviewOptions.ReloadInterval]: 60,
        [WebviewOptions.Buttons]: {
          [WebviewButton.DpadUp]: { action: "function", function: WebviewButtonFunction.ScrollUp },
          [WebviewButton.DpadDown]: { action: "function", function: WebviewButtonFunction.ScrollDown },
          [WebviewButton.VolumeUp]: { action: "pass" },
          [WebviewButton.VolumeDown]: { action: "pass" },
          [WebviewButton.ChannelUp]: { action: "key", key: WebviewButtonKey.ChannelUp }
        },
        [WebviewOptions.DeviceApi]: true
      }
    }
  );
}

driver.addAvailableEntity(createDashboardWebview("initial-secret-password"));

driver.on(uc.Events.Connect, async () => {
  await driver.setDeviceState(uc.DeviceStates.Connected);

  // Simulate rotating / refreshing login credentials after connecting to the Remote.
  // `updateAvailableEntity` updates the entity definition and broadcasts an `entity_available`
  // event to connected Remotes supporting Integration-API >= 0.18.0.
  const rotatedPassword = `rotated-secret-${Date.now()}`;
  const updatedDashboard = createDashboardWebview(rotatedPassword);
  driver.updateAvailableEntity(updatedDashboard);
  console.log("Updated dashboard webview credentials via entity_available event");
});

driver.on(uc.Events.Disconnect, async () => {
  await driver.setDeviceState(uc.DeviceStates.Disconnected);
});

driver.on(uc.Events.SubscribeEntities, async (entityIds) => {
  entityIds.forEach((entityId) => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

driver.on(uc.Events.UnsubscribeEntities, async (entityIds) => {
  entityIds.forEach((entityId) => {
    console.log(`Unsubscribed entity: ${entityId}`);
  });
});

console.log("Available entities:", driver.getAvailableEntities().getIds());
