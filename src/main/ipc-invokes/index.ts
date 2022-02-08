import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { readFile } from 'fs/promises';

export const Invocable = {
  'request-local-file': async (event: IpcMainInvokeEvent, path: string) => {
    return (await readFile(path))
  },
};

export default function registerAll() {
  for (const channel in Invocable) {
    // @ts-ignore
    ipcMain.handle(channel, Invocable[channel]);
  }
}
