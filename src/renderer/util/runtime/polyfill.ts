import { toBase64 } from '@common/utils';

export class Polyfill {
  public static async loadFile(path: string, type?: string) {
    if (window.env === 'production') {
      return path;
    }
    const buffer = await window.bridge.callMain('request-local-file', path);
    return toBase64(
      new Blob([buffer], {
        type,
      })
    );
  }
}
