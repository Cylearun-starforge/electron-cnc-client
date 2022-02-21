// https://github.com/modern-js-dev/electron-sprout/blob/main/packages/electron-log/src/index.ts
import electronLog, { ElectronLog, Format } from 'electron-log';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const formatLog: Format = logMsg => {
  const msgPrefix = `[${logMsg.level}] > `;
  const msgContent = logMsg.data.join('');
  const dateContent = `[${dayjs(logMsg.date).format(DATE_FORMAT)}]`;
  return dateContent + msgPrefix + msgContent;
};

const formatAllLogs = (log: ElectronLog) => {
  log.transports.console.format = formatLog;
  log.transports.file.format = formatLog;
};

const initLabel = (log: ElectronLog) => {
  log.variables.label = 'scope';
};

const disableLog = (log: ElectronLog) => {
  // only show errors
  log.transports.console.level = 'error';
};

const disableIpcLog = (log: ElectronLog) => {
  if (log.transports.ipc) {
    log.transports.ipc.level = false;
  }
};

export function createLogger(name: string) {
  const logger = electronLog.create(name);
  formatAllLogs(logger);
  initLabel(logger);
  disableLog(logger);
  disableIpcLog(logger);
  return logger;
}
