import assert from "node:assert";

export interface IInputNodeEnvironmentInformation {
  environmentName: string | null;
  version: string | null;
  lts: boolean | null;
}

export interface INodeEnvironmentInformation {
  environmentName: string;
  version: string;
  lts: boolean | null;
}

/**
 * Returns the parsed command line arguments with the environment information.
 *
 * The function handles the following cases:
 * - If `--name` or `-n` is provided, use that as the environment name.
 * - If `--version` is provided, use that as the version.
 * - If `--version` is not provided, use the next available argument as the version.
 * - If the version is a valid environment name, set it as the environment name.
 * - If the version is not a valid version range, throw an error.
 *
 * @param args The command line arguments.
 * @param startIndex The starting index of the arguments.
 * @returns The parsed command line arguments with the environment information.
 */
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

  assert.strict.ok(version !== null, `No version specified`);

  return { lts, environmentName: environmentName ?? defaults.installationName, version };
}
