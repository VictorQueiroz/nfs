/**
 * Gets the value of an environment variable.
 *
 * @param {string} key - The key of the environment variable.
 * @returns {string|null} The value of the environment variable, or `null` if not set.
 */
export default function environmentVariable(key: string) {
  return process.env[key] ?? null;
}
