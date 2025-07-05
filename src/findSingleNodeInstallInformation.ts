import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

/**
 * Finds a single Node.js installation information based on the environment information.
 *
 * @param rootDirectory The root directory to search for the Node.js installation information.
 * @param environmentInfo The environment information to search for.
 * @returns The single Node.js installation information found, or null if no version is found.
 * @throws An error is thrown if more than one version is found.
 */
export default async function findSingleNodeInstallInformation(
  rootDirectory: string,
  environmentInfo: IInputNodeEnvironmentInformation
) {
  const findNodeInstallInformation = (await import("./findNodeInstallInformation")).default;

  const versions = Array.from(await findNodeInstallInformation(rootDirectory, environmentInfo));

  assert.strict.ok(
    versions.length <= 1,
    `More than one version found for environment: ${environmentInfo.environmentName} (${environmentInfo.version})`
  );

  return versions[0] ?? null;
}
