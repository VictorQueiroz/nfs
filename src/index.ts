#!/usr/bin/env node

import assert from "node:assert";
import findNodeInstallInformation from "./findNodeInstallInformation";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import {
  defaultNodeFromScratchInstallationInformation,
  NodeFromScratchInstallationInformation
} from "../schema/0.0.1/main.jsb";
import resolveVersion from "./resolveVersion";

(async () => {
  const process = await import("node:process");
  const path = await import("node:path");
  const { getArgument } = await import("cli-argument-helper");
  const { getString } = await import("cli-argument-helper/string");
  const getArgumentAssignment = (await import("cli-argument-helper/getArgumentAssignment")).default;
  const defaults = (await import("./config")).default;
  const args = process.argv.slice(2);

  const rootDirectory = path.resolve(
    process.cwd(),
    getArgumentAssignment(args, "--root-dir", getString) ??
      getArgumentAssignment(args, "-r", getString) ??
      defaults.rootDirectory
  );

  // Create NFS information if it doesn't exist
  {
    const localInstallationInfo = persistentLocalInstallationInformation(rootDirectory);
    let nfsLocalInfo: NodeFromScratchInstallationInformation | null =
      (await localInstallationInfo.decode(null)) ?? defaultNodeFromScratchInstallationInformation();

    nfsLocalInfo = await localInstallationInfo.encode(
      NodeFromScratchInstallationInformation({
        location: rootDirectory,
        installRootDirectories: new Set([
          ...nfsLocalInfo.installRootDirectories,
          path.resolve(rootDirectory, defaults.installationFolderName)
        ])
      })
    );

    assert.strict.ok(
      nfsLocalInfo !== null,
      `Failed to create installation information on disk: ${rootDirectory}`
    );
  }

  const exec = getArgument(args, "exec");

  if (exec !== null) {
    const processExecCommand = (await import("./commands/exec/processExecCommand")).default;

    await processExecCommand({ args, index: exec.index, rootDirectory });
    return;
  }

  const containsUseCommand = getArgument(args, "use");

  if (containsUseCommand !== null) {
    const processUseCommand = (await import("./processUseCommand")).default;
    const getEnvironmentInformationFromArguments = (
      await import("./getEnvironmentInformationFromArguments")
    ).default;
    const environmentInfo = await getEnvironmentInformationFromArguments(
      args,
      containsUseCommand.index
    );
    const versions = await findNodeInstallInformation(rootDirectory, environmentInfo);

    assert.strict.ok(
      versions.size <= 1,
      `More than one version found for environment: ${environmentInfo.environmentName} (${environmentInfo.version})`
    );

    for (const versionInfo of versions) {
      await processUseCommand(rootDirectory, {
        environmentName: versionInfo.id.name,
        version: versionInfo.id.version,
        lts: null
      });
    }
    return;
  }

  {
    const listVersions =
      getArgument(args, "list") ?? getArgument(args, "-l") ?? getArgument(args, "--list");

    if (listVersions !== null) {
      const processListAvailableVersionsCommand = (
        await import("./commands/processListAvailableVersionsCommand")
      ).default;

      await processListAvailableVersionsCommand(args, listVersions.index);
      return;
    }
  }

  const install = getArgument(args, "install");

  if (install !== null) {
    const getEnvironmentInformationFromArguments = (
      await import("./getEnvironmentInformationFromArguments")
    ).default;

    const environmentInfo = await getEnvironmentInformationFromArguments(args, install.index);
    const resolvedVersion = await resolveVersion(environmentInfo);

    const processCreateNodejsEnvironmentCommand = (
      await import("./commands/install/processCreateNodejsEnvironmentCommand")
    ).default;

    await processCreateNodejsEnvironmentCommand(args, {
      rootDirectory,
      environmentName: environmentInfo.environmentName,
      version: resolvedVersion.version
    });
  }

  const chalk = (await import("chalk")).default;

  assert.strict.ok(
    args.length === 0,
    `Unrecognized arguments:\n${args.map((arg) => `\t- ${chalk.red(arg)}`).join("\n")}`
  );
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
