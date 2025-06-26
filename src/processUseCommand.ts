import { getArgument } from "cli-argument-helper";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import assert from "node:assert";
import defaults from "./config";
import persistentDirectoryData from "./persistentDirectoryData";
import getNodeInstallInformation from "./getNodeInstallInformation";

export default async function processUseCommand(args: string[]) {
  const containsUseCommand = getArgument(args, "use");

  if (containsUseCommand === null) {
    return false;
  }

  const process = await import("node:process");
  const path = await import("node:path");
  const {
    decodeNodeVersionInstallationInformation,
    encodeNodeVersionInstallationInformation,
  } = await import("../schema/0.0.1/main.jsb");

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
    overrideProperties: null,
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

  const { TextStream } = await import("@textstream/core");
  const stream = await import("node:stream");

  const cs = new TextStream();

  for (const [key, value] of Object.entries(transformedEnvironmentVariables)) {
    cs.write(`${key}=${value.join(":")}\n`);
  }

  await stream.promises.pipeline(
    stream.PassThrough.from([new TextEncoder().encode(cs.value())]),
    process.stdout,
  );

  return true;
}
