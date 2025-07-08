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
import printActivationShellScript from "./printActivationShellScript";
import nfsEnvironmentFileLocation from "./nfsEnvironmentFileLocation";
import defaultRootDirectory from "./defaultRootDirectory";
import generateExportEnvironmentVariablesShellScript from "./generateExportEnvironmentVariablesShellScript";

// TODO: Add support for running certains patches before compiling again

(async () => {
  // Increase the stack trace limit to allow long stack traces
  Error.stackTraceLimit = Infinity;

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
      (await defaultRootDirectory())
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

    // const environmentFile = await processSetDefaultVersionCommand({
    //   rootDirectory,
    //   version: { type: SetDefaultVersionCommandType.System }
    // });

    // assert.strict.ok(
    //   environmentFile !== null,
    //   `Failed to set default version on disk: ${rootDirectory}`
    // );
  }

  const initCommand = getArgument(args, "init");

  if (initCommand !== null) {
    const environmentContents = await generateExportEnvironmentVariablesShellScript(new Map());
    const asyncStreamWrite = (await import("./asyncStreamWrite")).default;
    const fs = await import("node:fs");

    const outputEnvironmentFileLocation = nfsEnvironmentFileLocation(rootDirectory);

    await asyncStreamWrite(
      fs.createWriteStream(outputEnvironmentFileLocation),
      environmentContents.value()
    );

    // Installation: Instruct the user to add the following to his shell
    const chalk = (await import("chalk")).default;

    // Step 1: Add the following to your .bashrc or .zshrc:
    console.log(
      `# ${chalk.yellow(`Make sure you have the following at the end of your .bashrc or .zshrc:`)}`
    );
    console.log(
      chalk.gray(
        `# ${chalk.bold.cyan(`source "${chalk.bold.white(rootDirectory)}/${defaults.nfsEnvironmentFileName}"`)}`
      )
    );
    console.log();

    return;
  }

  const envArgument = getArgument(args, "env") ?? getArgument(args, "environment") ?? null;

  if (envArgument) {
    const useCommand = getArgument(args, "use");

    if (useCommand !== null) {
      const processUseCommandFromArguments = (
        await import("./commands/use/processUseCommandFromArguments")
      ).default;

      const environmentVariables = await processUseCommandFromArguments(
        rootDirectory,
        args,
        useCommand.index
      );

      await printActivationShellScript(environmentVariables);

      return;
    }

    const setCommand = getArgument(args, "set");

    if (setCommand !== null) {
      const checkFileAccess = (await import("./checkFileAccess")).default;
      const fs = await import("node:fs");
      const asyncStreamWrite = (await import("./asyncStreamWrite")).default;
      const { TextStream } = await import("@textstream/core");
      const environmentFile = nfsEnvironmentFileLocation(rootDirectory);
      const cs = new TextStream();

      if (
        !(await checkFileAccess(
          environmentFile,
          fs.constants.R_OK |
            // Make sure the file is executable
            fs.constants.X_OK
        ))
      ) {
        assert.strict.ok(
          (await processSetDefaultVersionCommand({
            rootDirectory,
            version: { type: SetDefaultVersionCommandType.System }
          })) !== null,
          `Failed to set default version on disk: ${rootDirectory}`
        );
      }

      cs.write(`"${environmentFile}"\n`);

      await asyncStreamWrite(process.stdout, cs.value());
    }

    return;
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

  // nfs shell script will call this command with `nfs env` in order to get the environment variables
  if (containsUseCommand !== null) {
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
