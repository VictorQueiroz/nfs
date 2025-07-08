import { getInteger } from "cli-argument-helper/number";
import { logLevelEnvironmentVariableName } from "./config";

/**
 * LogLevel follows the RFC 5424 severity level semantics:
 * Lower numeric values indicate higher severity.
 * Comparison logic uses: `messageLevel <= configuredLevel`
 */
export const enum LogLevel {
  /**
   * System is unusable — application is expected to terminate immediately.
   * RFC 5424 Level 0: Emergency
   */
  Fatal = 0,

  /**
   * Critical conditions requiring immediate attention.
   * RFC 5424 Level 1: Alert
   */
  Error = 1,

  /**
   * Runtime errors that do not require immediate action.
   * RFC 5424 Level 2: Critical / 3: Error
   */
  Warning = 2,

  /**
   * Normal but significant condition — runtime notices.
   * RFC 5424 Level 4: Warning
   */
  Notice = 3,

  /**
   * Informational messages reflecting routine operations.
   * RFC 5424 Level 6: Informational
   */
  Information = 4,

  /**
   * Developer-focused messages used for debugging.
   * RFC 5424 Level 7: Debug
   */
  Debug = 5,

  /**
   * Extended execution context — very verbose.
   * Not part of RFC 5424 but often useful.
   */
  Trace = 6
}

export type LogCallback<T extends unknown[] = [], R = void> = (...args: T) => R;

/**
 * Logs a message if the environment variable {@link logLevelEnvironmentVariableName} value
 * is at least as verbose as the provided {@link LogLevel}.
 *
 * @param level The log level to compare against the environment variable.
 * @param fn The function to call if the log level is high enough.
 * @returns The value returned by `fn` if the log level is high enough, or `null` if not.
 */
export default function log<T = null>(level: LogLevel, fn: LogCallback<[], T>): T | null {
  const untreatedValue = process.env[logLevelEnvironmentVariableName] ?? null;

  const value =
    (untreatedValue !== null ? getInteger([untreatedValue], 0) : null) ??
    // Fatal errors are logged by default if no value is provided
    LogLevel.Fatal;

  if (value >= level) {
    return fn();
  }

  return null;
}

function bind(level: LogLevel) {
  return <T>(fn: () => T): T | null => log<T>(level, fn);
}

log.info = bind(LogLevel.Information);
log.warning = bind(LogLevel.Warning);
log.error = bind(LogLevel.Error);
log.debug = bind(LogLevel.Debug);
log.trace = bind(LogLevel.Trace);
log.notice = bind(LogLevel.Notice);

/**
 * If the assertion is falsy, logs a message with the highest severity
 * (LogLevel.Fatal) and calls process.exit(1).
 *
 * This is a convenience function to log a fatal error and exit,
 * without having to manually check the assertion and log the error.
 *
 * @param assertion The assertion to check.
 * @param fn The log function to call if the assertion is falsy.
 * @returns An assertion that the assertion is truthy.
 */
log.fatal = function (assertion: boolean, fn: LogCallback<[], void>): asserts assertion {
  if (assertion) {
    return;
  }

  log(LogLevel.Fatal, fn);

  process.exit(1);
};
