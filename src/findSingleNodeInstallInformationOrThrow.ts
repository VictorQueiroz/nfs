import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

/**
 * Finds a single Node.js installation that matches the given environment information.
 * If no installation is found, throws an error.
 * @param rootDirectory The root directory of the Node.js From Scratch installation.
 * @param environmentInfo The environment information to search for.
 * @returns The found installation information.
 * @throws If no version is found that matches the given environment information.
 */
export default async function findSingleNodeInstallInformationOrThrow(
  rootDirectory: string,
  environmentInfo: IInputNodeEnvironmentInformation
) {
  const findSingleNodeInstallInformation = (await import("./findSingleNodeInstallInformation"))
    .default;
  const version = await findSingleNodeInstallInformation(rootDirectory, environmentInfo);

  assert.strict.ok(
    version !== null,
    `No version found for environment: ${environmentInfo.environmentName} (${environmentInfo.version})`
  );

  return version;
}
