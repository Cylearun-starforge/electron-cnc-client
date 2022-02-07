import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { ConfigStore } from '@main/config/store';

const isDevelopment = process.env.NODE_ENV === 'development';
const preload = join(__dirname, 'preload.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload,
      devTools: isDevelopment,
    },
    show: false,
  }).once('ready-to-show', () => {
    win.show();
  });
  if (isDevelopment) {

    win.loadURL('http://localhost:3000');
    win.webContents.toggleDevTools();
  } else {
    win.loadURL(
      pathToFileURL(join(__dirname, './renderer/index.html')).toString(),
    );
  }
}

app.whenReady().then(createWindow).then(async () => {
  ipcMain.on('config', (event) => {
    event.returnValue = (ConfigStore.Instance.config);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
