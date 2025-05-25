const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = !app.isPackaged;

const backendUrl = isDev
  ? 'http://localhost:5000' // local dev
  : 'https://your-backend.onrender.com'; // update to your Render backend URL

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;
let apiServer;
let socketServer;

function startServers() {
  if (!isDev) return; // Only start local servers in development

  const apiPath = path.join(__dirname, 'backend', 'server.js');
  const socketPath = path.join(__dirname, 'socket-server', 'index.js');
  const nodePath = 'node';

  apiServer = spawn(nodePath, [apiPath], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  apiServer.unref();
  apiServer.stderr.on('data', data => console.error(`API stderr: ${data}`));

  socketServer = spawn(nodePath, [socketPath], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  socketServer.unref();
  socketServer.stderr.on('data', data => console.error(`Socket stderr: ${data}`));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const loginUrl = `${backendUrl}/login.html`;
  console.log('Loading URL:', loginUrl);
  mainWindow.loadURL(loginUrl);
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  startServers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  if (apiServer) apiServer.kill();
  if (socketServer) socketServer.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// For screen sharing
ipcMain.handle('getSources', async (event, options) => {
  try {
    const sources = await desktopCapturer.getSources(options);
    return sources;
  } catch (error) {
    console.error('Error getting sources:', error);
    return [];
  }
});
