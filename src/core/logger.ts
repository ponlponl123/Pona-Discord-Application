import { prefix as consolePrefix, type as consoleType } from '@config/console';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

class Logger {
  private formatMessage(level: LogLevel, prefix: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `\x1b[2m${timestamp}\x1b[0m ${consoleType[level as keyof typeof consoleType] || ''} ${prefix} ${message}`;
  }

  public info(prefix: string, message: string) {
    console.log(this.formatMessage(LogLevel.INFO, prefix, message));
  }

  public warn(prefix: string, message: string) {
    console.warn(this.formatMessage(LogLevel.WARN, prefix, message));
  }

  public error(prefix: string, message: string, error?: unknown) {
    console.error(this.formatMessage(LogLevel.ERROR, prefix, message));
    if (error) console.error(error);
  }

  public debug(prefix: string, message: string) {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_MODE === 'true') {
      console.log(this.formatMessage(LogLevel.DEBUG, prefix, message));
    }
  }
}

export const logger = new Logger();
export default logger;
