/**
 * List all available Node.js versions.
 *
 * @param args - The command line arguments.
 * @param index - The index of the `list` command.
 *
 * @returns A promise that resolves to `true` if the command executes successfully.
 */
export default async function processListAvailableVersionsCommand(args: string[], index: number) {
  const { getString } = await import("cli-argument-helper/string");
  const listNodejsVersions = (await import("./list/listNodejsVersions")).default;
  const getArgumentAssignmentFromIndex = (
    await import("cli-argument-helper/getArgumentAssignmentFromIndex")
  ).default;

  const { NodejsVersionFilterType } = await import("./list/getNodejsVersionFilterTypeFromString");
  const getNodejsVersionFilterTypeFromString = (
    await import("./list/getNodejsVersionFilterTypeFromString")
  ).default;

  const filters =
    ["-f", "--filter"]
      .reduce<string | null>((acc, argumentName) => {
        return acc ?? getArgumentAssignmentFromIndex(args, index, argumentName, getString);
      }, null)
      ?.split(",")
      .map(getNodejsVersionFilterTypeFromString) ?? null;

  const version =
    getArgumentAssignmentFromIndex(args, index, "--version", getString) ??
    getString(args, index) ??
    null;
  const semver = await import("semver");

  const versions = (await listNodejsVersions())
    .sort((a, b) => semver.compare(a.version, b.version))
    .filter(versionInfo => {
      if (filters !== null) {
        if (filters.includes(NodejsVersionFilterType.LTS) && !versionInfo.lts) {
          return false;
        }

        if (filters.includes(NodejsVersionFilterType.Security) && !versionInfo.security) {
          return false;
        }
      }

      if (version !== null && !semver.satisfies(versionInfo.version, version)) {
        return false;
      }

      return true;
    });

  const prettyPrintNodejsVersionInformation = (
    await import("./list/prettyPrintNodejsVersionInformation")
  ).default;

  for (const versionInfo of versions) {
    await prettyPrintNodejsVersionInformation(versionInfo);

    if (versionInfo !== versions[versions.length - 1]) {
      console.log();
      console.log("-");
    }
  }

  // Print a small bullet-point list of versions
  if (versions.length > 0) {
    console.log();
    console.log(`Versions: ${versions.map(versionInfo => versionInfo.version).join(", ")}`);
  }

  return true;
}
