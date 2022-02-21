import { ClientConfigurationType, Keys, ThemeConfigurationType, ThemeType } from '@common/config';
import { DeepPartial } from '@common/utils';
import type { ConfigConstType } from '@main/config/const';
import { Polyfill } from './polyfill';
const { callMain } = window.bridge;

export class Runtime {
  static clientConfig: ClientConfigurationType;
  static currentTheme: ThemeType & {
    config: ThemeConfigurationType;
  };

  static constants: ConfigConstType;
  static ready: Promise<void> = new Promise(() => {});
  static themes: ThemeType[];
  static polyfill = Polyfill;

  static async init() {
    const fullConfig = await callMain('get-configuration');
    Runtime.clientConfig = fullConfig.dynamic;
    Runtime.constants = fullConfig.constants;
    Runtime.themes = fullConfig.themes;
    Runtime.overrideLog();
    Runtime.ready = Promise.resolve();
  }

  static async loadTheme(theme: string) {
    const themePath = Runtime.themes.find(t => t.name === theme);
    if (!themePath) {
      return;
    }
    const path = await callMain('path-join', themePath.path, Keys.themeConfiguration);
    const themeConfig = await callMain('request-json-file', path);
    if (Runtime.validateTheme(themeConfig)) {
      Runtime.currentTheme = {
        ...themePath,
        config: themeConfig as ThemeConfigurationType,
      };
    }
  }

  static async loadThemeFile(path: string) {
    const absolutePath = await callMain('path-join', Runtime.currentTheme.path, path);
    return Runtime.polyfill.loadFile(absolutePath);
  }

  private static validateTheme(theme: unknown): boolean {
    const themeConfig = theme as DeepPartial<ThemeConfigurationType>;
    const missing = [] as string[];
    const invalid = [] as string[];

    if (!themeConfig.main) {
      missing.push('pages');
    } else {
      const pageMissing = [] as string[];
      if (!themeConfig.main.layout) {
        pageMissing.push('layout');
      }
      if (pageMissing.length) {
        invalid.push(`missing field ${pageMissing.join(', ')} in page main`);
      }
    }
    if (missing.length === 0 && invalid.length === 0) {
      return true;
    }

    let error = `Invalid ${Keys.themeConfiguration} file:\n`;
    if (missing.length) {
      error += `\tMissing fields: ${missing.join(', ')}\n`;
    }
    if (invalid.length) {
      error += `\tInvalid fields: \n${invalid.map(i => '\t\t' + i + '\n')}`;
    }

    console.log(error);
    return false;
  }

  private static async overrideLog() {
    const logger = window.bridge.logger;

    const loggerFunctions = ['warn', 'info', 'debug', 'error', 'log'] as const;
    loggerFunctions.forEach(level => {
      const originalLogger = console[level] as (...data: any) => void;
      console[level] = (...data: any) => {
        originalLogger(...data);
        logger[level](...data);
      };
    });
  }
}
