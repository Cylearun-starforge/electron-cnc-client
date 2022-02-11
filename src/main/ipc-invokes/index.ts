import { ConfigConst } from '@main/config/const';
import { ConfigStore } from '@main/config/store';
import { MainWindow } from '@main/windows';
import { app, dialog, ipcMain, IpcMainInvokeEvent } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import postcss, { Plugin } from 'postcss';
import { readFileSync } from 'fs';
const set = new Set<string>();
const plugin: Plugin = {
  postcssPlugin: 'postcss-poly',
  Declaration(decl) {
    if (decl.value.includes('url')) {
      const url = decl.value.slice(4, -1).replace('"', '').replace('"', '');
      if (set.has(url)) {
        return;
      }
      const fullPath = join(ConfigConst.ThemeDir, ConfigStore.Instance.config.defaultTheme ?? '', url);
      if (process.env.NODE_ENV !== 'development') {
        // CSS only support '/'
        decl.value = `url(${fullPath.replace(/\\/g, '/')})`;
        set.add(fullPath.replace(/\\/g, '/'));
        return;
      }
      const content = readFileSync(fullPath);
      decl.value = `url("data:application/octet-stream;base64,${content.toString('base64')}")`;
      set.add(`data:application/octet-stream;base64,${content.toString('base64')}`);
    }
  },
  AtRule(r) {
    if (r.name === 'import') {
      console.log('import', r);
    }
  },
};

export const Invocable = {
  'request-local-file': async (event: IpcMainInvokeEvent, path: string) => {
    return readFile(path);
  },
  'get-configuration': async (event: IpcMainInvokeEvent) => {
    const config = ConfigStore.Instance.config;
    const constants = ConfigConst;
    return {
      constants,
      dynamic: config,
    };
  },
  'path-join': async (event: IpcMainInvokeEvent, ...path: string[]) => {
    return join(...path);
  },
  'close-app-on-error': async (event: IpcMainInvokeEvent, error: string, message: string) => {
    MainWindow.Instance.destroy();
    dialog.showErrorBox(error, message);
    app.quit();
  },
  'open-in-explorer': async (event: IpcMainInvokeEvent, path: string) => {
    exec(`explorer.exe ${path}`);
  },
  'process-css': async (event: IpcMainInvokeEvent, path: string) => {
    const data = await readFile(path);
    const decoder = new TextDecoder();
    const content = decoder.decode(data);
    const processor = postcss().use(plugin);
    const result = await processor.process(content, { from: undefined });
    return result.css;
  },
};

export default function registerAll() {
  for (const channel in Invocable) {
    // @ts-ignore
    ipcMain.handle(channel, Invocable[channel]);
  }
}
