// ABOUTME: Electron preload bridge for feedclaude
// ABOUTME: Exposes IPC channels for sound playback
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  sendFood: () => ipcRenderer.send('send-food'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  onSpawnFood: (fn) => ipcRenderer.on('spawn-food', () => fn()),
  onDropFood: (fn) => ipcRenderer.on('drop-food', () => fn()),
  onPlayCrunch: (fn) => ipcRenderer.on('play-crunch', () => fn()),
});
