import { getString } from "cli-argument-helper/string";
import semver from "semver";

export default function getSemanticVersion(
  args: string[],
  index: number,
): string | null {
  const value = getString(args, index);

  if (!semver.valid(value)) {
    return null;
  }

  return value;
}
