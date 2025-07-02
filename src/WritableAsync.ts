import { Writable } from "node:stream";
import { WriteStream } from "node:tty";

interface IQueueItem {
  chunk: Uint8Array;
  cursorTo: [number, number | undefined];
}

export default class WritableAsync {
  readonly #writable;
  readonly #queue = new Set<Partial<IQueueItem>>();
  public constructor(writable: Writable | WriteStream) {
    this.#writable = writable;

    writable.on("drain", this.#flushQueue);
  }

  public end() {
    return new Promise<void>((resolve) => {
      this.#writable.end(() => {
        resolve();
      });
    });
  }

  public cursorTo(x: number, y?: number) {
    return new Promise<void>((resolve) => {
      if (!("cursorTo" in this.#writable)) {
        resolve();
        return;
      }
      const result = this.#writable.cursorTo(x, y, () => {
        resolve();
      });
      if (!result) {
        this.#enqueue({ cursorTo: [x, y] });
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

        if ("chunk" in operation) {
          await this.#write(operation.chunk);
        }

        if ("cursorTo" in operation) {
          const [x, y] = operation.cursorTo;
          await this.cursorTo(x, y);
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

  #enqueue(op: Partial<IQueueItem>) {
    if ("chunk" in op) {
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
        this.#enqueue({ chunk: value });
      }
    });
  }
}
