import {
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation
} from "../schema/0.0.1/main.jsb";
import persistentDirectoryData from "./persistentDirectoryData";
import findNodeInstallInformation from "./findNodeInstallInformation";
import originalEnvironmentVariables, {
  INodeVersionEnvironmentVariables
} from "./originalEnvironmentVariables";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";
import log from "./log";

export default async function getInstallationEnvironmentVariables(
  rootDirectory: string,
  environmentInfo: IInputNodeEnvironmentInformation
): Promise<INodeVersionEnvironmentVariables | null> {
  const path = await import("node:path");

  // Get version install information
  const targetInstallInformationList = await findNodeInstallInformation(
    rootDirectory,
    environmentInfo
  );

  if (
    targetInstallInformationList.size === 0 ||
    // The arguments match more than one version
    targetInstallInformationList.size > 1
  ) {
    return null;
  }

  const [targetInstallInformation = null] = Array.from(targetInstallInformationList);

  if (targetInstallInformation === null) {
    return null;
  }

  const existingInstallInfoHandle = await persistentDirectoryData(
    targetInstallInformation.location,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation
  ).decode(null);

  if (existingInstallInfoHandle === null) {
    log.verbose(() => {
      console.error(
        `Failed to decode Node.js installation information: ${Object.values(targetInstallInformation.id)}`
      );
    });
    return null;
  }

  const transformedEnvironmentVariables = await originalEnvironmentVariables({ rootDirectory });

  // Add new values
  transformedEnvironmentVariables.PATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "bin")
  );

  transformedEnvironmentVariables.MANPATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "share/man")
  );

  return transformedEnvironmentVariables;
}
