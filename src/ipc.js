
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
      const map = handlers.newMap(name);
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
}