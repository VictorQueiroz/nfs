/**
 * Tries to convert the given value to a valid integer.
 *
 * @param value The value to convert.
 *
 * @returns The converted value if it is a valid integer, `null` otherwise.
 */
export default function toValidInteger(value: unknown): number | null {
  if (typeof value === "string") {
    value = parseInt(value, 10);
  }
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  ) {
    return null;
  }
  return value;
}
