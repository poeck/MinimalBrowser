/** Imports */
const { BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

/** Config */
const WINDOW_CONF = require("../conf/window.conf");

class Window {
  static win; // Window Variable

  /** Creates Window */
  static create() {
    // Create Window
    this.win = new BrowserWindow(WINDOW_CONF.default);
    // Hide menu bar
    this.win.setMenuBarVisibility(false);
    // Load html
    this.win.loadURL(this.htmlPath("index/index.html"));
    // Goto Home
    this.win.webContents.once("dom-ready", () => this.loadRightPath());
    // Maximize Window
    this.win.maximize();
  }

  /** Returns path of HTML-Files */
  static htmlPath(file) {
    return isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`;
  }

  /** Loads path in main window */
  static loadPath(targetPath) {
    if (this.isAlive()) this.win.send("load", { path: targetPath });
  }

  /** Finds right path and loads it */
  static loadRightPath() {
    this.loadPath("/home");
  }

  /** Close the current window */
  static close() {
    if (this.isAlive()) this.win.close();
  }

  /** Minimize current window */
  static minimize() {
    if (this.isAlive()) this.win.minimize();
  }

  /** Reopen Window */
  static open() {
    if (this.isAlive()) {
      // Window exists & is not destroyed
      if (this.win.isMinimized()) this.win.restore(); // Restore window
      this.win.focus();
    } else this.create(); // Create new window
  }

  static isAlive() {
    return (
      this.win && this.win.isDestroyed !== undefined && !this.win.isDestroyed()
    );
  }
}

/** Export Window Class */
module.exports = Window;
