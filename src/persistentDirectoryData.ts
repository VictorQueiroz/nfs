import { Codec, Deserializer, Serializer } from "@jsbuffer/codec";
import fs from "fs";
import dataFileLocationFromFolderLocation from "./dataFileLocationFromFolderLocation";

export interface IPersistentDirectoryData<T> {
  decode: (defaultValue: T | null) => Promise<T | null>;
  encode: (value: T) => Promise<T | null>;
}

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
      console.error('Failed to read from "%s": %o', dataFileLocation, err);
      result = null;
    }
    /**
     * If the `defaultValue` argument is provided, and `result` is still `null`,
     * try encoding the providerd `defaultValue`.
     */
    result = result ?? (defaultValue !== null ? await encodeFn(defaultValue) : null);

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

    if (compare !== null && decoded !== null && !compare(input, decoded)) {
      return input;
    }

    let encoded: Uint8Array;
    try {
      encoded = codec.encode(encode, input);
    } catch (reason) {
      console.error("Failed to encode: %o", reason);
      return null;
    }

    try {
      await fs.promises.writeFile(dataFileLocation, encoded);
    } catch (err) {
      console.error('Failed to write to "%s": %o', dataFileLocation, err);
      return null;
    }

    return input;
  };
  return { decode: decodeFn, encode: encodeFn };
}
