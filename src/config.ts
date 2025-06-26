import path from "node:path";
import process from "node:process";
import os from "node:os";

let defaultRootDirectory: string | null = null;

const nfsDir = process.env["NFS_DIR"] ?? null;

if (nfsDir !== null) {
  defaultRootDirectory = nfsDir;
} else {
  const platform = os.platform();
  const home = process.env["HOME"] ?? null;
  switch (platform) {
    case "darwin":
      if (home !== null) {
        defaultRootDirectory = path.resolve(
          home,
          "Library",
          "Application Support",
          "nfs",
        );
      }
      break;
    case "linux": {
      const xdgDataHome = process.env["XDG_DATA_HOME"] ?? null;
      if (xdgDataHome !== null) {
        defaultRootDirectory = path.resolve(xdgDataHome, "nfs");
      } else if (home !== null) {
        defaultRootDirectory = path.resolve(home, ".nfs");
      }
      break;
    }
    case "win32": {
      const appData = process.env["APPDATA"] ?? null;
      if (appData !== null) {
        defaultRootDirectory = path.resolve(appData, "nfs");
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
      process.exitCode = 1;
      break;
  }
}

const defaults: {
  /**
   * The root directory for Node.js installations.
   */
  rootDirectory: string;
} = {
  rootDirectory:
    defaultRootDirectory ?? path.resolve(__dirname, "../installed"),
};

export default defaults;
