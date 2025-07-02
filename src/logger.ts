import { getInteger } from "cli-argument-helper/number";
import { logLevelEnvironmentVariableName } from "./config";

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
