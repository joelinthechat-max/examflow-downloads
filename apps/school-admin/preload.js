// Secure preload — no Node.js APIs exposed to the page.
// contextIsolation is true and nodeIntegration is false.
// This file intentionally stays empty of any require() or process exposure.

const { contextBridge } = require('electron');

// Expose only a minimal, non-sensitive helper for the offline page retry button.
// The real portals do not need any bridge.
contextBridge.exposeInMainWorld('examflowDesktop', {
  isDesktop: true,
  platform: process.platform,
  // No auth tokens, no credentials, no file system access.
});
