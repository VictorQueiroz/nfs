import log from "./log";

/**
 * Check if a file can be accessed with the given mode.
 *
 * @param {string} location - The absolute path to the file to check.
 * @param {number} mode - A file access mode (e.g., `fs.constants.F_OK`).
 *
 * @returns {Promise<boolean>} `true` if the file can be accessed, `false` if not.
 */
export default async function checkFileAccess(location: string, mode: number): Promise<boolean> {
  const path = await import("node:path");
  const fs = await import("node:fs");

  if (!path.isAbsolute(location)) {
    throw new Error(`"${location}" is not an absolute path`);
  }

  try {
    await fs.promises.access(location, mode);
  } catch (err) {
    log.trace(() => {
      console.error('Failed to access "%s" (mode: %o): %o', location, mode, err);
    });
    return false;
  }

  return true;
}
