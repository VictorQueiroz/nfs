import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

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
