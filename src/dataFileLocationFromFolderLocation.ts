import assert from "node:assert";

export default async function dataFileLocationFromFolderLocation(
  location: string,
) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  let dataFileLocation: string;
  try {
    await fs.promises.access(location, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    await fs.promises.mkdir(location, { recursive: true });
  }
  try {
    assert.strict.ok(
      (await fs.promises.stat(location)).isDirectory(),
      `${location} is not a directory`,
    );
    dataFileLocation = path.resolve(location, "data.bin");
  } catch (err) {
    return null;
  }
  return dataFileLocation;
}
