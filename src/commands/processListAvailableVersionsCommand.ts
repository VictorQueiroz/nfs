import { getArgument } from "cli-argument-helper";
import getArgumentAssignmentFromIndex from "cli-argument-helper/getArgumentAssignmentFromIndex";
import prettyPrintNodejsVersionInformation, {
  INodeVersionInfo,
} from "./list/prettyPrintNodejsVersionInformation";
import getNodejsVersionFilterTypeFromString, {
  NodejsVersionFilterType,
} from "./list/getNodejsVersionFilterTypeFromString";

export default async function processListAvailableVersionsCommand({
  args,
}: {
  args: string[];
}) {
  const { getString } = await import("cli-argument-helper/string");
  const listVersions = getArgument(args, "list") ?? getArgument(args, "-l");

  if (listVersions === null) {
    return false;
  }

  const filters =
    ["-f", "--filter"]
      .reduce<string | null>((acc, argumentName) => {
        return (
          acc ??
          getArgumentAssignmentFromIndex(
            args,
            listVersions.index,
            argumentName,
            getString,
          )
        );
      }, null)
      ?.split(",")
      .map(getNodejsVersionFilterTypeFromString) ?? null;

  const version =
    getArgumentAssignmentFromIndex(
      args,
      listVersions.index,
      "--version",
      getString,
    ) ??
    getString(args, listVersions.index) ??
    null;

  const res = await fetch("https://nodejs.org/download/release/index.json", {
    method: "GET",
    headers: {
      Accept: "application/json",
      // Cache for 1 day
      "Cache-Control": "max-age=86400",
    },
  });

  const semver = await import("semver");

  const versions = ((await res.json()) as INodeVersionInfo[])
    .sort((a, b) => semver.compare(a.version, b.version))
    .filter((versionInfo) => {
      if (filters !== null) {
        if (filters.includes(NodejsVersionFilterType.LTS) && !versionInfo.lts) {
          return false;
        }

        if (
          filters.includes(NodejsVersionFilterType.Security) &&
          !versionInfo.security
        ) {
          return false;
        }
      }

      if (version !== null && !semver.satisfies(versionInfo.version, version)) {
        return false;
      }

      return true;
    });

  for (const versionInfo of versions) {
    await prettyPrintNodejsVersionInformation(versionInfo);

    if (versionInfo !== versions[versions.length - 1]) {
      console.log();
      console.log("-");
    }
  }

  return true;
}
