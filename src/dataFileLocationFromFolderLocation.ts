import assert from "node:assert";

export default async function dataFileLocationFromFolderLocation(location: string) {
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
