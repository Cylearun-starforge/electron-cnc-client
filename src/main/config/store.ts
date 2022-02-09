import { readFile } from 'fs/promises';
import { ConfigConst } from '@main/config/const';
import { join } from 'path';
import { Keys } from '@common/config/keys';
import { app, BrowserWindow, dialog } from 'electron';
import { ClientConfigurationType } from '@common/config/type';

const configPath = join(ConfigConst.ConfigDir, Keys.clientConfiguration);

export class ConfigStore {
  #config: ClientConfigurationType = {};
  #isBootLoad = true;
  static #instance: ConfigStore | null = null;

  static get Instance() {
    return (ConfigStore.#instance ??= new ConfigStore());
  }

  constructor() {
    this.readConfig();
    ConfigStore.#instance = this;
  }

  async readConfig() {
    try {
      const buffer = await readFile(configPath);
      this.#config = JSON.parse(buffer.toString());
      this.#isBootLoad = false;
    } catch (err) {
      if (err instanceof SyntaxError && !this.#isBootLoad) {
        // It's common to cause syntax error when editing configuration file, so we ignore this error.
        return;
      }
      if (err instanceof Error) {
        dialog.showErrorBox(err.name, err.message);
      } else {
        const toString = (err as any).toString ?? Object.prototype.toString;
        dialog.showErrorBox(
          `A error occurred when loading configuration file`,
          `error: ${toString.call(err)}\nThis error is occurred when reading ${configPath}`
        );
      }
      app.quit();
    }
  }

  get config() {
    return this.#config;
  }

  sendToRender(window: BrowserWindow) {
    window.webContents.send('config-reload', this.#config);
  }
}
