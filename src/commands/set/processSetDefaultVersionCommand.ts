import { IInputNodeEnvironmentInformation } from "../../getEnvironmentInformationFromArguments";
import Exception from "../../Exception";

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
      break;
    }
    case SetDefaultVersionCommandType.System:
      environmentVariables.set(defaults.environmentVariableNames.defaultNodeVersion, "");
      environmentVariables.set(defaults.environmentVariableNames.defaultNodeEnvironmentName, "");
      break;

    default:
      return null;
  }

  throw new Exception("Not implemented");
}
