import assert from "node:assert";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import {
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation,
} from "../schema/0.0.1/main.jsb";
import persistentDirectoryData from "./persistentDirectoryData";
import defaults from "./config";
import getNodeInstallInformation from "./getNodeInstallInformation";

export default async function getInstallationEnvironmentVariables(
  args: string[],
) {
  const process = await import("node:process");
  const path = await import("node:path");

  let { PATH, MANPATH } = process.env;

  const transformedEnvironmentVariables = {
    PATH: [...(PATH?.split(":") ?? [])],
    MANPATH: [...(MANPATH?.split(":") ?? [])],
  };

  const nfsInstallInfo =
    await persistentLocalInstallationInformation().decode(null);

  assert.strict.ok(
    nfsInstallInfo !== null,
    `Failed to decode installation information`,
  );

  // Remove old prefixes from environment variables
  for (const [, value] of Object.entries(transformedEnvironmentVariables)) {
    for (const prefix of nfsInstallInfo.rootDirectories) {
      for (let i = 0; i < value.length; i++) {
        const environmentVariableItem = value[i] ?? null;
        assert.strict.ok(
          environmentVariableItem !== null,
          `Environment variable item is null`,
        );
        if (environmentVariableItem.startsWith(prefix)) {
          value.splice(i, 1);
          i--;
        }
      }
    }
  }

  const targetInstallInformation = getNodeInstallInformation({
    args,
    rootDirectory: defaults.rootDirectory,
  });

  const existingInstallInfoHandle = await persistentDirectoryData(
    targetInstallInformation.prefixDirectory,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation,
  ).decode(null);

  if (existingInstallInfoHandle === null) {
    console.error(
      `No installation found for ${targetInstallInformation.version}`,
    );
    process.exitCode = 1;
    return true;
  }

  // Add new values
  transformedEnvironmentVariables.PATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "bin"),
  );

  transformedEnvironmentVariables.MANPATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "share/man"),
  );
  return {
    PATH: transformedEnvironmentVariables.PATH.join(":"),
    MANPATH: transformedEnvironmentVariables.MANPATH.join(":"),
  };
}
