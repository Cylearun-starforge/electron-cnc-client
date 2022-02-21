import { join } from 'path';
import { ConfigConst } from '@main/config/const';
import { Keys } from '@common/config/keys';
import { watch, FileChangeInfo } from 'fs/promises';

const configPath = join(ConfigConst.clientDir, Keys.clientConfiguration);

type WatchHandler = (info: FileChangeInfo<string>) => void;

export class ConfigWatcher {
  static #instance: ConfigWatcher | null = null;
  static #watchHandlers: Map<string, WatchHandler> = new Map();
  readonly #changeInfos: AsyncIterable<FileChangeInfo<string>>;

  static get Instance() {
    return (ConfigWatcher.#instance ??= new ConfigWatcher());
  }

  private constructor() {
    this.#changeInfos = watch(configPath);
    this.#handleChange();
  }

  #handleChange = async () => {
    for await (const change of this.#changeInfos) {
      const handler = ConfigWatcher.#watchHandlers.get(change.filename);
      if (handler) {
        handler(change);
      }
    }
  };

  public addWatchHandler(filename: string, handler: WatchHandler) {
    ConfigWatcher.#watchHandlers.set(filename, handler);
  }
}
