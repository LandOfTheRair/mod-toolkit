
const {
  contextBridge,
  ipcRenderer
} = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', 
  {
    send: (event, data) => {
      ipcRenderer.send(event, data);
    },
    receive: (event, func) => {
      ipcRenderer.on(event, (ev, ...args) => func(...args));
    }
  }
);