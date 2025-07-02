import { Codec, Deserializer, Serializer } from "@jsbuffer/codec";
import fs from "fs";
import dataFileLocationFromFolderLocation from "./dataFileLocationFromFolderLocation";
import log, { LogLevel } from "./log";

export interface IPersistentDirectoryData<T> {
  decode: (defaultValue: T | null) => Promise<T | null>;
  encode: (value: T) => Promise<T | null>;
}

/**
 * Create an object with `decode` and `encode` functions that read and write respectively
 * to a file located inside the given `location` directory.
 *
 * The functions are designed to be used with the `@jsbuffer/codec` library, and
 * the `encode` and `decode` function parameters will be called with a `Serializer`
 * and `Deserializer` instance respectively.
 *
 * If the `compare` function is provided, it will be called with the decoded value
 * and the input value to `encode` before writing to the file. If the comparison
 * returns `false`, the value will not be written to the file.
 *
 * If the `defaultValue` argument is provided to the `decode` function, and the
 * `decode` function returns `null`, the `defaultValue` will be encoded and written
 * to the file. The `defaultValue` argument defaults to `null`.
 *
 * @param {string} location
 * @param {(serializer: Serializer, input: T) => void} encode
 * @param {(deserializer: Deserializer) => T | null} decode
 * @param {((a: T, b: T) => boolean) | null} compare
 * @returns {IPersistentDirectoryData<T>}
 */
export default function persistentDirectoryData<T>(
  location: string,
  encode: (serializer: Serializer, input: T) => void,
  decode: (deserializer: Deserializer) => T | null,
  compare: ((a: T, b: T) => boolean) | null = null
): IPersistentDirectoryData<T> {
  const codec = new Codec({ textEncoder: new TextEncoder(), textDecoder: new TextDecoder() });
  const decodeFn = async (defaultValue: T | null = null): Promise<T | null> => {
    let result: T | null;
    const dataFileLocation = await dataFileLocationFromFolderLocation(location);
    if (dataFileLocation === null) {
      return null;
    }
    try {
      const encodedContents = await fs.promises.readFile(dataFileLocation);
      result = codec.decode(decode, encodedContents);
    } catch (err) {
      log(LogLevel.Verbose, () => {
        console.error('Failed to read from "%s": %o', dataFileLocation, err);
      });
      result = null;
    }

    /**
     * If the `defaultValue` argument is provided, and `result` is still `null`,
     * try encoding the provided `defaultValue`.
     *
     * Meaning, if no `defaultValue` (e.g., `null`) is provided and the `decode` function is called,
     * no default value will be written to the data file.
     */
    if (result === null && defaultValue !== null) {
      result = await encodeFn(defaultValue);
    }

    return result;
  };

  const encodeFn = async (input: T) => {
    const dataFileLocation = await dataFileLocationFromFolderLocation(location);

    if (dataFileLocation === null) {
      return null;
    }

    const decoded = await decodeFn(
      // Do not attempt to set a default value here.
      null
    );

    /**
     * If `compare` is provided, and the decoded value is not `null`, compare it to the input value.
     * If the comparison returns `false`, it means nothing has changed, so return the input value.
     */
    if (compare !== null && decoded !== null && !compare(input, decoded)) {
      return input;
    }

    let encoded: Uint8Array;
    try {
      encoded = codec.encode(encode, input);
    } catch (reason) {
      log(LogLevel.Verbose, () => {
        console.error("Failed to encode: %o\n\nInput:\n\n%o", reason, input);
      });
      return null;
    }

    try {
      await fs.promises.writeFile(dataFileLocation, encoded);
    } catch (err) {
      log(LogLevel.Verbose, () => {
        console.error('Failed to write to "%s": %o\n\nInput:\n\n%o', dataFileLocation, err, input);
      });
      return null;
    }

    return input;
  };
  return { decode: decodeFn, encode: encodeFn };
}
