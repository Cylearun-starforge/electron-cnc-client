import { app, BrowserWindow, Menu } from 'electron';
import { ConfigStore } from '@main/config/store';
import { ConfigWatcher } from '@main/config/watch';
import { Keys } from '@common/config/keys';
import { MainWindow } from '@main/windows';
import registerIpc from '@main/ipc-invokes';
import { initLogger } from './logger';

function createWindow() {
  const store = ConfigStore.Instance;

  return MainWindow.create({
    width: store.config.defaultSize?.width,
    height: store.config.defaultSize?.height,
    minWidth: store.config.minimalSize?.width,
    minHeight: store.config.minimalSize?.height,
    maxWidth: store.config.maximalSize?.width,
    maxHeight: store.config.maximalSize?.height,
    show: false,
  });
}

async function loadConfig() {
  const store = ConfigStore.Instance;
  await store.readConfig();
  await store.scanThemes();
  ConfigWatcher.Instance.addWatchHandler(Keys.clientConfiguration, async change => {
    if (change.eventType === 'change') {
      await store.readConfig();
    }
  });
}

Menu.setApplicationMenu(null);
app.whenReady().then(async () => {
  if (process.env.NODE_ENV === 'development') {
    import('electron-devtools-installer')
      .then(install => {
        // @ts-ignore
        type Installer = typeof install.default;
        const installer = (install.default as unknown as { default: Installer }).default;
        return installer(install.REACT_DEVELOPER_TOOLS);
      })
      .then(name => {
        console.log(`Added Extension:  ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  }
  await initLogger();
  await loadConfig();
  createWindow();
  registerIpc();
  await MainWindow.canShow;

  MainWindow.Instance.show();
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
