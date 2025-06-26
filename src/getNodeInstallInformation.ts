import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getString } from "cli-argument-helper/string";
import assert from "node:assert";
import getSemanticVersion from "./getSemanticVersion";

export default function getNodeInstallInformation({
  args,
  rootDirectory,
}: {
  args: string[];
  rootDirectory: string;
}) {
  const version = getArgumentAssignment(args, "--version", getSemanticVersion);

  assert.strict.ok(version !== null, `--version argument is required`);

  const name = getArgumentAssignment(args, "--name", getString);
  const pathItemList = [rootDirectory];

  if (name !== null) {
    pathItemList.push("environments", name);
  } else {
    pathItemList.push("versions");
  }

  return {
    prefixDirectory: path.resolve(...pathItemList, `v${version}`),
    version,
    name,
  };
}
