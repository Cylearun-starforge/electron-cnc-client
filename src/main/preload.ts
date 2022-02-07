import { contextBridge, ipcRenderer } from 'electron';

export const BridgeApi = {
  test: (name: string) => {
    return 'hello ' + name;
  },
};
contextBridge.exposeInMainWorld('bridge', BridgeApi);
