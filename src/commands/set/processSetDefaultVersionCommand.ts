import TextStream from "@textstream/core";
import { IInputNodeEnvironmentInformation } from "../../getEnvironmentInformationFromArguments";

export enum SetDefaultVersionCommandType {
  /**
   * Use the system default version.
   * Remove NFS environment variables
   */
  System,
  /**
   * Set a specific version
   */
  Specific
}

export type SetDefaultVersionCommand =
  | {
      type: SetDefaultVersionCommandType.Specific;
      nodeEnvironmentInformation: IInputNodeEnvironmentInformation;
    }
  | { type: SetDefaultVersionCommandType.System };

export default async function processSetDefaultVersionCommand({
  version,
  rootDirectory
}: {
  rootDirectory: string;
  version: SetDefaultVersionCommand;
}): Promise<string | null> {
  const environmentVariables = new Map<string, string>();
  const defaults = (await import("../../config")).default;
  let writeNfsCommand: ((cs: TextStream) => void) | null;

  switch (version.type) {
    case SetDefaultVersionCommandType.Specific: {
      const findSingleNodeInstallInformationOrThrow = (
        await import("../../findSingleNodeInstallInformationOrThrow")
      ).default;
      const versionInfo = await findSingleNodeInstallInformationOrThrow(
        rootDirectory,
        version.nodeEnvironmentInformation
      );

      environmentVariables.set(
        defaults.environmentVariableNames.defaultNodeVersion,
        versionInfo.id.version
      );

      environmentVariables.set(
        defaults.environmentVariableNames.defaultNodeEnvironmentName,
        versionInfo.id.name
      );

      writeNfsCommand = cs => {
        cs.write(`eval "$(nfs use '${versionInfo.id.name}' '${versionInfo.id.version}')"\n`);
      };
      break;
    }
    case SetDefaultVersionCommandType.System: {
      environmentVariables.set(defaults.environmentVariableNames.defaultNodeVersion, "");

      environmentVariables.set(defaults.environmentVariableNames.defaultNodeEnvironmentName, "");

      writeNfsCommand = cs => {
        cs.write('eval "$(nfs use system)"\n');
      };
      break;
    }

    default:
      return null;
  }

  const { TextStream } = await import("@textstream/core");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const outputFile = path.resolve(rootDirectory, "environment.sh");
  const cs = new TextStream();

  cs.write("#!/bin/sh\n\n");

  for (const [key, value] of Object.entries(environmentVariables)) {
    cs.write(`${key}=${value}\n`);
    cs.write(`export ${key}\n`);
    cs.write("\n");
  }

  if (writeNfsCommand !== null) {
    writeNfsCommand(cs);
    cs.write("\n");
  }

  await fs.promises.writeFile(outputFile, cs.value());

  // Make the file executable
  await fs.promises.chmod(outputFile, 0o755);

  return outputFile;
}
