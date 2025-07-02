import assert from "node:assert";
import { ChangeObject } from "diff";
import nativeCompiler, { CompilerLanguageType } from "../../nativeCompiler";
import nodeInstallationPrefixDirectory from "../../nodeInstallationPrefixDirectory";

export interface IInstallNodeVersionParams {
  rootDirectory: string;
  version: string;
  clean: boolean;
  jobs: number;
  install: boolean;
  name: string;
  configure: { arguments: string[] } | null;
}

export default async function installNodeVersion({
  jobs,
  name,
  rootDirectory,
  configure,
  install,
  version,
  clean
}: IInstallNodeVersionParams) {
  const path = await import("node:path");
  const console = await import("node:console");
  const fs = await import("node:fs");
  const { spawn } = await import("@high-nodejs/child_process");
  const downloadSourceCode = (await import("../../downloadSourceCode")).default;
  const createEnvironmentVariables = (await import("../../createEnvironmentVariables")).default;
  const {
    decodeNodeVersionInstallationInformation,
    encodeNodeVersionInstallationInformation,
    NodeVersionInstallationInformationReference,
    updateNodeVersionInstallationInformation,
    compareNodeVersionInstallationInformation,
    NodeVersionInstallationBuildInformation,
    NodeVersionInstallationInformation
  } = await import("../../../schema/0.0.1/main.jsb");
  const persistentDirectoryData = (await import("../../persistentDirectoryData")).default;

  const installInformation = persistentDirectoryData(
    nodeInstallationPrefixDirectory({ rootDirectory, version, name }).prefixDirectory,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation
  );

  const { prefixDirectory } = nodeInstallationPrefixDirectory({ rootDirectory, version, name });

  const { extractedArchiveFolder } = await downloadSourceCode({ version, prefixDirectory });

  const configureArgs = configure?.arguments ?? [
    // "--enable-asan",
    // "--enable-ubsan",
    // "--enable-lto",
    // "--without-node-code-cache",
    // "--v8-with-dchecks",
    // "--v8-enable-object-print",
    "--prefix",
    prefixDirectory,
    "--debug",
    "--debug-node",
    "--use-prefix-to-find-headers",
    "--debug-lib",
    "--ninja",
    "--download=all",
    "--v8-non-optimized-debug"
  ];

  let needsBuildConfiguration: boolean;

  try {
    await fs.promises.access(
      path.resolve(extractedArchiveFolder, "out"),
      fs.constants.R_OK | fs.constants.W_OK
    );

    needsBuildConfiguration = false;
  } catch (reason) {
    console.error('Failed to access "%s": %o', extractedArchiveFolder, reason);
    needsBuildConfiguration = true;
  }

  const decodedNodeVersionInstallInformation = NodeVersionInstallationInformation({
    id: NodeVersionInstallationInformationReference({ version, name }),
    location: prefixDirectory,
    buildInformation: NodeVersionInstallationBuildInformation({
      configureArguments: configureArgs,
      location: extractedArchiveFolder
    })
  });

  let info = await installInformation.decode(decodedNodeVersionInstallInformation);

  assert.strict.ok(
    info !== null,
    `Failed to decode Node.js installation information for version ${version} and name ${name}`
  );

  // If configuration is already needed, we can skip this check
  if (
    !needsBuildConfiguration &&
    !compareNodeVersionInstallationInformation(info, decodedNodeVersionInstallInformation)
  ) {
    const diff = await import("diff");
    const chalk = (await import("chalk")).default;

    console.warn(
      "Configuration of Node.js installation for version %s and name %s is outdated....",
      version,
      name
    );
    console.log();

    const objectChanges = await (async (info) =>
      new Promise<ChangeObject<string>[]>((resolve) =>
        diff.diffJson(
          // Default info contains the new build configure arguments.
          decodedNodeVersionInstallInformation,
          info,
          {
            callback: (result) => {
              resolve(result);
            }
          }
        )
      ))(info);

    for (const change of objectChanges) {
      if (change.added) {
        console.log(chalk.green("+ %s"), change.value);
      } else if (change.removed) {
        console.log(chalk.red("- %s"), change.value);
      } else {
        console.log("%s", change.value);
      }
    }

    needsBuildConfiguration = true;
  }

  const environmentVariables = createEnvironmentVariables({
    ...process.env,
    CC: ["ccache", (await nativeCompiler(CompilerLanguageType.C)).executable],
    CXX: ["ccache", (await nativeCompiler(CompilerLanguageType.CXX)).executable]
  });

  if (clean) {
    await spawn("make", ["clean"], { log: true, cwd: extractedArchiveFolder }).wait();
  }

  if (configure !== null || needsBuildConfiguration) {
    await spawn(path.resolve(extractedArchiveFolder, "configure"), configureArgs, {
      log: true,
      cwd: extractedArchiveFolder,
      env: environmentVariables
    }).wait();

    info = await installInformation.encode(
      updateNodeVersionInstallationInformation(info, decodedNodeVersionInstallInformation)
    );
  }

  await spawn("make", ["VERBOSE=1", "--jobs", `${jobs}`], {
    log: true,
    env: environmentVariables,
    cwd: extractedArchiveFolder
  }).wait();

  if (install) {
    await spawn("make", ["install"], {
      env: environmentVariables,
      cwd: extractedArchiveFolder
    }).wait();
  }
}
