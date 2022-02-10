import { join } from 'path';
import { Keys } from '@common/config/keys';


const ConfigDir = join(__dirname, process.env.CC_CLIENT_CONFIG ?? '../..');

export const ConfigConst = {
  ConfigDir,
  ThemeDir: join(ConfigDir, Keys.ThemesDir),
};

export type ConfigConstType = typeof ConfigConst;