type BridgeApiType = typeof import('../../main/preload').BridgeApi;

interface Window {
  bridge: BridgeApiType
}