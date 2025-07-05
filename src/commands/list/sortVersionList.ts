import { INodeVersionInfo } from "./prettyPrintNodejsVersionInformation";

/**
 * Sorts the given list of versions in descending order.
 *
 * @param versions The list of version information to sort
 * @returns A sorted list of version information
 */
export default async function sortVersionList(versions: INodeVersionInfo[]) {
  const semver = await import("semver");
  return versions.sort((a, b) => semver.rcompare(a.version, b.version));
}
