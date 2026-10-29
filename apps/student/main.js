const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');

const ROLE = 'student';
const START_URL = 'https://examflow-backend-79ws.onrender.com/student/';
const APP_NAME = 'ExamFlow Student';

let mainWindow = null;

function isAllowedUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const host = u.hostname;
    if (host === 'examflow-backend-79ws.onrender.com') return true;
    if (host.endsWith('.onrender.com')) return true;
    if (host.endsWith('.firebaseapp.com')) return true;
    if (host.endsWith('.googleapis.com')) return true;
    if (host.endsWith('.gstatic.com')) return true;
    if (host === 'accounts.google.com') return true;
    if (host === 'identitytoolkit.googleapis.com') return true;
    if (host === 'securetoken.googleapis.com') return true;
    if (host === 'www.googleapis.com') return true;
    if (host === 'firebase.googleapis.com') return true;
    if (host.endsWith('.cloudfunctions.net')) return true;
    return false;
  } catch {
    return false;
  }
}

function createOfflinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${APP_NAME} — Offline</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .card { background: #1e293b; border-radius: 16px; padding: 40px; max-width: 440px; text-align: center; }
    h1 { font-size: 22px; margin-bottom: 12px; }
    p { color: #94a3b8; margin-bottom: 24px; }
    button { background: #3b82f6; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>No Internet Connection</h1>
    <p>${APP_NAME} requires an active internet connection.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: APP_NAME,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedUrl(url)) {
      event.preventDefault();
      shell.openExternal(url).catch(() => {});
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url)) return { action: 'allow' };
    shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame && [-106, -105, -2, -100, -101].includes(errorCode)) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createOfflinePage())}`);
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });

  mainWindow.loadURL(START_URL).catch(() => {
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createOfflinePage())}`);
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      callback(['clipboard-read', 'clipboard-sanitized-write'].includes(permission));
    });
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (e) => e.preventDefault());
  contents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url)) return { action: 'allow' };
    shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });
});
