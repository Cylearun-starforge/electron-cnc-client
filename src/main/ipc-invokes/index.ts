import { ConfigConst } from '@main/config/const';
import { ConfigStore } from '@main/config/store';
import { MainWindow } from '@main/windows';
import { app, dialog, ipcMain, IpcMainInvokeEvent } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { processCss } from '@main/css/process';

export const Invocable = {
  'request-local-file': async (event: IpcMainInvokeEvent, path: string) => {
    return readFile(path);
  },
  'get-configuration': async (event: IpcMainInvokeEvent) => {
    const config = ConfigStore.Instance.config;
    const constants = ConfigConst;
    return {
      constants,
      dynamic: config,
    };
  },
  'path-join': async (event: IpcMainInvokeEvent, ...path: string[]) => {
    return join(...path);
  },
  'close-app': async (event: IpcMainInvokeEvent) => {
    app.quit();
  },
  'close-app-on-error': async (event: IpcMainInvokeEvent, error: string, message: string) => {
    MainWindow.Instance.destroy();
    dialog.showErrorBox(error, message);
    app.quit();
  },
  'open-in-explorer': async (event: IpcMainInvokeEvent, path: string) => {
    exec(`explorer.exe ${path}`);
  },
  'process-css': async (event: IpcMainInvokeEvent, path: string) => {
    return processCss(path);
  },
};

export default function registerAll() {
  for (const channel in Invocable) {
    // @ts-ignore
    ipcMain.handle(channel, Invocable[channel]);
  }
}
