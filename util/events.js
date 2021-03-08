/** Imports */
const { ipcMain } = require("electron");
const Window = require("./window");

/** Exports */
module.exports = {
  /** Listen for events from render process */
  listen: () => {
    /** Listen for event calls */
    ipcMain.on("event", (event, data) => {
      switch (data.event) {
        case "close":
          Window.close();
          break;
        case "minimize":
          Window.minimize();
          break;
      }
    });

    /** Log into main console from renderer */
    ipcMain.on("log", (event, data) => console.log(data));
  },
};
