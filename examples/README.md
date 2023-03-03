# Minimal one light integration example

This example creates one light entity and makes it available.
It handles basic commands sent from the `remote-core`.

You can check `minimum-required.js` for the minimum required methods and events that needs to be handled in an integration.

### Configuring

Edit `driver.json` if you'd like to change the port or any other information.

The `icon` needs to be uploaded to the `remote-core` (via the Web Configurator or API) and referenced by its id.

### Running the app

`node light.js`

### Registering the integration

Before the `remote-core` can talk to the integration, it needs to be registered.

You can do it via the REST or WebSocket API, by sending the following requests.
Make sure to use the same information as you've defined in `driver.json`.

Edit the curl commands to add your preferred authentication. You can find the documentation here: [https://github.com/unfoldedcircle/core-simulator](https://github.com/unfoldedcircle/core-simulator)

### Register the driver

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
        "release_date": "2023-03-03",
        "device_discovery": false
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
        "release_date": "2023-03-03",
        "device_discovery": false
    }
}
```

### Create an integration instance

Rest:

```
curl -X 'POST' \
  'http://localhost:8080/api/intg/drivers/uc_node_driver' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "driver_id": "uc_node_driver",
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

### Delete the integration instance

Easiest way to do this is to use the Web Configurator.
