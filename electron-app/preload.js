// preload.js (Make sure this file exists and is referenced in your BrowserWindow config)
const { contextBridge, ipcRenderer } = require('electron');

// Expose `getSources` to the renderer process
contextBridge.exposeInMainWorld('electron', {
  getSources: (options) => ipcRenderer.invoke('getSources', options)
});
