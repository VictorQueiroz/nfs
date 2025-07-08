import asyncStreamWrite from "./asyncStreamWrite";
import log from "./log";

/**
 * Gets the value of the environment variable with the given key.
 * If the environment variable doesn't exist, it returns `null`.
 *
 * @param key The key of the environment variable to get.
 *
 * @returns The value of the environment variable, or `null`.
 */
export default async function environmentVariable(key: string): Promise<string | null> {
  const process = await import("node:process");
  const chalk = (await import("chalk")).default;
  const value = process.env[key] ?? null;

  await log.trace(() =>
    asyncStreamWrite(
      process.stdout,
      `Getting environment variable "${chalk.green(key)}": ${chalk.cyan(value)}`
    )
  );

  return value;
}
