import { contextBridge, ipcRenderer } from 'electron';
import * as fs from 'fs/promises';

export const BridgeApi = {
  dirname: __dirname,
  read: (filename: string) => fs.readFile(filename),
  getConfig: () => ipcRenderer.sendSync('config'),
};
contextBridge.exposeInMainWorld('bridge', BridgeApi);
