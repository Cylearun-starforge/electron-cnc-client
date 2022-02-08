import { contextBridge, ipcRenderer } from 'electron';

type IpcInvocable = typeof import('@main/ipc-invokes').Invocable;
type RemoveFirst<T extends any[]> = T extends [first: infer First, ...rest: infer Rest] ? Rest : [];
type InvocableHelper = {
  [key in keyof IpcInvocable]: {
    param: RemoveFirst<Parameters<IpcInvocable[key]>>;
    return: ReturnType<IpcInvocable[key]>;
  };
};
const callMain = <Channel extends keyof InvocableHelper = keyof InvocableHelper>(
  channel: Channel,
  ...args: InvocableHelper[Channel]['param']
): InvocableHelper[Channel]['return'] => ipcRenderer.invoke(channel, ...args);

export const BridgeApi = {
  dirname: __dirname,
  onConfigChange: <T extends object = any>(action: (config: T) => void) => {
    ipcRenderer.on('config-reload', (e, config) => {
      action(config);
    });
  },
  callMain,
};
contextBridge.exposeInMainWorld('bridge', BridgeApi);
