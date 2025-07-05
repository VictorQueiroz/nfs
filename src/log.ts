import { getInteger } from "cli-argument-helper/number";
import { logLevelEnvironmentVariableName } from "./config";

export const enum LogLevel {
  Verbose = 0,
  Info = 1,
  Warning = 2
}

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
