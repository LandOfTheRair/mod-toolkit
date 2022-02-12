import { app, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';

import * as handlers from './handlers';
import { testMod, killMod } from './testmod';

const baseUrl = app.getAppPath();

let watcher = null;

export function watchMaps(sendToUI) {
  if(!fs.existsSync(`${baseUrl}/.loaded`)) return;
  if(watcher) return;

  watcher = chokidar.watch(`${baseUrl}/resources/maps/src/content/maps/custom/*.json`, {
    persistent: true
  });

  const updateMap = (name) => {
    const map = fs.readJSONSync(`${baseUrl}/resources/maps/src/content/maps/custom/${name}.json`);
    sendToUI('newmap', { name, map });
  };

  watcher.on('change', filePath => {
    const map = path.basename(filePath, '.json');
    updateMap(map);
  });
}

export function setupIPC(sendToUI) {
  watchMaps(sendToUI);

  ipcMain.on('UPDATE_RESOURCES', async () => {
    try {
      sendToUI('notify', { type: 'info', text: 'Updating resources...' });
      await handlers.updateResources(sendToUI);
      watchMaps(sendToUI);
      sendToUI('notify', { type: 'success', text: 'Spritesheets and game data have been updated.' });
    } catch(e) {
      sendToUI('notify', { type: 'error', text: e.message });
    }
  });
  
  ipcMain.on('ENSURE_MAP', async (e, data) => {
    if(!data.name || !data.map) return;
    handlers.ensureMap(data.name, data.map);
  });
  
  ipcMain.on('NEW_MAP', async (e, data) => {
    const name = data.name;
    if(!name) return;
    
    try {
      const map = handlers.newMap(name, data.creator);
      sendToUI('newmap', { name, map });
    } catch(e) {
      sendToUI('notify', { type: 'error', text: 'Could not create that map name.' });
    }
  });
  
  ipcMain.on('RENAME_MAP', async (e, data) => {
    handlers.renameMap(data.oldName, data.newName);
    sendToUI('renamemap', data);
  });
  
  ipcMain.on('EDIT_MAP', async (e, data) => {
    const name = data.name;
    if(!name) return;
    
    handlers.editMap(name);
  });
  
  ipcMain.on('EDIT_MAP_SPAWNER', async (e, data) => {
    const { oldName, newName } = data;
    if(!oldName || !newName) return;
    
    handlers.editMapSpawnerNames(oldName, newName);
  });
  
  ipcMain.on('JSON', async (e, data) => {
    const json = data.json;
    if(!json) return;
    
    const jsonData = handlers.loadJSON(json);
    sendToUI('json', { name: json, data: jsonData });
  });

  ipcMain.on('SAVE_MOD', (e, data) => {
    const res = dialog.showSaveDialogSync(null, {
      title: 'Save Land of the Rair Mod',
      defaultPath: data.meta.name,
      filters: [
        { name: 'Rair Mods', extensions: ['rairmod'] }
      ]
    });
    
    if(!res) return;

    fs.writeJSONSync(res, data);
    sendToUI('notify', { type: 'info', text: `Saved ${res}!` });
  });

  ipcMain.on('LOAD_MOD', () => {
    const res = dialog.showOpenDialogSync(null, {
      title: 'Load Land of the Rair Mod',
      filters: [
        { name: 'Rair Mods', extensions: ['rairmod'] }
      ],
      properties: ['openFile']
    });
    
    if(!res) return;

    const file = res[0];
    const json = fs.readJSONSync(file);

    sendToUI('loadmod', json);
    sendToUI('notify', { type: 'info', text: `Loaded ${file}!` });
  });

  ipcMain.on('DOWNLOAD_MONGO', async () => {
    await handlers.downloadMongo(sendToUI);
    sendToUI('notify', { type: 'info', text: 'Finished downloading MongoDB!' });
  });

  ipcMain.on('DOWNLOAD_RAIR', async () => {
    await handlers.downloadRair(sendToUI);
    sendToUI('notify', { type: 'info', text: 'Finished downloading LotR Server!' });
  });

  ipcMain.on('TEST_MOD', async (e, data) => {
    sendToUI('notify', { type: 'info', text: 'Testing mod...' });
    testMod(sendToUI, data);
  });

  ipcMain.on('KILL_MOD', async () => {
    sendToUI('notify', { type: 'info', text: 'Killing LotR/MongoDB...' });
    killMod(sendToUI);
  });
}