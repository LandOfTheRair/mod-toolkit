import { dialog } from 'electron';
import fs from 'fs-extra';

import * as handlers from './handlers';

export function setupIPC(ipcMain, sendToUI) {
  ipcMain.on('UPDATE_RESOURCES', async () => {
    try {
      sendToUI('notify', { type: 'info', text: 'Updating resources...' });
      await handlers.updateResources();
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
  
  ipcMain.on('EDIT_MAP', async (e, data) => {
    const name = data.name;
    if(!name) return;
    
    handlers.editMap(name);
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
}