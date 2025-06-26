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
