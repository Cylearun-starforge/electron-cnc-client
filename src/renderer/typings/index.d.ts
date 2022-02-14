type BridgeApiType = typeof import('../../main/preload').BridgeApi;


declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    bridge: BridgeApiType;
    env: 'development' | 'production';
  }
}

export {};
