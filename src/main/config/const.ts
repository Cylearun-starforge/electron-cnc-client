import { join } from 'path';
import { Keys } from '@common/config/keys';
import dayjs from 'dayjs';

const clientDir = join(__dirname, process.env.CC_CLIENT_CONFIG ?? '../..');
const themeDir = join(clientDir, Keys.ThemesDir);
const logDir = join(clientDir, 'log', dayjs().format('YYYY-MM-DD_HH-mm-ss'));
export const ConfigConst = {
  clientDir,
  themeDir,
  logDir,
  env: process.env.NODE_ENV === 'development' ? ('development' as const) : ('production' as const),
};

export type ConfigConstType = typeof ConfigConst;
