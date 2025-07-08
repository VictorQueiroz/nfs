import getBoolean from "cli-argument-helper/boolean/getBoolean";
import defaults from "../../config";
import { IInputNodeEnvironmentInformation } from "../../getEnvironmentInformationFromArguments";
import log from "../../log";

export default function getDefaultEnvironmentInformationFromEnvironmentVariables(): IInputNodeEnvironmentInformation | null {
  const values = {
    version: process.env[defaults.environmentVariableNames.defaultNodeVersion] ?? null,
    environmentName:
      process.env[defaults.environmentVariableNames.defaultNodeEnvironmentName] ?? null,
    lts: process.env[defaults.environmentVariableNames.defaultLongTermSupport] ?? null
  };

  if (values.version === null || values.environmentName === null || values.lts === null) {
    log.trace(() => {
      console.log("No environment information found in environment variables: %o", values);
    });
    return null;
  }

  const lts = getBoolean([values.lts], 0);

  if (lts === null) {
    return null;
  }

  return { version: values.version, environmentName: values.environmentName, lts };
}
