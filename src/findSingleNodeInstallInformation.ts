import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

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
