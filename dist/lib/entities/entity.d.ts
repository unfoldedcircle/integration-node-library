/**
 * Available entity types.
 */
declare enum TYPES {
    COVER = "cover",
    BUTTON = "button",
    CLIMATE = "climate",
    LIGHT = "light",
    MEDIA_PLAYER = "media_player",
    REMOTE = "remote",
    SENSOR = "sensor",
    SWITCH = "switch"
}
type CommandHandler = (entity: Entity, command: string, params?: Record<string, string | object | unknown>) => Promise<string>;
interface EntityParams {
    features?: string[];
    attributes?: object | Map<string, string | object> | Record<string, object | undefined | string | number | boolean> | null;
    deviceClass?: string;
    options?: Record<string, object | undefined | string | number | boolean> | null;
    area?: string;
    cmdHandler?: CommandHandler | null;
}
declare class Entity {
    id: string;
    name: string | Record<string, string>;
    entity_type: string;
    device_id: string | null;
    features: string[];
    attributes: Record<string, object | string | number | undefined | boolean>;
    device_class?: string;
    options: Record<string, object | undefined | string | number | boolean> | null;
    area?: string;
    private cmdHandler?;
    /**
     * Constructs a new entity.
     *
     * @param id The entity identifier. Must be unique inside the integration driver.
     * @param name The human-readable name of the entity. Either a string or an object containing multiple language strings.
     * @param entityType One of the defined entity types.
     * @param params Entity parameters.
     */
    constructor(id: string, name: string | Map<string, string> | Record<string, string>, entityType: string, { features, attributes, deviceClass, options, area, cmdHandler }?: EntityParams);
    /**
     * Set callback handler for entity command requests.
     * @param cmdHandler Callback handler for entity commands.
     */
    setCmdHandler(cmdHandler: CommandHandler | null): void;
    /**
     * @return true if a callback handler for entity commands has been installed.
     */
    get hasCmdHandler(): boolean;
    /**
     * Execute entity command with the installed command handler.
     *
     * Returns NOT_IMPLEMENTED if no command handler is installed.
     * @param cmdId the command
     * @param params optional command parameters
     * @return command status code to acknowledge to UC Remote
     */
    command(cmdId: string, params?: Record<string, string>): Promise<string>;
}
export default Entity;
export { TYPES, CommandHandler };
