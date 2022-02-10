import { app, BrowserWindow, Menu } from 'electron';
import { ConfigStore } from '@main/config/store';
import { ConfigWatcher } from '@main/config/watch';
import { Keys } from '@common/config/keys';
import { MainWindow } from '@main/windows';
import registerIpc from '@main/ipc-invokes';

function createWindow() {
  return MainWindow.create({
    width: 1920,
    height: 1080,
    show: false,
    minWidth: 800,
    minHeight: 600,
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
