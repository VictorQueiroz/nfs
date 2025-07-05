import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";
import printActivationShellScript from "./printActivationShellScript";

/**
 * Use a specific Node.js version.
 *
 * @param rootDirectory The root directory where all the Node.js versions are installed.
 * @param envInfo The environment information of the Node.js version to use.
 *
 * @returns `true` if the command was executed successfully.
 */
export default async function processUseCommand(
  rootDirectory: string,
  envInfo: IInputNodeEnvironmentInformation
) {
  const getInstallationEnvironmentVariables = (
    await import("./getInstallationEnvironmentVariables")
  ).default;
  const environmentVariables = await getInstallationEnvironmentVariables(rootDirectory, envInfo);

  assert.strict.ok(environmentVariables !== null, `Failed to get environment variables`);

  await printActivationShellScript(environmentVariables);

  return true;
}
