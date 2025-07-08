import { it } from "node:test";
import docker from "./docker";
import spawn from "../src/spawn";
import path from "node:path";
import fs from "node:fs";
import createTemporaryFile from "./createTemporaryFile";
import TextStream from "@textstream/core";

it("should create `environment.sh`", async () => {
  Error.stackTraceLimit = Infinity;

  const { fileHandle: f, location } = await createTemporaryFile();

  const cs = new TextStream();

  cs.write("#!/bin/bash\n\n");

  // Enable debugging
  cs.write("set -e -x\n\n");

  const dependencies = [
    "build-essential",
    "make",
    "ninja-build",
    "gcc",
    "python3",
    "python3-pip",
    "python3-venv",
    "python3-dev",
    "ccache",
    "git",
    "curl",
    "gnupg",
    "apt-utils",
    "apt-transport-https",
    "ca-certificates",
    "gnupg-agent",
    "apt-file"
  ];

  cs.write("apt-get update -y\n");
  cs.write("apt-get dist-upgrade -y --install-recommends\n");
  cs.write(`apt-get install -y --install-recommends ${dependencies.join(" ")}\n`);
  cs.write("\n");

  cs.write("npm install --global /tmp/home/packed.tgz\n");
  cs.write("nfs-js init\n");
  cs.write('source "${NFS_DIR}"/environment.sh\n');
  cs.write("nfs install '^22' || exit 1\n");
  cs.write("\n");

  await f.write(cs.value());

  await spawn("npm", ["pack"], { cwd: path.dirname(__dirname) });

  const containerNfsDirectory = `/tmp/home/.local/share/nfs`;
  const temporaryNfsDirectory = path.resolve(__dirname, "../.tmp/tests/nfs");

  for await (const tgz of fs.promises.glob([path.resolve(__dirname, "../*.tgz")])) {
    await docker.run({
      image: "node:20-bookworm",
      command: "/usr/bin/bash",
      cwd: "/tmp/home",
      env: [`NFS_DIR=${containerNfsDirectory}`, "HOME=/tmp/home"],
      volumes: {
        [temporaryNfsDirectory]: containerNfsDirectory,
        [tgz]: "/tmp/home/packed.tgz",
        [`${location}`]: "/tmp/home/test.sh"
      },
      args: ["/tmp/home/test.sh"]
      // args: ["npm", "--version"]
    });
    break;
  }

  await f.close();
});
