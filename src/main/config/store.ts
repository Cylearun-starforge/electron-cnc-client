import { readFile, opendir, readdir } from 'fs/promises';
import { ConfigConst } from '@main/config/const';
import { join } from 'path';
import { Keys } from '@common/config/keys';
import { app, BrowserWindow, dialog } from 'electron';
import { ClientConfigurationType, ThemeType } from '@common/config';

const configPath = join(ConfigConst.ConfigDir, Keys.clientConfiguration);

export class ConfigStore {
  #config: ClientConfigurationType = {};
  themes: Array<ThemeType> = [];
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

  async scanThemes() {
    this.themes = [];

    const dir = await opendir(ConfigConst.ThemeDir);
    for await (const dirent of dir) {
      if (!dirent.isDirectory()) {
        continue;
      }

      const dirAbsolutePath = join(ConfigConst.ThemeDir, dirent.name);
      const themeFiles = await readdir(dirAbsolutePath);
      if (themeFiles.includes(Keys.themeConfiguration)) {
        this.themes.push({
          name: dirent.name,
          path: dirAbsolutePath,
        });
      }
    }
  }

  get config() {
    return this.#config;
  }

  sendToRender(window: BrowserWindow) {
    window.webContents.send('config-reload', this.#config);
  }
}
