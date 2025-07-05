import { getString } from "cli-argument-helper/string";
import semver from "semver";

/**
 * Gets a semantic version from the command line arguments.
 * @param args The command line arguments.
 * @param index The index of the argument.
 * @returns The semantic version, or null if not valid.
 */
export default function getSemanticVersion(args: string[], index: number): string | null {
  const value = getString(args, index);

  if (!semver.valid(value)) {
    return null;
  }

  return value;
}
