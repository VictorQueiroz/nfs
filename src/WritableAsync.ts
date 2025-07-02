import { Writable } from "node:stream";
import { WriteStream } from "node:tty";

interface IQueueItemWrite {
  chunk: Uint8Array;
}

interface IQueueItemCursorTo {
  cursorTo: [number] | [number, number];
}
interface IQueueItemMoveCursor {
  moveCursor: [number, number];
}

interface IQueueItem extends IQueueItemWrite, IQueueItemCursorTo, IQueueItemMoveCursor {}

type NullableProps<T> = { [K in keyof T]: T[K] | null };

const defaultQueueItemProperties: NullableProps<IQueueItem> = {
  cursorTo: null,
  moveCursor: null,
  chunk: null
};

export default class WritableAsync<T extends Writable | WriteStream> {
  readonly #writable;
  readonly #queue = new Set<NullableProps<IQueueItem>>();
  public constructor(writable: T) {
    this.#writable = writable;

    writable.on("drain", this.#flushQueue);
  }

  public destroy(err: Error | null = null) {
    if (err !== null) {
      this.#writable.destroy(err);
    } else {
      this.#writable.destroy();
    }
  }

  public end() {
    return new Promise<void>(resolve => {
      this.#writable.end(() => {
        resolve();
      });
    });
  }

  public moveCursor(dx: number, dy: number) {
    return new Promise<void>(resolve => {
      if (!("moveCursor" in this.#writable)) {
        resolve();
        return;
      }
      const result = this.#writable.moveCursor(dx, dy, () => {
        resolve();
      });
      if (!result) {
        this.#enqueue({ ...defaultQueueItemProperties, moveCursor: [dx, dy] });
      }
    });
  }

  public cursorTo(x: number, y: number | null = null) {
    return new Promise<void>(resolve => {
      if (!("cursorTo" in this.#writable)) {
        resolve();
        return;
      }
      const callback = () => {
        resolve();
      };
      const result =
        y === null ? this.#writable.cursorTo(x, callback) : this.#writable.cursorTo(x, y, callback);
      if (!result) {
        this.#enqueue({ ...defaultQueueItemProperties, cursorTo: y === null ? [x] : [x, y] });
      }
    });
  }

  public async write(data: string | Uint8Array): Promise<void> {
    return this.#write(typeof data === "string" ? new TextEncoder().encode(data) : data);
  }

  readonly #flushQueue = async () => {
    const queue = this.#queue;
    for (const operation of Array.from(queue)) {
      try {
        // Remove it from the queue before we try to write it. It will be enqueued again if the write fails
        queue.delete(operation);

        if (operation.chunk !== null) {
          await this.#write(operation.chunk);
        }

        if (operation.cursorTo !== null) {
          const [x, y] = operation.cursorTo;
          await this.cursorTo(x, y);
        }

        if (operation.moveCursor !== null) {
          const [x, y] = operation.moveCursor;
          await this.moveCursor(x, y);
        }
      } catch (err) {
        console.error(
          "Failed to write chunk to writable stream. The chunk will be enqueued again to be written to the stream.",
          err
        );
        break;
      }

      if (this.#writable.writableNeedDrain) {
        break;
      }
    }
  };

  #enqueue(op: NullableProps<IQueueItem>) {
    if (op.chunk !== null) {
      const chunk = new Uint8Array(op.chunk.byteLength);

      // Add to queue
      this.#queue.add(op);

      // Set the `chunk` property
      op.chunk = chunk;

      // Copy the data
      chunk.set(op.chunk);

      return;
    }

    this.#queue.add(op);
  }

  async #write(value: Uint8Array) {
    return new Promise<void>((resolve, reject) => {
      const callback = (err: Error | null) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve();
        }
      };

      const writeResult = this.#writable.write(value, (err = null) => {
        callback(err);
      });

      if (!writeResult) {
        this.#enqueue({ ...defaultQueueItemProperties, chunk: value });
      }
    });
  }
}
