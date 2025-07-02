import assert from "node:assert";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import {
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation
} from "../schema/0.0.1/main.jsb";
import persistentDirectoryData from "./persistentDirectoryData";
import findNodeInstallInformation from "./findNodeInstallInformation";

export default async function getInstallationEnvironmentVariables(
  rootDirectory: string,
  environmentInfo: { version: string | null; environmentName: string | null }
) {
  const process = await import("node:process");
  const path = await import("node:path");

  const { PATH = null, MANPATH = null } = process.env;

  const transformedEnvironmentVariables = {
    PATH: [...(PATH?.split(":") ?? [])],
    MANPATH: [...(MANPATH?.split(":") ?? [])]
  };

  const nfsInstallInfo = await persistentLocalInstallationInformation(rootDirectory).decode(null);

  assert.strict.ok(nfsInstallInfo !== null, `Failed to decode installation information`);

  // Remove old prefixes from environment variables
  for (const [, value] of Object.entries(transformedEnvironmentVariables)) {
    for (const prefix of nfsInstallInfo.installRootDirectories) {
      for (let i = 0; i < value.length; i++) {
        const environmentVariableItem = value[i] ?? null;
        assert.strict.ok(environmentVariableItem !== null, `Environment variable item is null`);
        if (environmentVariableItem.startsWith(prefix)) {
          value.splice(i, 1);
          i--;
        }
      }
    }
  }

  const targetInstallInformationList = await findNodeInstallInformation(
    rootDirectory,
    environmentInfo
  );

  if (
    targetInstallInformationList.size === 0 ||
    // The arguments match more than one version
    targetInstallInformationList.size > 1
  ) {
    return null;
  }

  const [targetInstallInformation = null] = Array.from(targetInstallInformationList);

  if (targetInstallInformation === null) {
    return null;
  }

  const existingInstallInfoHandle = await persistentDirectoryData(
    targetInstallInformation.location,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation
  ).decode(null);

  if (existingInstallInfoHandle === null) {
    console.error(`No installation found for ${targetInstallInformation.id.version}`);
    process.exitCode = 1;
    return null;
  }

  // Add new values
  transformedEnvironmentVariables.PATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "bin")
  );

  transformedEnvironmentVariables.MANPATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "share/man")
  );
  return {
    PATH: transformedEnvironmentVariables.PATH.join(":"),
    MANPATH: transformedEnvironmentVariables.MANPATH.join(":")
  };
}
