/** Imports */
const { app } = require("electron");
const Window = require("./window");

/** Exports */
module.exports = {
  /** Requests App to only have a single instance | Restores and Focuses window on second instance */
  request: () => {
    const gotTheLock = app.requestSingleInstanceLock();
    if (gotTheLock) {
      // No instance open yet

      /** Called when second instance started */
      app.on(
        "second-instance",
        (event, commandLine, workingDirectory) => Window.open() // Restores and Focuses old window
      );
    } else app.quit(); // Other instance already running
  },
};
