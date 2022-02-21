import { ConfigConst } from '@main/config/const';
import { ConfigStore } from '@main/config/store';
import { join } from 'path';
import { Plugin } from 'postcss';
import { readFileSync } from 'fs';

const set = new Set<string>();

export const plugin: Plugin = {
  postcssPlugin: 'postcss-ecc-modify',
  Once(root) {
    set.clear();
  },
  // Transform url to absolute path(in production mode) or data url(in development mode)
  Declaration(decl) {
    if (decl.value.includes('url')) {
      const url = decl.value.slice(4, -1).replace('"', '').replace('"', '');
      if (set.has(url)) {
        return;
      }

      const fullPath = join(ConfigConst.themeDir, ConfigStore.Instance.config.defaultTheme ?? '', url);
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
    // Forbidden import
    if (r.name === 'import') {
      r.remove()
    }
  },
};
