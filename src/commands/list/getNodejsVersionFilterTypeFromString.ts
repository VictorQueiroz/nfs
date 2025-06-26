import assert from "node:assert";

export const enum NodejsVersionFilterType {
  LTS,
  Security,
}

export default function getNodejsVersionFilterTypeFromString(
  value: unknown,
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
