import test from "ava";
import { IntegrationAPI } from "../index.js";
import * as api from "../lib/api_definitions.js";

// Helper function to access the private method for testing as requested
const sanitize_json_message = (apiInstance: IntegrationAPI, msg: any, msgType?: api.MsgEvents) =>
  (apiInstance as any).sanitize_json_message(msg, msgType);

test("sanitize_json_message - GenerateOauth2AuthUrl redaction", (t) => {
  const msgType = api.MsgEvents.GenerateOauth2AuthUrl;
  const integrationApi = new IntegrationAPI();
  const msg = {
    msg: msgType,
    msg_data: {
      client_data: {
        foo: "bar",
        state: "setup"
      }
    }
  };
  const sanitized: any = sanitize_json_message(integrationApi, msg);
  t.is(sanitized.msg_data.client_data, "***REDACTED***", "client_data should be redacted");

  const redacted: any = sanitize_json_message(integrationApi, msg, msgType);
  t.deepEqual(redacted, { msg: msgType }, "client_data should be redacted");
});

test("sanitize_json_message - Oauth2AuthUrl redaction", (t) => {
  const msgType = api.MsgEvents.Oauth2AuthUrl;
  const integrationApi = new IntegrationAPI();
  const msg = {
    msg: msgType,
    msg_data: {
      auth_url: "https://example.com/oauth?code=xyz&token=abc"
    }
  };
  const sanitized: any = sanitize_json_message(integrationApi, msg);
  t.is(sanitized.msg_data.auth_url, "***REDACTED***", "auth_url should be redacted");

  const redacted: any = sanitize_json_message(integrationApi, msg, msgType);
  t.deepEqual(redacted, { msg: msgType }, "client_data should be redacted");
});

test("sanitize_json_message - Oauth2Authorization redaction", (t) => {
  const msgType = api.MsgEvents.Oauth2Authorization;
  const integrationApi = new IntegrationAPI();
  const msg = {
    msg: msgType,
    msg_data: {
      client_data: {
        foo: "bar",
        state: "setup"
      },
      token: "secret123456"
    }
  };
  const sanitized: any = sanitize_json_message(integrationApi, msg);
  t.is(sanitized.msg_data.client_data, "***REDACTED***", "client_data should be redacted");
  t.is(sanitized.msg_data.token, "***REDACTED***", "token should be redacted");

  const redacted: any = sanitize_json_message(integrationApi, msg, msgType);
  t.deepEqual(redacted, { msg: msgType }, "client_data should be redacted");
});

test("sanitize_json_message - Oauth2Token and Oauth2Refreshed redaction", (t) => {
  const integrationApi = new IntegrationAPI();

  const messages = [api.MsgEvents.Oauth2Token, api.MsgEvents.Oauth2Refreshed];

  messages.forEach((msgType) => {
    const msg = {
      msg: msgType,
      msg_data: {
        token_id: "test-client",
        token: "secret-data"
      }
    };
    const sanitized: any = sanitize_json_message(integrationApi, msg);
    t.is(sanitized.msg_data.token_id, "***REDACTED***", "token_id should be redacted");
    t.is(sanitized.msg_data.token, "***REDACTED***", "token should be redacted");

    const redacted: any = sanitize_json_message(integrationApi, msg, msgType);
    t.deepEqual(redacted, { msg: msgType }, `msg_data for ${msgType} should be fully redacted`);
  });
});

test("sanitize_json_message - Oauth2Token and Oauth2Refreshed redaction with error response", (t) => {
  const integrationApi = new IntegrationAPI();

  const messages = [api.MsgEvents.Oauth2Token, api.MsgEvents.Oauth2Refreshed];

  messages.forEach((msgType) => {
    const msg = {
      msg: msgType,
      msg_data: {
        token_id: "test-client",
        token: "secret-data",
        error_code: "invalid_request",
        error_description: "Invalid request"
      }
    };
    const redacted: any = sanitize_json_message(integrationApi, msg, msgType);
    t.deepEqual(
      redacted,
      { msg: msgType, msg_data: { error_code: "invalid_request", error_description: "Invalid request" } },
      `msg_data for ${msgType} should be fully redacted`
    );
  });
});

