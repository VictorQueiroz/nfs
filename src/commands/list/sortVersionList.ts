import { INodeVersionInfo } from "./prettyPrintNodejsVersionInformation";

export default async function sortVersionList(versions: INodeVersionInfo[]) {
  const semver = await import("semver");
  return versions.sort((a, b) => semver.rcompare(a.version, b.version));
}
