// Secure preload — no Node.js APIs exposed to the page.
// contextIsolation is true and nodeIntegration is false.

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('examflowDesktop', {
  isDesktop: true,
  platform: process.platform,
});
