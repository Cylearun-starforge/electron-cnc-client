import { ArrayRemoveFirst } from '@common/utils';
import { contextBridge, ipcRenderer } from 'electron';

type IpcInvocable = typeof import('@main/ipc-invokes').Invocable;
type InvocableHelper = {
  [key in keyof IpcInvocable]: {
    param: ArrayRemoveFirst<Parameters<IpcInvocable[key]>>;
    return: ReturnType<IpcInvocable[key]>;
  };
};
const callMain = <Channel extends keyof InvocableHelper = keyof InvocableHelper>(
  channel: Channel,
  ...args: InvocableHelper[Channel]['param']
): InvocableHelper[Channel]['return'] => ipcRenderer.invoke(channel, ...args);

export const BridgeApi = {
  dirname: __dirname,
  callMain,
};

contextBridge.exposeInMainWorld('bridge', BridgeApi);
contextBridge.exposeInMainWorld('env', process.env.NODE_ENV === 'development' ? 'development' : 'production');
