import environmentVariable from "./environmentVariable";
import log, { LogLevel } from "./log";

export default async function which(cmd: string) {
  const PATH = environmentVariable("PATH");

  if (PATH === null) {
    throw new Error("PATH environment variable is not set");
  }

  const path = await import("node:path");
  const fs = await import("node:fs");

  const { delimiter } = path;
  const pathList = PATH.split(delimiter);

  for (const dir of pathList) {
    const absolutePath = path.resolve(dir, cmd);
    try {
      await fs.promises.access(absolutePath, fs.constants.X_OK);

      return absolutePath;
    } catch (err) {
      log(LogLevel.Verbose, () => {
        console.error('Failed to access "%s": %o', absolutePath, err);
      });
    }
  }

  throw new Error(`Command "${cmd}" not found in PATH`);
}
