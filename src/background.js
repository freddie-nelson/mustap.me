"use strict";

import { app, protocol, BrowserWindow, globalShortcut, Menu } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import { install } from "vuedraggable";
const isDevelopment = process.env.NODE_ENV !== "production";
// const path = require("path");
const fs = require("fs");
const windowStateKeeper = require("electron-window-state");

const currentThemePath =
  app.getPath("userData") + "/mustap/themes/currentTheme.json";
let bgColor = "";

if (fs.existsSync(currentThemePath)) {
  const obj = JSON.parse(fs.readFileSync(currentThemePath));
  bgColor = obj.colors.mainBg;
} else {
  bgColor = "#121212";
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 950
  });

  // Create the browser window.
  win = new BrowserWindow({
    title: "Mustap",
    show: true,
    frame: false,
    minWidth: 900,
    minHeight: 650,
    fullscreen: mainWindowState.fullscreen,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // icon: path.join(__dirname, "/512x512.png"),
    backgroundColor: bgColor,
    webPreferences: {
      nodeIntegration: true,
      devTools: true, // CHANGE HERE TO FALSE TO DISABLE DEVTOOLS FOR PRODUCTION -----------------------------------------------------------------------
      webSecurity: true,
      enableRemoteModule: true
    },
  });

  mainWindowState.manage(win);

  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    win.focus();
  }

  win.on("closed", () => {
    win = null;
  });

  // win.on("ready-to-show", () => {
  //   win.show();
  //   win.focus();
  // });

  win.webContents.on("did-finish-load", () => {
    win.setTitle("Mustap");
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      console.log("Installing devtools")
      await installExtension(VUEJS_DEVTOOLS);
      console.log("Vue devtools installed.")
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  createWindow();
});

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

let menu = new Menu();

if (process.platform === "darwin") {
  var template = [
    {
      label: "FromScratch",
      submenu: [
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];
  var osxMenu = menu.buildFromTemplate(template);
  menu.setApplicationMenu(osxMenu);
}
