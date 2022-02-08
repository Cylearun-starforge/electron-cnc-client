import { ConfigConst } from '@main/config/const';
import { ConfigStore } from '@main/config/store';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
};

export default function registerAll() {
  for (const channel in Invocable) {
    // @ts-ignore
    ipcMain.handle(channel, Invocable[channel]);
  }
}
