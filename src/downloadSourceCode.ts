import assert from "node:assert";
import toValidInteger from "./toValidInteger";

export default async function downloadSourceCode({
  prefixDirectory,
  version,
}: {
  prefixDirectory: string;
  version: string;
}) {
  const stream = await import("node:stream");
  const path = await import("node:path");
  const fs = await import("node:fs");
  const fetch = (await import("node-fetch")).default;
  const tar = await import("tar");
  const { filesize } = await import("filesize");

  const srcDirectory = path.resolve(prefixDirectory, "src");
  await fs.promises.mkdir(srcDirectory, { recursive: true });

  const extractedArchiveFolder = path.resolve(srcDirectory, `node-v${version}`);
  const srcArchive = path.resolve(srcDirectory, `node-v${version}.tar.gz`);

  // perform preload request to get the archive expected size

  const baseURL = new URL(`https://nodejs.org/download/release/v${version}/`);
  const downloadArchiveUrl = new URL(`node-v${version}.tar.gz`, baseURL);

  let expectedByteLength: number;

  // Get the archive byte length
  {
    const res = await fetch(downloadArchiveUrl, {
      method: "HEAD",
    });

    const contentLengthValue = toValidInteger(
      res.headers.get("content-length"),
    );

    assert.strict.ok(
      contentLengthValue !== null,
      `Failed to determine archive byte length`,
    );

    expectedByteLength = contentLengthValue;
  }

  let existingArchive: {
    currentByteLength: number;
    expectedByteLength: number;
  } | null = null;

  try {
    await fs.promises.access(srcArchive, fs.constants.R_OK | fs.constants.W_OK);

    existingArchive = {
      currentByteLength: (await fs.promises.stat(srcArchive)).size,
      expectedByteLength,
    };

    assert.strict.ok(
      existingArchive.currentByteLength === existingArchive.expectedByteLength,
      `Existing archive is not complete, expected ${filesize(existingArchive.expectedByteLength)} ` +
        `but got ${filesize(existingArchive.currentByteLength)}.`,
    );
  } catch (err) {
    console.warn(err);

    existingArchive = existingArchive ?? {
      currentByteLength: 0,
      expectedByteLength,
    };

    const headers = new Headers({
      // force sequential download
      connection: "close",
      "accept-encoding": "gzip",
      range: `bytes=${existingArchive.currentByteLength}-${existingArchive.expectedByteLength - 1}`,
    });

    console.log("Downloading Node.js v%s", version);

    // Start downloading
    const res = await fetch(downloadArchiveUrl, {
      headers,
    });

    const { body } = res;

    assert.strict.ok(body !== null);

    (({ existingArchive }) => {
      let downloadedByteCount = existingArchive.currentByteLength;

      body
        .on("end", () => {
          process.stdout.write("\n");
        })
        .on("data", (chunk) => {
          assert.strict.ok(chunk instanceof Uint8Array);

          downloadedByteCount += chunk.length;

          const percentage =
            (downloadedByteCount / existingArchive.expectedByteLength) * 100;

          // Keep the cursor updating the same line with the download progress
          process.stdout.cursorTo(0);
          process.stdout.write(
            `${filesize(downloadedByteCount)}/${filesize(existingArchive.expectedByteLength)} (${percentage.toFixed(2)}%)`,
          );
        });
    })({
      existingArchive,
    });

    await stream.promises.pipeline(
      body,
      fs.createWriteStream(srcArchive, {
        start: existingArchive.currentByteLength,
        // Do not recreate the file
        flags: "a",
      }),
    );
  }

  // Extract
  await tar.extract({
    keepExisting: true,
    file: srcArchive,
    cwd: srcDirectory,
  });

  await fs.promises.access(
    extractedArchiveFolder,
    fs.constants.R_OK | fs.constants.W_OK,
  );

  // Make sure `extractedArchiveFolder` is a folder
  assert.strict.ok(
    (await fs.promises.stat(extractedArchiveFolder)).isDirectory(),
    `Extracted tar archive did not resulted in the expected new folder: ${extractedArchiveFolder}`,
  );

  return { extractedArchiveFolder };
}
