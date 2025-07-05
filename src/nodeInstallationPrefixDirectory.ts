import path from "node:path";
import defaults from "./config";

/**
 * Compute the path of the node installation prefix directory.
 *
 * The path is derived from the root directory, the installation folder name (from the config),
 * and the version.
 *
 * @param {{ rootDirectory: string; name: string; version: string; }} options
 * @returns {{ prefixDirectory: string; version: string; name: string; }}
 */
export default function nodeInstallationPrefixDirectory({
  rootDirectory,
  version,
  name
}: {
  rootDirectory: string;
  name: string;
  version: string;
}) {
  const pathItemList: string[] = [rootDirectory, defaults.installationFolderName, name, version];

  return { prefixDirectory: path.resolve(...pathItemList), version, name };
}
