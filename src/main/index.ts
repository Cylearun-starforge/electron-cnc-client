import { app, BrowserWindow } from 'electron';
import { ConfigStore } from '@main/config/store';
import { ConfigWatcher } from '@main/config/watch';
import { Keys } from '@common/config/keys';
import { MainWindow } from '@main/windows';
import registerIpc from '@main/ipc-invokes';

function createWindow() {
  return MainWindow.create({
    width: 1600,
    height: 900,
    show: false,
  });
}

async function loadConfig() {
  const store = ConfigStore.Instance;
  await store.readConfig();
  ConfigWatcher.Instance.addWatchHandler(Keys.clientConfiguration, async change => {
    if (change.eventType === 'change') {
      await store.readConfig();
      store.sendToRender(MainWindow.Instance);
    }
  });
}

app.whenReady().then(async () => {
  createWindow();
  registerIpc();
  const asyncWorks = Promise.all([MainWindow.canShow, loadConfig()]);
  await asyncWorks;
  MainWindow.Instance.show();
  ConfigStore.Instance.sendToRender(MainWindow.Instance);
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
