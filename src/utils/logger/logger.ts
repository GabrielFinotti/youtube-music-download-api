import pino from 'pino';
import EnvConfig from '../config/envConfig';

class Logger {
  private static instance: pino.Logger;

  private constructor() {}

  static getInstance(): pino.Logger {
    if (!Logger.instance) {
      const logLevel = this.getLogLevel();
      const envInstance = EnvConfig.getInstance();
      const isDevelopment = envInstance.NODE_ENV === 'development';

      const baseConfig: pino.LoggerOptions = {
        level: logLevel,
        formatters: {
          level: label => {
            return { level: label };
          },
        },
        timestamp: () => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          return `,"time":"${day}/${month}/${year} ${hours}:${minutes}:${seconds}"`;
        },
        base: undefined,
      };

      if (isDevelopment) {
        baseConfig.transport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname,env,version,context',
            singleLine: false,
            messageFormat: '{if context}[{context}] {end}{msg}',
            sync: true,
            customPrettifiers: {},
          },
        };
      }

      Logger.instance = pino(baseConfig);
    }

    return Logger.instance;
  }

  private static getLogLevel(): string {
    const envInstance = EnvConfig.getInstance();

    if (envInstance.LOG_LEVEL) {
      return envInstance.LOG_LEVEL;
    }

    return envInstance.NODE_ENV === 'development' ? 'debug' : 'info';
  }

  static createChildLogger(context: string): pino.Logger {
    return Logger.getInstance().child({ context });
  }
}

export default Logger;
