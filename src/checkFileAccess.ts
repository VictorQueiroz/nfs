import log, { LogLevel } from "./log";

export default async function checkFileAccess(location: string, mode: number) {
  const path = await import("node:path");
  const fs = await import("node:fs");

  if (!path.isAbsolute(location)) {
    throw new Error(`"${location}" is not an absolute path`);
  }

  try {
    await fs.promises.access(location, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    log(LogLevel.Verbose, () => {
      console.error('Failed to access "%s" (mode: %o): %o', location, mode, err);
    });
    return false;
  }

  return true;
}
