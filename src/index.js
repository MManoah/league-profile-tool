const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
    frame: false,
    icon: __dirname + "/images/icon.ico",
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
};

app.on("ready", createWindow);
// Disable refresh
app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+R", () => {
    return;
  });
});
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