test("sanitize_json_message - generic sensitive keys redaction", (t) => {
  const integrationApi = new IntegrationAPI();
  const sensitiveKeys = [
    "token",
    "token_id",
    "access_token",
    "refresh_token",
    "id_token",
    "authorization_code",
    "client_secret",
    "secret"
  ];

  sensitiveKeys.forEach((key) => {
    const msg = {
      [key]: "sensitive-value",
      other: "public-value"
    };
    const sanitized: any = sanitize_json_message(integrationApi, msg);
    t.is(sanitized[key], "***REDACTED***", `${key} should be redacted`);
    t.is(sanitized.other, "public-value", "public fields should remain intact");
  });
});

test("sanitize_json_message - recursive redaction", (t) => {
  const integrationApi = new IntegrationAPI();
  const msg = {
    level1: {
      token: "secret1",
      level2: {
        secret: "secret2",
        public: "data"
      }
    },
    array: [{ refresh_token: "secret3" }, "plain-string"]
  };
  const sanitized: any = sanitize_json_message(integrationApi, msg);
  t.is(sanitized.level1.token, "***REDACTED***");
  t.is(sanitized.level1.level2.secret, "***REDACTED***");
  t.is(sanitized.level1.level2.public, "data");
  t.is(sanitized.array[0].refresh_token, "***REDACTED***");
  t.is(sanitized.array[1], "plain-string");
});

test("sanitize_json_message - filterBase64Images integration", (t) => {
  const integrationApi = new IntegrationAPI();
  const msg = {
    msg: "entity_change",
    msg_data: {
      attributes: {
        media_image_url:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
      }
    }
  };
  const sanitized: any = sanitize_json_message(integrationApi, msg);
  t.is(sanitized.msg_data.attributes.media_image_url, "data:...", "base64 image should be filtered");
});

test("sanitize_json_message - edge cases", (t) => {
  const integrationApi = new IntegrationAPI();

  t.is(sanitize_json_message(integrationApi, null), null, "null input returns null");
  t.is(sanitize_json_message(integrationApi, undefined), undefined, "undefined input returns undefined");
  t.is(sanitize_json_message(integrationApi, "not-an-object"), "not-an-object", "non-object returns itself");
  t.deepEqual(sanitize_json_message(integrationApi, {}), {}, "empty object remains empty");

  const arrayInput = ["token", { secret: "xyz" }];
  const sanitizedArray: any = sanitize_json_message(integrationApi, arrayInput);
  t.is(sanitizedArray[0], "token");
  t.is(sanitizedArray[1].secret, "***REDACTED***");
});

test("sanitize_json_message - webview secrets redaction", (t) => {
  const integrationApi = new IntegrationAPI();
  const msg = {
    kind: "event",
    msg: api.MsgEvents.EntityAvailable,
    msg_data: {
      entity_id: "dashboard",
      entity_type: "webview",
      options: {
        url: "https://dashboard.example.com",
        auth: {
          type: "header",
          username: "alice",
          password: "my-password",
          token: "my-bearer-token",
          header_name: "X-API-Key",
          header_value: "super-secret-api-key"
        },
        cookies: [
          { name: "session", value: "secret-cookie-value", domain: "dashboard.example.com", http_only: true },
          { name: "theme", value: "dark" }
        ]
      },
      attributes: {
        value: 42
      }
    }
  };

  const sanitized: any = sanitize_json_message(integrationApi, msg, api.MsgEvents.EntityAvailable);
  t.is(sanitized.msg_data.options.url, "https://dashboard.example.com");
  t.is(sanitized.msg_data.options.auth.username, "alice");
  t.is(sanitized.msg_data.options.auth.header_name, "X-API-Key");
  t.is(sanitized.msg_data.options.auth.password, "***REDACTED***");
  t.is(sanitized.msg_data.options.auth.token, "***REDACTED***");
  t.is(sanitized.msg_data.options.auth.header_value, "***REDACTED***");
  t.is(sanitized.msg_data.options.cookies[0].name, "session");
  t.is(sanitized.msg_data.options.cookies[0].value, "***REDACTED***");
  t.is(sanitized.msg_data.options.cookies[0].domain, "dashboard.example.com");
  t.is(sanitized.msg_data.options.cookies[1].name, "theme");
  t.is(sanitized.msg_data.options.cookies[1].value, "***REDACTED***");
  // Non-cookie `value` fields (like sensor/number attributes) must not be redacted
  t.is(sanitized.msg_data.attributes.value, 42);
});
