/** Imports */
const NodeStorage = require("node-storage");
const { app } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

/** Variables */
let storagePath = ""; // Path to Prefs File

class Storage {
  /** Storage/Prefs variable */
  static store;

  static init() {
    if (isDev) storagePath = path.join(app.getAppPath(), "storage.json");
    else storagePath = path.join(app.getPath("userData"), "storage.json");

    // Save in store var
    this.store = new NodeStorage(storagePath);
  }

  /** Gets data with key */
  static get(key) {
    return this.store.get(key);
  }

  /** Saves data under key */
  static put(key, data) {
    return this.store.put(key, data);
  }

  /** Deletes key from prefs */
  static delete(key) {
    return this.store.put(key, undefined);
  }
}

/** Exports */
module.exports = Storage;
