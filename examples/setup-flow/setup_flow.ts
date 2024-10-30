/**
 * Integration setup flow example.
 */

// use package in production
// const uc = require("uc-integration-api");
import uc, { StatusCodes, CommandHandler, DriverSetupRequest, UserDataResponse, SetupAction } from "../../index.js";

/**
 * Dispatch driver setup requests to corresponding handlers.
 *
 * Either start the setup process or handle the provided user input data.
 * @param {uc.setup.SetupDriver} msg the setup driver request object, either DriverSetupRequest,
 *                 UserDataResponse or UserConfirmationResponse
 * @return {Promise<SetupAction>} the setup action on how to continue
 */

const driverSetupHandler = async function (msg: DriverSetupRequest | UserDataResponse): Promise<SetupAction> {
  if (msg instanceof uc.setup.DriverSetupRequest) {
    return await handleDriverSetup(msg);
  }
  if (msg instanceof uc.setup.UserDataResponse) {
    return await handleUserDataResponse(msg);
  }

  // user confirmation not used in our demo setup process
  // if (msg instanceof UserConfirmationResponse) {
  //     return handle_user_confirmation(msg)
  // }

  return new uc.setup.SetupError();
};

/**
 * Start driver setup.
 *
 * Initiated by the UC Remote to set up the driver.
 * @param {uc.setup.DriverSetupRequest} msg value(s) of input fields in the first setup screen.
 * @return {Promise<uc.setup.SetupAction>} the setup action on how to continue
 */
async function handleDriverSetup(msg: DriverSetupRequest) {
  // No support for reconfiguration :-)but
  if (msg.reconfigure) {
    console.log("Ignoring driver reconfiguration request");
  }

  // For our demo we simply clear everything!
  // A real driver might have to handle this differently
  uc.clearAvailableEntities();
  uc.clearConfiguredEntities();

  // check if user selected the expert option in the initial setup screen
  // please note that all values are returned as strings!
  if (!("expert" in msg.setupData) || msg.setupData.expert !== "true") {
    // add a single button as default action
    const button = new uc.entities.Button("button", "Button", { cmdHandler });
    uc.addEntity(button);
    return new uc.setup.SetupComplete();
  }

  // Dropdown selections are usually set dynamically, e.g. with found devices etc.
  const dropdownItems = [
    { id: "red", label: { en: "Red", de: "Rot" } },
    { id: "green", label: { en: "Green", de: "Grün" } },
    { id: "blue", label: { en: "Blue", de: "Blau" } }
  ];

  return new uc.setup.RequestUserInput({ en: "Please choose", de: "Bitte auswählen" }, [
    {
      id: "info",
      label: { en: "Setup flow example", de: "Setup Flow Beispiel" },
      field: {
        label: {
          value: {
            en:
              "This is just some informational text.\n" +
              "Simple **Markdown** is supported!\n" +
              "For example _some italic text_.\n" +
              "#// Or a header text\n~~strikethrough txt~~"
          }
        }
      }
    },
    {
      field: { dropdown: { value: "", items: dropdownItems } },
      id: "step1.choice",
      label: {
        en: "Choose color",
        de: "Wähle Farbe"
      }
    }
  ]);
}

/**
 * Process user data response in a setup process.
 *
 * Driver setup callback to provide requested user data during the setup process.
 * @param {uc.setup.UserDataResponse} msg response data from the requested user data
 * @return {Promise<uc.setup.SetupAction>} the setup action on how to continue: SetupComplete if finished.
 */
async function handleUserDataResponse(msg: UserDataResponse): Promise<SetupAction> {
  // values from all screens are returned: check in reverse order
  if ("step2.count" in msg.inputValues) {
    for (let x = 0; x < parseInt(msg.inputValues["step2.count"]); x++) {
      uc.addEntity(new uc.entities.Button(`button${x}`, `Button ${x + 1}`, { cmdHandler }));
    }

    return new uc.setup.SetupComplete();
  }

  if ("step1.choice" in msg.inputValues) {
    const choice = msg.inputValues["step1.choice"];
    console.log("Chosen color:", choice);
    return new uc.setup.RequestUserInput({ en: "Step 2" }, [
      {
        id: "info",
        label: {
          en: "Selected value from previous step:",
          de: "Selektierter Wert vom vorherigen Schritt:"
        },
        field: {
          label: {
            value: {
              en: choice
            }
          }
        }
      },
      {
        field: { number: { value: 1, min: 1, max: 100, steps: 2 } },
        id: "step2.count",
        label: {
          en: "Button instance count",
          de: "Anzahl Button Instanzen"
        }
      }
    ]);
  }

  console.log("No choice was received");
  return new uc.setup.SetupError();
}

/**
 * Push button command handler.
 *
 * Called by the integration-API if a command is sent to a configured button-entity.
 *
 * @param {uc.Entities.Entity} entity button entity
 * @param {string} cmdId command
 * @param {Object<string, *>} _params optional command parameters (not used for buttons)
 * @return {Promise<string>} status of the command
 */
const cmdHandler: CommandHandler = async function (entity, cmdId, _params): Promise<StatusCodes> {
  console.log("Got %s command request: %s", entity.id, cmdId);

  return uc.StatusCodes.Ok;
};

uc.on(uc.Events.Connect, async () => {
  // When the remote connects, we just set the device state. We are ready all the time!
  await uc.setDeviceState(uc.DeviceStates.Connected);
});

uc.init("setup_flow.json", driverSetupHandler);
