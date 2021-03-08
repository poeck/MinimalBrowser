/** Imports */
const { app, Tray, Menu } = require("electron");
const isDev = require("electron-is-dev");
const Window = require("./window");
const path = require("path");

/** Variables */
let iconPath;
let tray = null;

/** Exports */
module.exports = {
  /** Create a tray */
  create: () => {
    /** Make sure tray doesn't exist */
    if (tray == null) {
      if (isDev) iconPath = path.join(__dirname, "..", "assets/icon.png");
      else iconPath = path.join(process.resourcesPath, "assets", "icon.png"); // Get Icon from resources

      // Creates Tray
      tray = new Tray(iconPath);

      /** Menu (opened on Tray Right-Click) */
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Open",
          click: () => Window.open(),
        },
        {
          label: "Exit",
          click: () => app.quit(),
        },
      ]);

      /** Tooltip (on hover) */
      tray.setToolTip(app.getName());

      /** Load created contextMenu */
      tray.setContextMenu(contextMenu);

      /** Listen to click */
      tray.on("click", () => {
        Window.open();
      });
    }
  },
};
