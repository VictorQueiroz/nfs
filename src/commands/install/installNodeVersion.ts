import assert from "node:assert";
import { ChangeObject } from "diff";
import nativeCompiler, { CompilerLanguageType } from "../../nativeCompiler";
import nodeInstallationPrefixDirectory from "../../nodeInstallationPrefixDirectory";
import checkFileAccess from "../../checkFileAccess";

export interface IInstallNodeVersionParams {
  rootDirectory: string;
  version: string;
  clean: boolean;
  jobs: number;
  install: boolean | null;
  reconfigure: boolean;
  name: string;
  /**
   * Keep source code after a successful installation
   */
  keep: boolean;
  configure: { arguments: string[] } | null;
}

export default async function installNodeVersion(params: IInstallNodeVersionParams) {
  const { keep, jobs, reconfigure, name, rootDirectory, configure, version, clean } = params;

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
    "--prefix",
    prefixDirectory,
    "--debug",
    "--debug-node",
    "--use-prefix-to-find-headers",
    "--debug-lib",
    "--ninja",
    "--download=all"
  ];

  let needsBuildConfiguration: boolean;
  if (reconfigure) {
    needsBuildConfiguration = true;
  } else {
    needsBuildConfiguration = await checkFileAccess(
      path.resolve(extractedArchiveFolder, "out"),
      fs.constants.R_OK | fs.constants.W_OK
    );
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

    const objectChanges = await (async info =>
      new Promise<ChangeObject<string>[]>(resolve =>
        diff.diffJson(
          // Default info contains the new build configure arguments.
          decodedNodeVersionInstallInformation,
          info,
          {
            callback: result => {
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
  const chalk = (await import("chalk")).default;

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

  const compileMakeArguments = new Array<string>();

  const isNodeBinaryPresent = await checkFileAccess(
    path.resolve(prefixDirectory, "bin", "node"),
    fs.constants.X_OK | fs.constants.R_OK
  );

  let { install } = params;

  {
    install =
      /**
       * If the `install` argument is set, leave it as is
       */
      install ??
      /**
       * If `install` is `null`, set `install` to `true` if any of the following is true:
       */
      /**
       * The build needs to be configured
       */
      (needsBuildConfiguration ||
        /**
         * The `node` binary is not present
         */
        !isNodeBinaryPresent);

    /**
     * If the Node.js binary is not installed, and the initial `install` argument is set to `false`,
     * warn the user.
     */
    if (!isNodeBinaryPresent && !install) {
      console.warn(
        chalk.yellow(
          "The Node.js binary is not installed, and the `install` argument is set to `false`. " +
            "The Node.js version will not be installed."
        )
      );
      console.log();
    }
  }

  if (jobs > 0) {
    compileMakeArguments.push("--jobs", `${jobs}`);
  }

  await spawn("make", ["VERBOSE=1", ...compileMakeArguments], {
    log: true,
    env: environmentVariables,
    cwd: extractedArchiveFolder
  }).wait();
  console.log();

  if (install) {
    await spawn("make", ["install"], {
      log: true,
      env: environmentVariables,
      cwd: extractedArchiveFolder
    }).wait();
    console.log(chalk.green(`Successfully installed Node.js version ${version}`));
  }

  if (!keep) {
    console.log(chalk.yellow(`Removing source code...`));
    await fs.promises.rm(extractedArchiveFolder, { recursive: true });
  }

  console.log(chalk.green(`Done.`));
}
