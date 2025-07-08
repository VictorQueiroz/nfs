import Exception from "./Exception";

/**
 * Searches for a command in the PATH environment variable.
 *
 * @param {string} cmd - The command to search for.
 * @returns {Promise<string>} The absolute path to the command.
 * @throws {Exception} If the command is not found in the PATH.
 */
export default async function which(cmd: string): Promise<string> {
  const environmentVariable = (await import("./environmentVariable")).default;
  const PATH = await environmentVariable("PATH");

  if (PATH === null) {
    throw new Exception("PATH environment variable is not set");
  }

  const path = await import("node:path");
  const fs = await import("node:fs");
  const checkFileAccess = (await import("./checkFileAccess")).default;

  const { delimiter } = path;
  const pathList = PATH.split(delimiter);

  for (const dir of pathList) {
    const absolutePath = path.resolve(dir, cmd);
    if (!(await checkFileAccess(absolutePath, fs.constants.R_OK | fs.constants.X_OK))) {
      continue;
    }
    return absolutePath;
  }

  throw new Exception(`Command "${cmd}" not found in PATH`);
}
