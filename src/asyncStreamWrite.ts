import { Writable } from "node:stream";
import processAsyncStreamWriteValue, {
  AsyncStreamWriteValue
} from "./processAsyncStreamWriteValue";
import log from "./log";

export default async function asyncStreamWrite(
  writable: Writable,
  value: AsyncStreamWriteValue = null
) {
  log.fatal(!writable.closed, () =>
    console.trace(`Cannot write to a closed stream: ${writable.constructor.name}`)
  );

  log.fatal(!writable.destroyed, () =>
    console.trace(`Cannot write to a destroyed stream: ${writable.constructor.name}`)
  );

  log.fatal(writable.writable, () =>
    console.trace(`Cannot write to a non-writable stream: ${writable.constructor.name}`)
  );

  log.fatal(!writable.writableEnded, () =>
    console.trace(`Cannot write to a closed stream: ${writable.constructor.name}`)
  );

  log.fatal(!writable.writableFinished, () =>
    console.trace(`Cannot write to a finished stream: ${writable.constructor.name}`)
  );

  const stream = await import("node:stream");

  await stream.promises.pipeline(
    stream.PassThrough.from(processAsyncStreamWriteValue(value)),
    writable
  );
}
