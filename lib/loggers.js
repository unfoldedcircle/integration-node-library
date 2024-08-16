/**
 * Central log functions.
 *
 * Use [debug](https://www.npmjs.com/package/debug) module for logging.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

const msgTrace = require("debug")("ucapi:msg");
const debug = require("debug")("ucapi:debug");
const info = require("debug")("ucapi:info");
const warn = require("debug")("ucapi:warn");
const error = require("debug")("ucapi:error");

module.exports = {
  msgTrace,
  debug,
  info,
  warn,
  error
};
