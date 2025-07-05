import assert from "node:assert";

/**
 * @param {string} location
 * @returns {Promise<string>} The path to a "data.bin" file inside the given location.
 * Creates the location if it doesn't exist, and throws an error if the location is not a directory.
 */
export default async function dataFileLocationFromFolderLocation(
  location: string
): Promise<string> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const checkFileAccess = (await import("./checkFileAccess")).default;

  if (!(await checkFileAccess(location, fs.constants.R_OK | fs.constants.W_OK))) {
    await fs.promises.mkdir(location, { recursive: true });
  }

  const dataBinaryFileLocation = path.resolve(location, "data.bin");

  assert.strict.ok(
    (await fs.promises.stat(location)).isDirectory(),
    `${location} is not a directory`
  );

  return dataBinaryFileLocation;
}
