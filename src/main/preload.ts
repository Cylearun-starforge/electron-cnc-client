import { contextBridge, ipcRenderer } from 'electron';
// import * as fs from 'fs/promises';
import type { ConfigConstType } from '@main/config/const';

const getConfigConstants = () => {
  return ipcRenderer.sendSync('ConfigConst') as ConfigConstType;
};

export const BridgeApi = {
  dirname: __dirname,
  // read: (filename: string) => fs.readFile(filename),
  getConfig: (key: string) => {
    const config = ipcRenderer.sendSync('config');
    if (!config) {
      throw new Error('config not loaded');
    }
    return config[key];
  },
  getConfigConstants,
  onConfigChange: <T extends object = any>(action: (config: T) => void) => {
    ipcRenderer.on('config-reload', (e, config) => {
      console.log('config reload', e);
      action(config);
    });
  },
  requestLocalFile: (path: string) => ipcRenderer.invoke('request-local-file', path) as Promise<string>,
};
contextBridge.exposeInMainWorld('bridge', BridgeApi);
