/**
 * Central log functions.
 *
 * Use [debug](https://www.npmjs.com/package/debug) module for logging.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */
import debugModule from "debug";
declare const log: {
    msgTrace: debugModule.Debugger;
    debug: debugModule.Debugger;
    info: debugModule.Debugger;
    warn: debugModule.Debugger;
    error: debugModule.Debugger;
};
export default log;
