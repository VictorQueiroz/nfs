import path from "node:path";
import defaults from "./config";

export interface INodeInstallationPrefixDirectory {
  prefixDirectory: string;
  version: string;
  name: string;
}

export interface IInputNodeInstallationPrefixDirectoryProperties {
  rootDirectory: string;
  name: string;
  version: string;
}

/**
 * Given properties about a Node.js installation, returns an object with the
 * fully-qualified path to the prefix directory and the version and name of the
 * Node.js installation.
 *
 * @param {IInputNodeInstallationPrefixDirectoryProperties} properties
 * @returns {INodeInstallationPrefixDirectory}
 */
export default function nodeInstallationPrefixDirectory(properties: IInputNodeInstallationPrefixDirectoryProperties): INodeInstallationPrefixDirectory {
  const {
  rootDirectory,
  version,
  name
} = properties;
  const pathItemList: string[] = [rootDirectory, defaults.installationFolderName, name, version];

  return { prefixDirectory: path.resolve(...pathItemList), version, name };
}
