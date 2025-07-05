import assert from "node:assert";

export interface IInputNodeEnvironmentInformation {
  environmentName: string;
  version: string | null;
  lts: boolean | null;
}

export interface INodeEnvironmentInformation {
  environmentName: string;
  version: string;
  lts: boolean;
}

/**
 * Returns an object containing environment information from CLI arguments.
 *
 * `startIndex` is the starting index in the `args` array where the environment
 * information should be extracted from.
 *
 * The function will return an object with the following properties:
 *
 * - `lts`: Whether the installation should be an LTS version or not.
 * - `environmentName`: The name of the environment.
 * - `version`: The version of Node.js to install.
 *
 * If `version` is not specified, the function will get the next available argument
 * from the `args` array.
 *
 * If `version` is not valid, the function will return `null`.
 *
 * @param {string[]} args - The CLI arguments.
 * @param {number} startIndex - The starting index in the `args` array where the environment
 * information should be extracted from.
 * @returns {Promise<IInputNodeEnvironmentInformation | null>} An object containing environment
 * information, or `null` if the version is not valid.
 */
export default async function getEnvironmentInformationFromArguments(
  args: string[],
  startIndex: number
): Promise<IInputNodeEnvironmentInformation> {
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
