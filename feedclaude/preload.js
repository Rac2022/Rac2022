// ABOUTME: Electron preload bridge exposing IPC channels for the food toss overlay
// ABOUTME: Connects renderer (overlay.html) to main process (main.js) via secure context bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  sendFood: () => ipcRenderer.send('send-food'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  onSpawnFood: (fn) => ipcRenderer.on('spawn-food', () => fn()),
  onDropFood: (fn) => ipcRenderer.on('drop-food', () => fn()),
});
