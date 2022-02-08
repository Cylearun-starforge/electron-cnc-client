import { readFile } from 'fs/promises';
import { ConfigConst } from '@main/config/const';
import { join } from 'path';
import { Keys } from '@common/config/keys';
import type { BrowserWindow } from 'electron';
import { ClientConfigurationType } from '@common/config/type';

const configPath = join(ConfigConst.ConfigDir, Keys.clientConfiguration);

export class ConfigStore {
  #config: ClientConfigurationType | null = null;
  static #instance: ConfigStore | null = null;

  static get Instance() {
    return (ConfigStore.#instance ??= new ConfigStore());
  }

  constructor() {
    this.readConfig();
    ConfigStore.#instance = this;
  }

  async readConfig() {
    const buffer = await readFile(configPath);
    this.#config = JSON.parse(buffer.toString());
  }

  get config() {
    return this.#config;
  }

  sendToRender(window: BrowserWindow) {
    window.webContents.send('config-reload', this.#config);
    console.log('send new config', this.#config);
  }
}
