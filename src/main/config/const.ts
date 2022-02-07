import { join } from 'path';

const ClientConfigName = 'ClientConfiguration.json';

const ConfigDir = join(__dirname, process.env.CC_CLIENT_CONFIG ?? '..');

export const ConfigConst = {
  ClientConfigName,
  ConfigDir,
};