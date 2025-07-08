import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "../../getEnvironmentInformationFromArguments";

export default async function processUseCommand(
  rootDirectory: string,
  envInfo: IInputNodeEnvironmentInformation
) {
  const getInstallationEnvironmentVariables = (
    await import("../../getInstallationEnvironmentVariables")
  ).default;
  const environmentVariables = await getInstallationEnvironmentVariables(rootDirectory, envInfo);

  assert.strict.ok(environmentVariables !== null, `Failed to get environment variables`);

  return environmentVariables;
}
