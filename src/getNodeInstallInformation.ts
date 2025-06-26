import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getString } from "cli-argument-helper/string";
import getSemanticVersion from "./getSemanticVersion";
import path from "node:path";
import assert from "node:assert";

export default function getNodeInstallInformation({
  args,
  overrideProperties: overrideProperties,
  rootDirectory,
}: {
  args: string[];
  rootDirectory: string;
  overrideProperties: {
    version: string | null;
    name: string | null;
  } | null;
}) {
  overrideProperties = overrideProperties ?? {
    version: null,
    name: null,
  };

  let { version, name } = overrideProperties;

  version =
    version ?? getArgumentAssignment(args, "--version", getSemanticVersion);
  name = name ?? getArgumentAssignment(args, "--name", getString);

  assert.strict.ok(version !== null, `Failed to get version from arguments`);

  const pathItemList: string[] = [rootDirectory];

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
