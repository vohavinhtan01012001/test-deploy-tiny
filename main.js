// =============================
require("module-alias/register");
// =============================

const electron = require("electron");
const { autoUpdater } = require("electron-updater");

const { app, Menu, Tray, BrowserWindow, dialog, ipcMain } = electron;
const path = require("path");
const { spawn } = require("child_process");
const log = require("electron-log");
const util = require("util");
// const AutoLaunch = require('auto-launch')
const Store = require("electron-store");
const store = new Store();
module.exports = store;


ipcMain.handle("setStore", (event, key, value) => {
  store.set(key, value);
  return "Stored!";
});

ipcMain.handle("getStore", (event, key) => {
  return store.get(key);
});

let coreNeedResume = false;
let core = null;
let coreInterrupt = false;
const isWin32 = process.platform == "win32";
// const autoLauncher = new AutoLaunch({name: 'Tiny.VN'})
//
//
// function resetAutoLaunch() {
//     console.log('exec func: resetAutoLaunch -> set auto launch startup!')
//     autoLauncher.isEnabled().then((isEnabled) => {
//         if (!isEnabled) {
//             // Enabled in Mellow but found disabled in system preferences.
//             autoLauncher.enable()
//         }
//     }).catch((err) => {
//         dialog.showErrorBox('Error', 'Failed to check auto launcher status.')
//     })
// }
//
// resetAutoLaunch()

let helperResourcePath = path.join(process.resourcesPath, "src/helper");
let coreCmd = path.join(helperResourcePath, "core.exe");

function monitorPowerEvent() {
  electron.powerMonitor.on("lock-screen", () => {
    log.info("Screen locked.");
  });
  electron.powerMonitor.on("unlock-screen", () => {
    log.info("Screen unlocked.");
  });
  electron.powerMonitor.on("suspend", () => {
    log.info("Device suspended.");
    if (isWin32) {
      down();
    }
  });
  electron.powerMonitor.on("resume", async () => {
    log.info("Device resumed.");
    await delay(5000);
    up();
  });
}

