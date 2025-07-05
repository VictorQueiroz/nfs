import path from "node:path";
import assert from "node:assert";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import persistentDirectoryData from "./persistentDirectoryData";
import type { NodeVersionInstallationInformation } from "../schema/0.0.1/main.jsb";
import checkFileAccess from "./checkFileAccess";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

/**
 * Finds all Node.js versions installed under the root directory that match the provided version
 * and environment name.
 * @param rootDirectory The root directory to search for Node.js versions in.
 * @param environmentInfo The environment information to filter versions by.
 * @returns A set of all matching Node.js versions. If no matching versions are found, an empty set
 * is returned.
 */
export default async function findNodeInstallInformation(
  rootDirectory: string,
  { version, environmentName }: IInputNodeEnvironmentInformation
) {
  const semver = await import("semver");
  const fs = await import("node:fs");
  const { decodeNodeVersionInstallationInformation, encodeNodeVersionInstallationInformation } =
    await import("../schema/0.0.1/main.jsb");

  const installedVersionMatches = new Set<NodeVersionInstallationInformation>();

  const nfsInstallInfo = await persistentLocalInstallationInformation(rootDirectory).decode(null);

  assert.strict.ok(nfsInstallInfo !== null, `Failed to decode installation information`);

  // Find a version that intersects with the specified version
  for (const prefixDirectory of Array.from(nfsInstallInfo.installRootDirectories)) {
    if (!(await checkFileAccess(prefixDirectory, fs.constants.R_OK | fs.constants.W_OK))) {
      continue;
    }
    for await (const versionRootDirectory of fs.promises.glob([
      path.resolve(prefixDirectory, "*/*")
    ])) {
      // const installDirectory = path.resolve(prefixDirectory, directoryName);

      if (
        !(await checkFileAccess(
          path.resolve(versionRootDirectory, "data.bin"),
          fs.constants.R_OK | fs.constants.W_OK
        ))
      ) {
        continue;
      }

      const versionInfo = await persistentDirectoryData(
        versionRootDirectory,
        encodeNodeVersionInstallationInformation,
        decodeNodeVersionInstallationInformation
      ).decode(null);

      if (versionInfo === null) {
        continue;
      }

      const versionInfoId = versionInfo.id;

      // If environment name is present, expect it to match
      if (environmentName !== null && versionInfoId.name !== environmentName) {
        continue;
      }

      // Check if the provided version matches
      if (version !== null && !semver.intersects(version, versionInfoId.version)) {
        continue;
      }

      installedVersionMatches.add(versionInfo);
    }
  }

  return installedVersionMatches;
}
