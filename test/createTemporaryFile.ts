import fs from "node:fs";
import path from "node:path";
import defaults from "../src/config";

export default async function createTemporaryFile() {
  const tmpDir = defaults.temporaryDirectory;
  const tmpFile = path.resolve(tmpDir, `nfs-test-`);

  return { fileHandle: await fs.promises.open(tmpFile, "w"), location: tmpFile };
}
