
import path from 'path';
import fs from 'fs-extra';
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import * as handlers from './handlers';
import { setupIPC, watchMaps } from './ipc';

const isDevelopment = process.env.NODE_ENV !== 'production';

const Config = require('electron-config');
const config = new Config();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  
  const opts = { 
    show: false, 
    icon: __dirname + '/favicon.ico'
  };

  Object.assign(opts, config.get('winBounds'));

  if(!opts.height) opts.height = 900;
  if(!opts.width) opts.width = 1300;

  // Create the browser window.
  const win = new BrowserWindow({
    ...opts,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setMenu(null);
  
  win.once('ready-to-show', win.show);

  win.on('close', () => {
    config.set('winBounds', win.getBounds());
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  
  // load intercepter for image loading
  protocol.interceptFileProtocol('file', (req, callback) => {
    const url = req.url.substr(7);
    callback({ path: path.normalize(app.getAppPath() + url) });
  });

  const sendToUI = (d, i) => {
    win.webContents.send(d, i);
  };

  // check for and load resources if they're not present
  let isReady = false;

  if(!fs.existsSync(app.getAppPath() + '/.loaded')) {
    sendToUI('notify', { type: 'info', text: 'Loading resources for first time launch...' });
    await handlers.updateResources(sendToUI);
    watchMaps(sendToUI);
    sendToUI('notify', { type: 'success', text: 'Spritesheets and game data have been installed.' });
    sendToUI('ready');
    isReady = true;

  } else {
    sendToUI('ready');
    isReady = true;
  }
  
  // watch IPC stuff
  ipcMain.on('READY_CHECK', async () => {
    if(!isReady) return;
    sendToUI('ready');
  });

  setupIPC(sendToUI);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}