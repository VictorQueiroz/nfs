#!/usr/bin/env node

import assert from "node:assert";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import {
  defaultNodeFromScratchInstallationInformation,
  NodeFromScratchInstallationInformation
} from "../schema/0.0.1/main.jsb";
import resolveVersion from "./resolveVersion";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";
import processSetDefaultVersionCommand, {
  SetDefaultVersionCommandType
} from "./commands/set/processSetDefaultVersionCommand";
import parseSetCommandKeyFromString, {
  SetCommandKey
} from "./commands/set/parseSetCommandKeyFromString";
import originalEnvironmentVariables from "./originalEnvironmentVariables";
import printActivationShellScript from "./printActivationShellScript";
import findSingleNodeInstallInformation from "./findSingleNodeInstallInformation";

// TODO: Add support for running certains patches before compiling again

(async () => {
  const path = await import("node:path");
  const process = await import("node:process");
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

    const environmentFile = await processSetDefaultVersionCommand({
      rootDirectory,
      version: { type: SetDefaultVersionCommandType.System }
    });

    assert.strict.ok(
      environmentFile !== null,
      `Failed to set default version on disk: ${rootDirectory}`
    );

    // Installation: Instruct the user to add the following to his shell
    const chalk = (await import("chalk")).default;

    // Step 1: Add the following to your .bashrc or .zshrc:
    console.log(
      `# ${chalk.yellow(`Make sure you have the following at the end of your .bashrc or .zshrc:`)}`
    );
    console.log(
      chalk.gray(
        `# ${chalk.bold.cyan(`source "${chalk.bold.white(rootDirectory)}/environment.sh"`)}`
      )
    );
    console.log();
  }

  const printRootDirectory = getArgument(args, "root");

  if (printRootDirectory !== null) {
    process.stdout.write(rootDirectory);
    return;
  }

  const exec = getArgument(args, "exec");

  if (exec !== null) {
    const processExecCommand = (await import("./commands/exec/processExecCommand")).default;

    await processExecCommand({ args, index: exec.index, rootDirectory });
    return;
  }

  const setCommandArg = getArgument(args, "set");

  if (setCommandArg !== null) {
    const unprocessedKey = getString(args, setCommandArg.index);

    const key = parseSetCommandKeyFromString(unprocessedKey);

    assert.strict.ok(key !== null, `Unknown set command key: ${unprocessedKey}`);

    switch (key) {
      case SetCommandKey.DefaultVersion: {
        const processSetDefaultVersionCommand = (
          await import("./commands/set/processSetDefaultVersionCommand")
        ).default;

        const isSystem = args[setCommandArg.index] === "system";
        let environmentInfo: IInputNodeEnvironmentInformation | null;

        if (isSystem) {
          getString(args, 1);

          environmentInfo = null;
        } else {
          const getEnvironmentInformationFromArguments = (
            await import("./getEnvironmentInformationFromArguments")
          ).default;

          environmentInfo = await getEnvironmentInformationFromArguments(args, setCommandArg.index);
        }

        const environmentFile = await processSetDefaultVersionCommand({
          rootDirectory,
          version:
            environmentInfo === null
              ? { type: SetDefaultVersionCommandType.System }
              : {
                  type: SetDefaultVersionCommandType.Specific,
                  nodeEnvironmentInformation: {
                    environmentName: environmentInfo.environmentName,
                    version: environmentInfo.version,
                    lts: environmentInfo.lts
                  }
                }
        });
        assert.strict.ok(environmentFile !== null, "Failed to set default version");

        console.log(`Successfully set default version!`);
        console.log('Load the environment file to apply the changes: "%s"', environmentFile);
        return;
      }
    }
  }

  const containsUseCommand = getArgument(args, "use");

  if (containsUseCommand !== null) {
    const processUseCommand = (await import("./processUseCommand")).default;

    if (!args.length) {
      const fallbackNodeInstallation = await findSingleNodeInstallInformation(rootDirectory, {
        environmentName: null,
        version: null,
        lts: null
      });

      if (fallbackNodeInstallation !== null) {
        await processUseCommand(rootDirectory, {
          environmentName: fallbackNodeInstallation.id.name,
          version: fallbackNodeInstallation.id.version,
          lts: null
        });
        return;
      }

      const chalk = (await import("chalk")).default;

      // Print a shell script that prints a red error on screen when the shell script is executed
      console.log(`printf '${chalk.red(`Could not find any Node.js installation.`)}';\n`);
      await printActivationShellScript(await originalEnvironmentVariables({ rootDirectory }));
      return;
    }

    if (args[containsUseCommand.index] === "system") {
      await printActivationShellScript(await originalEnvironmentVariables({ rootDirectory }));
      return;
    }

    const getEnvironmentInformationFromArguments = (
      await import("./getEnvironmentInformationFromArguments")
    ).default;
    const findSingleNodeInstallInformationOrThrow = (
      await import("./findSingleNodeInstallInformationOrThrow")
    ).default;

    const environmentInfo = await getEnvironmentInformationFromArguments(
      args,
      containsUseCommand.index
    );
    const versionInfo = await findSingleNodeInstallInformationOrThrow(
      rootDirectory,
      environmentInfo
    );

    await processUseCommand(rootDirectory, {
      environmentName: versionInfo.id.name,
      version: versionInfo.id.version,
      lts: null
    });
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
    const loggerArgs = [`Installing Node.js ${resolvedVersion.version}...`];

    if (resolvedVersion.version.substring(1) !== environmentInfo.version) {
      const chalk = (await import("chalk")).default;

      loggerArgs.push(
        `(${chalk.cyan(environmentInfo.version)} > ${chalk.cyan(resolvedVersion.version)})`
      );
    }

    console.log(...loggerArgs);

    const processCreateNodejsEnvironmentCommand = (
      await import("./commands/install/processCreateNodejsEnvironmentCommand")
    ).default;

    await processCreateNodejsEnvironmentCommand(args, {
      rootDirectory,
      environmentInformation: {
        environmentName: environmentInfo.environmentName,
        version: resolvedVersion.version,
        lts: resolvedVersion.lts
      }
    });
  }

  const chalk = (await import("chalk")).default;

  assert.strict.ok(
    args.length === 0,
    `Unrecognized arguments:\n${args.map(arg => `\t- ${chalk.red(arg)}`).join("\n")}`
  );
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
