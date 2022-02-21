import { ArrayRemoveFirst } from '@common/utils';
import { createLogger } from '@common/utils/create-logger';
import { contextBridge, ipcRenderer } from 'electron';
import { ConfigConst } from './config/const';

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

const logger = createLogger('renderer');
callMain('log-path').then(path => {
  logger.transports.file.resolvePath = () => path;
  contextBridge.exposeInMainWorld('bridge', BridgeApi); // WOPS! Async expose works!
});
logger.transports.console.level = false;
logger.transports.file.level = ConfigConst.env === 'development' ? 'debug' : 'warn';

export const BridgeApi = {
  dirname: __dirname,
  callMain,
  logger,
};

contextBridge.exposeInMainWorld('env', ConfigConst.env);
