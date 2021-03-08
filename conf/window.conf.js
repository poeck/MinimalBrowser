module.exports = {
  default: {
    // Options loaded on new Window
    center: false, // Set centered
    frame: false, // Hide frame
    width: 1344,
    height: 756,
    webPreferences: {
      useragent: "Chrome",
      webviewTag: true,
      enableRemoteModule: true,
      nodeIntegration: true, // Enable nodeIntegration
      contextIsolation: false,
    },
  },
};
