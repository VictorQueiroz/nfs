import { getInteger } from "cli-argument-helper/number";
import { logLevelEnvironmentVariableName } from "./config";

export const enum LogLevel {
  Verbose = 0,
  Info = 1,
  Warning = 2
}

/**
 * Logs the result of `fn` if the log level is at least `level`.
 *
 * The log level is determined by the value of the `NFS_LOG_LEVEL` environment
 * variable. If the variable is not set, this function does nothing.
 *
 * If the value of `NFS_LOG_LEVEL` is not an integer, this function will log an
 * error message and do nothing.
 *
 * @param {number} level - The log level to check.
 * @param {() => void} fn - A function that returns a value to log.
 */
export default function log(level: number, fn: () => void) {
  const untreatedValue = process.env[logLevelEnvironmentVariableName] ?? null;

  if (untreatedValue === null) {
    return;
  }

  const value = getInteger([untreatedValue], 0);

  if (value === null) {
    console.error(`Invalid value ${untreatedValue} for ${level},`);
    return;
  }

  if (value >= level) {
    fn();
  }
}

log.verbose = (fn: () => void) => log(LogLevel.Verbose, fn);
log.info = (fn: () => void) => log(LogLevel.Info, fn);
log.warning = (fn: () => void) => log(LogLevel.Warning, fn);
