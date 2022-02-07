import { contextBridge } from 'electron';
import * as fs from 'fs/promises';
import { readConfig } from '@main/config/readConfig';

export const BridgeApi = {
  dirname: __dirname,
  read: (filename: string) => fs.readFile(filename),
  readConfig,
};
contextBridge.exposeInMainWorld('bridge', BridgeApi);
