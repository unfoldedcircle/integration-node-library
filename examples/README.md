# Integration Driver Examples

## Minimum required driver framework

The `minimum-required.js` file contains the minimum required methods and events that needs to be handled in an
integration driver.

- The driver can be discovered and registered in the web-configurator. 
- It exposes a media-player entity.
- There are no implemented entity commands, only a stub handler where the commands have to be implemented.


## simulated-light

Simple one light integration example with a driver setup flow.

This example creates one simulated light entity and handles basic commands sent from the `remote-core`.

```shell
cd simulated-light
npm install
node light.js
```

## Driver configuration

Edit `driver.json` if you'd like to change the port or any other information.

- See `driverMetadata` object in the [Integration-API specification](https://github.com/unfoldedcircle/core-api/tree/main/integration-api)
  for all configuration options.
  - ⚠️ This library requires the additional property `port` to configure the WebSocket server port and is not part of
       the `driverMetadata` object. 
- If an `icon` is specified in `driver.json`, it needs to be uploaded to the `remote-core` (via the Web Configurator
  or REST Core-API) and referenced by its id.
- The `driver_url` property is optional and offers different behaviour:
  - if specified and value either starts with `ws://` or `wss://`, the given address is used by the remote to connect
    to the driver.
  - if specified and not starting with a WebSocket schema, the library replaces the URL with the hostname and configured
    port. The resulting URL is used by the remote to connect to the driver.
  - if missing, the remote determines the driver URL by the published mDNS data.
    - If the machine running the integration driver has multiple network interfaces, the first address is used, which
      could be random!
  - While configuring an integration driver, the user can also override the driver address. 
- The `setup_data_schema` property enables the driver setup flow to configure the driver during registration.
  - The first request sent is `setup_driver` containing the provided input values (if there are input fields).  
    This triggers the `uc.EVENTS.SETUP_DRIVER` event in the library which the integration driver has to acknowledge.
  - From there on, the integration driver needs to send `driver_setup_change` messages with the setup status, or user
    input requests. This is handled with calling `uc.driverSetupProgress` and `uc.requestDriverSetupUserConfirmation`.
  - See [simulated-light/light.js](simulated-light/light.js) for an example and the [Integration-API documentation](https://github.com/unfoldedcircle/core-api/tree/main/doc/integration-driver).

## Driver registration

Before the `remote-core` can talk to the integration, it needs to be registered. Either through auto-discovery with the
web-configurator or manually through the Core-API.

### mDNS advertisement & auto-discovery

The integration library advertises the driver over mDNS. See [mDNS advertisement](https://github.com/unfoldedcircle/core-api/blob/main/doc/integration-driver/driver-advertisement.md)
in the Core-API documentation.

- The `driver_id` value in `driver.json` is used as instance name and must be unique.
- Use the web-configurator to discover the driver in "Integration & docks"

### Manual registration with Core-API


You can do it via the REST or WebSocket API, by sending the following requests.
Make sure to use the same information as you've defined in `driver.json`.

Edit the curl commands to add your preferred authentication (basic auth or api key).
You can find the documentation here: [https://github.com/unfoldedcircle/core-simulator](https://github.com/unfoldedcircle/core-simulator)

#### Register the driver

Rest:

```
curl -X 'POST' \
  'http://localhost:8080/api/intg/drivers' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
        "driver_id": "uc_node_driver",
        "name": {
          "en": "My Driver"
        },
        "driver_url": "ws://localhost:9988",
        "version": "1.0.0",
        "enabled": true,
        "icon": "custom:my_driver_icon",
        "description": {
          "en": "Adds support for driver devices."
        },
        "developer": {
          "name": "John Doe",
          "email": "john@doe.com",
          "url": "https://www.unfoldedcircle.com/support"
        },
        "home_page": "https://www.unfoldedcircle.com",
        "release_date": "2023-03-03"
}'
```

WebSocket:

```
{
    "kind": "req",
    "id": 3,
    "msg": "register_integration_driver",
    "msg_data": {
        "driver_id": "uc_node_driver",
        "name": {
          "en": "My Driver"
        },
        "driver_url": "ws://localhost:9988",
        "version": "1.0.0",
        "enabled": true,
        "icon": "custom:my_driver_icon",
        "description": {
          "en": "Adds support for driver devices."
        },
        "developer": {
          "name": "John Doe",
          "email": "john@doe.com",
          "url": "https://www.unfoldedcircle.com/support"
        },
        "home_page": "https://www.unfoldedcircle.com",
        "release_date": "2023-03-03"
    }
}
```

#### Create an integration instance

Rest:

```
curl -X 'POST' \
  'http://localhost:8080/api/intg/drivers/uc_node_driver' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
        "name": {
            "en": "My Integration Instance"
        },
        "enabled": true,
        "icon": "custom:my_driver_icon"
}'
```

WebSocket:

```
{
    "kind": "req",
    "id": 4,
    "msg": "create_integration",
    "msg_data": {
        "driver_id": "uc_node_driver",
        "name": {
            "en": "My Integration Instance"
        },
        "enabled": true,
        "icon": "custom:my_driver_icon"
    }
}
```

### Delete the integration

Easiest way to do this is to use the Web Configurator.

If the integration has been configured, the first delete operation in the "Integrations & dock" view will remove the
integration instance (which provides the available entities), the second delete will also remove the driver
configuration. 
