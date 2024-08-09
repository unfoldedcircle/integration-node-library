/**
 * Utility functions.
 *
 * @copyright (c) 2024 by Unfolded Circle ApS.
 * @license Apache License 2.0, see LICENSE for more details.
 */

"use strict";

/**
 * Convert an input text to a language object.
 *
 * An input text is either a simple string, which is mapped to the `en` language key, a Map containing language keys and
 * text values, or an Object with language key fields and text values.s
 * @param {string | Map<string, string> | Object<string, string> } text
 * @return {{[p: string]: string}|null}
 */
function toLanguageObject(text) {
  if (text) {
    if (typeof text === "string" || text instanceof String) {
      return { en: text };
    }
    if (text instanceof Map) {
      return Object.fromEntries(text);
    }
    if (text instanceof Object) {
      // TODO check if text object only contains string keys & values?
      return text;
    }
  }

  return null;
}

/**
 * Get the default text from a language text map.
 *
 * If english `en` or any `en-##` is not defined, the first entry is returned.
 *
 * @param {Object<string, string>} text The language text map, key is the language identifier, value the language specific text.
 * @param {string} defaultText The text to return if `text` is empty.
 * @returns {string} The default text.
 */
function getDefaultLanguageString(text, defaultText = "Undefined") {
  if (!text) {
    return defaultText;
  }

  if (text.en) {
    return text.en;
  }

  for (const [index, [key, value]] of Object.entries(text).entries()) {
    if (index === 0) {
      defaultText = value;
    }
    if (key.startsWith("en-")) {
      return text[key];
    }
  }

  return defaultText;
}

module.exports = { toLanguageObject, getDefaultLanguageString };
