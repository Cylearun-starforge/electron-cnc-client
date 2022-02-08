import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { ConfigStore } from '@main/config/store';
import { ConfigWatcher } from '@main/config/watch';
import { Keys } from '@common/config/keys';
import { Windows } from '@main/windows';
import registerAll from '@main/ipc-invokes';
// import { server } from './server';

const isDevelopment = process.env.NODE_ENV === 'development';
const preload = join(__dirname, 'preload.js');
let canShow: Promise<void>;

async function createWindow() {
  const loadUrl = isDevelopment
    ? 'http://localhost:3000'
    : pathToFileURL(join(__dirname, './renderer/index.html')).toString();
  Windows.main = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload,
      devTools: isDevelopment,
    },
    show: false,
  });
  canShow = new Promise<void>(res => {
    Windows.main.once('ready-to-show', () => {
      res();
    });
  });
  await Windows.main.loadURL(loadUrl);

  if (isDevelopment) {
    Windows.main.webContents.toggleDevTools();
  }
}

function registerIpc() {
  registerAll();
}

async function loadConfig() {
  const store = ConfigStore.Instance;
  await store.readConfig();
  ConfigWatcher.Instance.addWatchHandler(Keys.clientConfiguration, async change => {
    if (change.eventType === 'change') {
      await store.readConfig();
      store.sendToRender(Windows.main);
    }
  });
}

app.whenReady().then(async () => {
  const asyncWorks = Promise.all([createWindow(), loadConfig(), canShow]);
  registerIpc();
  await asyncWorks;
  Windows.main.show();
  ConfigStore.Instance.sendToRender(Windows.main);
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
