import assert from "node:assert";
import { IInputNodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

/**
 * Resolves the version based on the `--lts` flag and the version from the command line.
 * If no version is provided, finds the latest version available.
 * If `--lts` is provided, the latest LTS version is used.
 * @param environmentInfo The parsed command line arguments with the environment information.
 * @returns The resolved version.
 */
export default async function resolveVersion(environmentInfo: IInputNodeEnvironmentInformation) {
  const semver = await import("semver");
  const sortVersionList = (await import("./commands/list/sortVersionList")).default;
  const listNodejsVersions = (await import("./commands/list/listNodejsVersions")).default;

  let { version } = environmentInfo;
  const { lts } = environmentInfo;

  const versionList = (await sortVersionList(await listNodejsVersions())).filter(versionInfo =>
    // If `--lts` is provided, filter out versions that are not LTS
    lts !== null ? versionInfo.lts === lts : true
  );

  version =
    version ??
    // In case no version is provided, find the latest version
    versionList.reduce<string | null>((acc, versionInfo) => {
      return acc === null
        ? versionInfo.version
        : semver.gt(versionInfo.version, acc)
          ? versionInfo.version
          : acc;
    }, null);

  assert.strict.ok(version !== null, `Failed to get version from arguments`);

  const matchedVersionInfo =
    versionList.find(versionInfo => semver.satisfies(versionInfo.version, version)) ?? null;

  assert.strict.ok(matchedVersionInfo !== null, `Failed to get version: ${version}`);

  return matchedVersionInfo;
}
