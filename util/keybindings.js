const { app, globalShortcut } = require("electron");
const Window = require("./window");

module.exports = {
  register: () => {
    globalShortcut.register("CommandOrControl+T", () => {
      Window.win.send("keybind:tab");
    });
    globalShortcut.register("CommandOrControl+W", () => {
      Window.win.send("keybind:closeTab");
    });
  },
};
