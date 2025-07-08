import Exception from "./Exception";

export default function buildException(error: Error | string) {
  if (typeof error === "string") {
    return new Exception(error);
  }

  const exception = new Exception(error.message);
  if (typeof error.stack !== "undefined") {
    exception.stack = error.stack;
  }
  return exception;
}
