export enum SetCommandKey {
  DefaultVersion
}

/**
 * Given a string, returns the corresponding SetCommandKey, or null if no match found.
 */
export default function parseSetCommandKeyFromString(key: string | null): SetCommandKey | null {
  switch (key) {
    case "default":
      return SetCommandKey.DefaultVersion;
    default:
      return null;
  }
}
