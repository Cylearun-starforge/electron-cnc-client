type BridgeApiType = typeof import('../../main/preload').BridgeApi;
type BridgeApiFunctions = {
  [key in keyof BridgeApiType]: {
    param: Parameters<BridgeApiType[key]>;
    return: ReturnType<BridgeApiType[key]>
  }
}

interface Window {
  bridge: BridgeApiType
}