import path from "node:path";
import assert from "node:assert";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import persistentDirectoryData from "./persistentDirectoryData";
import {
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation,
  NodeVersionInstallationInformation
} from "../schema/0.0.1/main.jsb";

export interface IFindNodeInstallInformationParams {
  version: string | null;
  environmentName: string | null;
}

export default async function findNodeInstallInformation(
  rootDirectory: string,
  { version, environmentName }: IFindNodeInstallInformationParams
) {
  const semver = await import("semver");
  const fs = await import("node:fs");

  const installedVersionMatches = new Set<NodeVersionInstallationInformation>();

  const nfsInstallInfo = await persistentLocalInstallationInformation(rootDirectory).decode(null);

  assert.strict.ok(nfsInstallInfo !== null, `Failed to decode installation information`);

  // Find a version that intersects with the specified version
  for (const prefixDirectory of Array.from(nfsInstallInfo.installRootDirectories)) {
    try {
      await fs.promises.access(prefixDirectory, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      console.error('Failed to access "%s": %o', prefixDirectory, err);
      continue;
    }
    for await (const versionRootDirectory of fs.promises.glob([
      path.resolve(prefixDirectory, "*/*")
    ])) {
      // const installDirectory = path.resolve(prefixDirectory, directoryName);

      try {
        await fs.promises.access(
          path.resolve(versionRootDirectory, "data.bin"),
          fs.constants.R_OK | fs.constants.W_OK
        );
      } catch (reason) {
        console.error('Failed to access "%s": %o', versionRootDirectory, reason);
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
