import assert from "node:assert";

export const enum NodejsVersionFilterType {
  LTS,
  Security
}

/**
 * Given a string value, returns the corresponding NodejsVersionFilterType.
 * If the value is not recognized, throws an error.
 * @param value The string value to convert to a NodejsVersionFilterType.
 * @throws {Error} If the value is not recognized.
 */
export default function getNodejsVersionFilterTypeFromString(
  value: unknown
): NodejsVersionFilterType {
  assert.strict.ok(typeof value === "string");

  switch (value) {
    case "lts":
      return NodejsVersionFilterType.LTS;
    case "security":
      return NodejsVersionFilterType.Security;
    default:
      throw new Error(`Unknown nodejs version filter type: ${value}`);
  }
}
