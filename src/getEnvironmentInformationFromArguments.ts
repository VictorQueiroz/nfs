import assert from "node:assert";

export interface INodeEnvironmentInformation {
  environmentName: string;
  version: string | null;
  lts: boolean | null;
}

export default async function getEnvironmentInformationFromArguments(
  args: string[],
  startIndex: number
): Promise<INodeEnvironmentInformation> {
  const { getString } = await import("cli-argument-helper/string");
  const defaults = (await import("./config")).default;
  const { getArgument } = await import("cli-argument-helper");
  const getArgumentAssignment = (await import("cli-argument-helper/getArgumentAssignment")).default;

  const lts = getArgument(args, "--lts") !== null ? true : null;

  let environmentName =
    getArgumentAssignment(args, "--name", getString) ??
    getArgumentAssignment(args, "-n", getString);

  let version = getArgumentAssignment(args, "--version", getString);

  // If --version is not defined, get the next available argument
  if (version === null) {
    version = getString(args, startIndex);
  }

  // Check if the argument is not a valid environment name. If it is, set it as the environment name
  if (version !== null && /^[a-zA-Z_-]+$/.test(version)) {
    assert.strict.ok(
      environmentName === null,
      `Environment name specified twice: ${environmentName}`
    );

    // <environment name> [version]
    environmentName = version;
    version = getString(args, startIndex);
  }

  // If `version` is not null at this point, make sure it is a valid version range
  if (version !== null) {
    const { validRange } = await import("semver");

    assert.strict.ok(validRange(version) !== null, `Invalid version: ${version}`);
  }

  return { lts, environmentName: environmentName ?? defaults.installationName, version };
}
