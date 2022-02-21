import { createLogger } from '@common/utils/create-logger';
import { ConfigConst } from '@main/config/const';
import { join } from 'path';

export const log = createLogger('main');

export const initLogger = async () => {
  log.transports.console.level = 'silly';
  log.transports.file.resolvePath = () => join(ConfigConst.logDir, 'main.log');
  log.transports.file.level = ConfigConst.env === 'development' ? 'debug' : 'warn';
  console.log = log.log;
  console.error = log.error;
  console.warn = log.warn;
  console.debug = log.debug;
  console.info = log.info;
};
