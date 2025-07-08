import assert from "node:assert";
import environmentVariable from "./environmentVariable";

/**
 * The default root directory.
 *
 * The default root directory is the directory where all Node.js versions are installed.
 * The default root directory is determined as follows:
 *
 * - On macOS, the default root directory is `~/Library/Application Support/NFS`.
 * - On Linux, the default root directory is `$XDG_DATA_HOME/nfs` if `$XDG_DATA_HOME` is defined, otherwise it is `~/.nfs`.
 * - On Windows, the default root directory is `%APPDATA%\nfs`.
 *
 * @returns The default root directory.
 */
export default async function defaultRootDirectory() {
  const os = await import("node:os");
  const path = await import("node:path");
  const chalk = (await import("chalk")).default;

  let nfsDir = await environmentVariable("NFS_DIR");

  if (nfsDir === null) {
    const platform = os.platform();
    const home = await environmentVariable("HOME");
    switch (platform) {
      case "darwin":
        if (home !== null) {
          nfsDir = path.resolve(home, "Library", "Application Support", "NFS");
        }
        break;
      case "linux": {
        const xdgDataHome = await environmentVariable("XDG_DATA_HOME");
        if (xdgDataHome !== null) {
          nfsDir = path.resolve(xdgDataHome, "nfs");
        } else if (home !== null) {
          nfsDir = path.resolve(home, ".nfs");
        }
        break;
      }
      case "win32": {
        const appData = await environmentVariable("APPDATA");
        if (appData !== null) {
          nfsDir = path.resolve(appData, "nfs");
        }
        break;
      }
      case "aix":
      case "android":
      case "freebsd":
      case "haiku":
      case "openbsd":
      case "sunos":
      case "cygwin":
      case "netbsd":
        console.error(`Platform "${platform}" is not supported`);
        break;
    }
  }

  assert.strict.ok(
    nfsDir !== null,
    chalk.red(
      "Failed to automatically determine the default root directory. " +
        "Please set the environment variable NFS_DIR to the desired root directory."
    )
  );

  return nfsDir;
}
