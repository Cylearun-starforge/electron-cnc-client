import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { pathToFileURL } from 'url';
import { join } from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';
const preload = join(__dirname, 'preload.js');

export class MainWindow extends BrowserWindow {
  static canShow: Promise<void>;

  static #instance: MainWindow;
  static get Instance() {
    return MainWindow.#instance;
  }

  static create(options: Omit<BrowserWindowConstructorOptions, 'webPreferences'>) {
    if (!MainWindow.#instance) {
      MainWindow.#instance = new MainWindow(options);
    }
    return MainWindow.#instance;
  }

  private constructor(options: Omit<BrowserWindowConstructorOptions, 'webPreferences'>) {
    super({
      ...options,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload,
        // devTools: isDevelopment,
      },
      show: false,
    });
    const loadUrl = isDevelopment
      ? 'http://localhost:3000'
      : pathToFileURL(join(__dirname, './renderer/index.html')).toString();

    MainWindow.canShow = new Promise<void>(res => {
      this.once('ready-to-show', () => {
        res();
      });
    });

    (async () => {
      await this.loadURL(loadUrl);

      // if (isDevelopment) {
        this.webContents.toggleDevTools();
      // }
    })();
  }
}
