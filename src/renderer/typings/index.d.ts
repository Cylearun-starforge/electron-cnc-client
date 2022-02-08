type BridgeApiType = typeof import('../../main/preload').BridgeApi;

// eslint-disable-next-line no-unused-vars
interface Window {
  bridge: BridgeApiType;
}
