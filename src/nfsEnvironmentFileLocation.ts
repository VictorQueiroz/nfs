import path from "node:path";
import defaults from "./config";

/**
 * Computes the location of the NFS environment file.
 *
 * The NFS environment file is a file that contains a shell script that sets
 * environment variables for the current shell session. It is used by the
 * `nfs use` command to set the environment variables.
 *
 * @param rootDirectory The root directory where all the Node.js versions are
 * installed.
 *
 * @returns The location of the NFS environment file.
 */
export default function nfsEnvironmentFileLocation(rootDirectory: string) {
  return path.resolve(rootDirectory, defaults.nfsEnvironmentFileName);
}
