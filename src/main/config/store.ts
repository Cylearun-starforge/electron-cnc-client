import fs from 'fs';

import { readFile } from 'fs/promises';
import { ConfigConst } from '@main/config/const';
import { join } from 'path';

const configPath = join(ConfigConst.ConfigDir, ConfigConst.ClientConfigName);

export class ConfigStore {
  #config: object | null = null;
  static #instance: ConfigStore | null = null;

  static get Instance() {
    return ConfigStore.#instance ??= new ConfigStore();
  }

  constructor() {
    this.readConfig().then(value => {
      this.#config = value;
    });
    ConfigStore.#instance = this;

    console.log('Start watching config dir', ConfigConst.ConfigDir);
    fs.watch(ConfigConst.ConfigDir, async (event, file) => {
      if (event === 'change' && file === ConfigConst.ClientConfigName) {
        console.log(ConfigConst.ClientConfigName, 'changed, reload config');
        this.#config = await this.readConfig();
      }
    });
  }

  async readConfig() {
    const buffer = await readFile(configPath);
    return JSON.parse(buffer.toString());

  }

  get config() {
    return this.#config;
  }

}