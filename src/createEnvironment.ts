import assert from "node:assert";
import {
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation,
  NodeFromScratchInstallationInformation,
  updateNodeFromScratchInstallationInformation,
} from "../schema/0.0.1/main.jsb";
import defaults from "./config";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import getIndexBasedArgumentSequence from "./getIndexBasedArgumentSequence";
import getNodeInstallInformation from "./getNodeInstallInformation";
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getInteger } from "cli-argument-helper/number";
import persistentDirectoryData from "./persistentDirectoryData";
import { getArgument } from "cli-argument-helper";
import installNodeVersion from "./installNodeVersion";

interface ICreateEnvironmentParams {
  args: string[];
  rootDirectory: string;
}

export default async function createEnvironment(
  params: ICreateEnvironmentParams,
) {
  const fs = await import("node:fs");
  const { args, rootDirectory } = params;

  const inputInstallInformation = getNodeInstallInformation({
    args,
    rootDirectory,
    overrideProperties: null,
  });

  const installationInfoHandle = persistentLocalInstallationInformation();

  let installInfo = await installationInfoHandle.decode(
    NodeFromScratchInstallationInformation({
      date: Date.now(),
      rootDirectories: new Set([defaults.rootDirectory, rootDirectory]),
    }),
  );

  assert.strict.ok(
    installInfo !== null,
    `Failed to decode installation information`,
  );

  installInfo = await installationInfoHandle.encode(
    updateNodeFromScratchInstallationInformation(installInfo, {
      rootDirectories: new Set([...installInfo.rootDirectories, rootDirectory]),
    }),
  );

  await fs.promises.mkdir(inputInstallInformation.prefixDirectory, {
    recursive: true,
  });

  const configureArguments = getIndexBasedArgumentSequence(
    args,
    "--configure",
    ";",
  );

  const jobs =
    getArgumentAssignment(args, "--jobs", getInteger) ??
    getArgumentAssignment(args, "-j", getInteger) ??
    1;
  const installInformation = persistentDirectoryData(
    inputInstallInformation.prefixDirectory,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation,
  );

  const clean = getArgument(args, "--clean") !== null;

  if (getArgument(args, "--install") !== null) {
    const { prefixDirectory, version, name } = inputInstallInformation;
    await installNodeVersion({
      prefixDirectory,
      version,
      name,
      clean,
      installInformation,
      configure:
        configureArguments !== null ? { arguments: configureArguments } : null,
      jobs,
    });
  }
}
