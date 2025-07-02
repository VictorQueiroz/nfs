import path from "node:path";
import defaults from "./config";

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
