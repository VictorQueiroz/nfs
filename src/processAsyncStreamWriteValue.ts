export type AsyncStreamWriteValue = string | Uint8Array | string[] | Uint8Array[] | null;

export default function processAsyncStreamWriteValue(
  value: AsyncStreamWriteValue
): ReadonlyArray<Uint8Array> {
  let src: ReadonlyArray<Uint8Array>;

  if (value === null) {
    src = [];
  } else if (typeof value === "string") {
    src = [new TextEncoder().encode(value)];
  } else if (Array.isArray(value)) {
    src = value.flatMap(processAsyncStreamWriteValue);
  } else {
    src = [value];
  }

  return src.flat();
}