async function startTiny(callback) {
  return new Promise(async function (resolve, reject) {
    log.info("Starting Tiny <3");
    log.info("Ensuring tap device sets up correctly.");
    try {
      let cmdTap = path.join(process.resourcesPath, "elevate");
      let flags = [
        path.join(
          helperResourcePath,
          "tap-windows6",
          "tap-windows-9.9.2_3.exe"
        ),
        "/S",
        "certuril",
        "-addstore",
        `'TrustedPublisher'`,
        "trustcer.cert",
        "/SELECT_SHURTCUTS=0",
        "/SELECT_OPENVPN=0",
        "/SELECT_SERVICE=0",
        "/SELECT_TAP=1",
        "/SELECT_OPENVPNGUI=0",
        "/SELECT_ASSOCIATIONS=0",
      ];
      log.info("Tap cmd --> ", cmdTap);
      let out = await sudoExec(cmdTap, flags);
      log.info(out);
    } catch (err) {
      dialog.showErrorBox("Error", "TAP device not ready: " + err);
      app.exit();
      return resolve();
    }

    await delay(3000);
    let env = Object.create(process.env);

    core = spawn(coreCmd, { env: env });
    core.stdout.on("data", (data) => {
      log.info(data.toString());
    });
    core.stderr.on("data", (data) => {
      log.info(data.toString());
    });
    core.on("close", (code, signal) => {
      log.info("Core stopped, code", code, "signal", signal);

      if (coreNeedResume) {
        // Change status and wait for the resume event callback to be called so the core will be restarted.
        log.info("Core will restart upon device resume.");
        coreNeedResume = false;
        core = null;
        return resolve();
      }

      if (code && code != 0) {
        log.info("Core fails to startup, interrupt the starting procedure.");
        coreInterrupt = true;
        core = null;
        dialog.showErrorBox(
          "Error",
          util.format('Failed to start the Core, see "%s" for more details.')
        );
        return resolve();
      }

      log.info("set state --> disconected!!!");
      // setState(state.Disconnected)
    });
    core.on("error", (err) => {
      log.info("Core errored.");
      coreInterrupt = true;
      core = null;
      log.info("set state --> disconected!!!");
      // setState(state.Disconnected)
      log.info(err);
      dialog.showErrorBox(
        "Error",
        util.format('Failed to start the Core, see "%s" for more details.')
      );
      return resolve();
    });
    log.info("Core started.");
    if (callback !== null) {
      callback();
    }
  });
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function stopTiny() {
  log.info("Stop Tiny !!!.");
  if (core !== null) {
    //signal Tiny close!
    // core.close()
  }
}

async function sudoExec(cmd, flags) {
  return new Promise((resolve, reject) => {
    let ls = spawn(cmd, flags);
    ls.on("close", function (code) {
      console.log(`child process exited with code ${code}`);
      return resolve();
    });
    ls.on("error", function (code) {
      console.log(`child process exited with code ${code}`);
      reject(code);
    });
  });
}

async function reconnect() {
  await down();
  up();
}

async function checkForUpdate(win) {
  return new Promise(function (resolve, reject) {
    autoUpdater.checkForUpdates();

    function sendStatusToWindow(text) {
      // const options = {
      //     type: 'info',
      //     defaultId: 2,
      //     title: 'Log update!',
      //     message: text,
      // };
      // dialog.showMessageBox(win, options);
      try {
        win.webContents.executeJavaScript(
          'document.body.innerHTML = "' + text + '";'
        );
      } catch (e) { }
    }

    let downloadText = "Downloading update ....";

    //@source https://gist.github.com/iffy/0ff845e8e3f59dbe7eaf2bf24443f104
    //@fix https://github.com/brennomarques/electron-update/blob/master/package.json
    //@process bar --> https://stackoverflow.com/questions/41568687/electron-autoupdater-progress-bar
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = "info";

    autoUpdater.on("checking-for-update", () => {
      // sendStatusToWindow('Checking for update...');
    });
    autoUpdater.on("update-available", (ev, info) => {
      // sendStatusToWindow('Update available.');
      setInterval(function () {
        downloadText = downloadText + ".";
        sendStatusToWindow(downloadText);
      }, 500);
      sendStatusToWindow(downloadText);
    });
    autoUpdater.on("update-not-available", (ev, info) => {
      return resolve(false);
      // sendStatusToWindow('Update not available.');
    });
    autoUpdater.on("error", (ev, err) => {
      return resolve(false);
      // sendStatusToWindow('Error in auto-updater.'+err.toString());
    });
    autoUpdater.on("download-progress", (ev, progressObj) => {
      downloadText = downloadText + ".";
      sendStatusToWindow(downloadText);
    });
    autoUpdater.on("update-downloaded", (ev, info) => {
      autoUpdater.quitAndInstall();
    });
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    // icon: path.join(process.resourcesPath, 'src/assets/icon.ico'),
    icon: "public/logo.png",
    // autoHideMenuBar: true,
    width: 1024,
    height: 768,
    center: true,
    // maximizable: false,
    webPreferences: {
      defaultEncoding: "UTF-8",
      defaultFontFamily: "serif",
      experimentalFeatures: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.handle("ping", () => "pong");
  win.blur();
  await win.loadURL("about:blank");
  // await checkForUpdate(win)

  const ses = win.webContents.session;
  await ses.clearCache().catch(() => { });
  await ses.clearStorageData().catch(() => { });
  // await win.loadURL("https://tiny.vn/login.html").catch(() => {
  //     win.webContents.executeJavaScript('document.body.innerHTML = "Lỗi, bạn mở chrome vào web Tiny.VN Login tạm nhé !<br>Nếu không được thì hay liên hệ hỗ trợ ở fanpage nhé ! <br> Xin lỗi vì sự bất tiện này ạ :("')
  // })

  // await win.loadFile('./dist/index.html')
  await win.loadURL(
    process.env.NODE_ENV == "production"
      ? process.env.VITE_PRODUCTION_BASE_URL
      : "http://localhost:5173"
  );
  // win.webContents.openDevTools();

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
    }
  });

  // win.on("minimize", function (event) {
  //   event.preventDefault();
  //   win.hide();
  // });

  win.on("close", function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });

  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: function () {
        win.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        try {
          core.kill();
        } catch (e) { }
        win.destroy();
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  try {
    // win.tray = new Tray(path.join(process.resourcesPath, 'src/assets/icon.ico'))
    const logoPath = path.join(__dirname, "public", "logo.png");
    win.tray = new Tray(logoPath);
    win.tray.setContextMenu(contextMenu);
    win.tray.on("click", () => (win.isVisible() ? win.hide() : win.show()));
    win.tray.setToolTip("Tiny.VN Launcher!");

    // while (true) {
    //   await liveCheck();
    //   await delay(2000);
    // }
  } catch (error) {
    console.error("Failed to create tray:", error);
  }
}

//main windows run
async function main() {
  createWindow();
  monitorPowerEvent();
  log.info(util.format("Tiny.VN (%s) started.", app.getVersion()));
}

const { Resolver } = require("dns");
const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.4.4.8"]);

let isConnected = false;

async function liveCheck() {
  return new Promise(function (resolve, reject) {
    resolver.resolve("www.google.com", async function (err, addr) {
      if (err) {
        if (isConnected) {
          const options = {
            type: "info",
            defaultId: 2,
            title: "Rớt mạng!",
            message: "Hãy kiểm tra mạng của bạn?",
          };

          dialog.showMessageBox(null, options);
        }
        isConnected = false;
        //signal exit Tiny app?
        await stopTiny();
        return resolve();
      } else {
        if (isConnected) {
          if (core === null) {
            log.info("restart Tiny !!!");
            await startTiny();
          }
          //connection is still up and running, do nothing
        } else {
          log.info("network online !!!!");
          await startTiny();
        }
        isConnected = true;
        return resolve();
      }
    });
  });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}
app.on("ready", main);
