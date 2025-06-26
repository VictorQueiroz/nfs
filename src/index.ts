import path from "node:path";
import { getArgument } from "cli-argument-helper";
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getInteger } from "cli-argument-helper/number";
import { getString } from "cli-argument-helper/string";
import assert from "node:assert";
import {
  compareNodeVersionInstallationInformation,
  decodeNodeVersionInstallationInformation,
  encodeNodeVersionInstallationInformation,
  NodeFromScratchInstallationInformation,
  NodeVersionInstallationBuildInformation,
  NodeVersionInstallationInformation,
  updateNodeFromScratchInstallationInformation,
  updateNodeVersionInstallationInformation,
} from "../schema/0.0.1/main.jsb";
import persistentDirectoryData, {
  IPersistentDirectoryData,
} from "./persistentDirectoryData";
import diff from "diff";
import getIndexBasedArgumentSequence from "./getIndexBasedArgumentSequence";
import nativeCompiler, { CompilerLanguageType } from "./nativeCompiler";
import defaults from "./config";
import persistentLocalInstallationInformation from "./persistentLocalInstallationInformation";
import getNodeInstallInformation from "./getNodeInstallInformation";
import downloadSourceCode from "./downloadSourceCode";

interface ICreateEnvironmentParams {
  args: string[];
  rootDirectory: string;
}

async function install({
  jobs,
  name,
  prefixDirectory,
  configure,
  version,
  clean,
  installInformation,
}: {
  prefixDirectory: string;
  version: string;
  clean: boolean;
  jobs: number;
  name: string | null;
  installInformation: IPersistentDirectoryData<NodeVersionInstallationInformation>;
  configure: { arguments: string[] } | null;
}) {
  const path = await import("node:path");
  const fs = await import("node:fs");
  const console = await import("node:console");
  const { spawn } = await import("@high-nodejs/child_process");

  const { extractedArchiveFolder } = await downloadSourceCode({
    version,
    prefixDirectory,
  });

  const configureArgs = configure?.arguments ?? [
    "--prefix",
    prefixDirectory,
    "--debug",
    "--debug-node",
    "--use-prefix-to-find-headers",
    "--debug-lib",
    "--ninja",
    "--download=all",
    "--v8-non-optimized-debug",
    // "--without-node-code-cache",
    // "--v8-with-dchecks",
    // "--v8-enable-object-print",
    // "--enable-asan",
    // "--enable-ubsan",
    // "--enable-lto",
  ];

  let needsBuildConfiguration: boolean;

  try {
    await fs.promises.access(
      path.resolve(extractedArchiveFolder, "out"),
      fs.constants.R_OK | fs.constants.W_OK,
    );

    needsBuildConfiguration = false;
  } catch (reason) {
    needsBuildConfiguration = true;
  }

  const decodedNodeVersionInstallInformation =
    NodeVersionInstallationInformation({
      version,
      name,
      location: prefixDirectory,
      buildInformation: NodeVersionInstallationBuildInformation({
        configureArguments: configureArgs,
        location: extractedArchiveFolder,
      }),
    });

  let info = await installInformation.decode(
    decodedNodeVersionInstallInformation,
  );

  assert.strict.ok(
    info !== null,
    `Failed to decode Node.js installation information for version ${version} and name ${name}`,
  );

  // If configuration is already needed, we can skip this check
  if (
    !needsBuildConfiguration &&
    !compareNodeVersionInstallationInformation(
      info,
      decodedNodeVersionInstallInformation,
    )
  ) {
    const diff = await import("diff");
    const chalk = (await import("chalk")).default;

    console.warn(
      "Configuration of Node.js installation for version %s and name %s is outdated....",
      version,
      name,
    );
    console.log();

    const objectChanges = await (async (info) =>
      new Promise<diff.ChangeObject<string>[]>((resolve) =>
        diff.diffJson(
          // Default info contains the new build configure arguments.
          decodedNodeVersionInstallInformation,
          info,
          {
            callback: (result) => {
              resolve(result);
            },
          },
        ),
      ))(info);

    for (const change of objectChanges) {
      if (change.added) {
        console.log(chalk.green("+ %s"), change.value);
      } else if (change.removed) {
        console.log(chalk.red("- %s"), change.value);
      } else {
        console.log("%s", change.value);
      }
    }

    needsBuildConfiguration = true;
  }

  function createEnvironmentVariables(
    env: Record<string, string[] | string | null>,
  ): NodeJS.ProcessEnv {
    return {
      ...Object.entries(env).reduce<Record<string, string | undefined>>(
        (acc, [key, value]) => ({
          ...acc,
          [key]: Array.isArray(value) ? value.join(" ") : (value ?? undefined),
        }),
        {},
      ),
    };
  }

  const environmentVariables = createEnvironmentVariables({
    ...process.env,
    CC: ["ccache", (await nativeCompiler(CompilerLanguageType.C)).executable],
    CXX: [
      "ccache",
      (await nativeCompiler(CompilerLanguageType.CXX)).executable,
    ],
  });

  if (clean) {
    await spawn("make", ["clean"], {
      log: true,
      cwd: extractedArchiveFolder,
    }).wait();
  }

  if (configure !== null || needsBuildConfiguration) {
    await spawn(
      path.resolve(extractedArchiveFolder, "configure"),
      configureArgs,
      {
        log: true,
        cwd: extractedArchiveFolder,
        env: environmentVariables,
      },
    ).wait();

    info = await installInformation.encode(
      updateNodeVersionInstallationInformation(
        info,
        decodedNodeVersionInstallInformation,
      ),
    );
  }

  await spawn("make", ["VERBOSE=1", "--jobs", `${jobs}`], {
    log: true,
    env: environmentVariables,
    cwd: extractedArchiveFolder,
  }).wait();

  await spawn("make", ["install"], {
    env: environmentVariables,
    cwd: extractedArchiveFolder,
  }).wait();
}

async function createEnvironment(params: ICreateEnvironmentParams) {
  const fs = await import("node:fs");
  const { args, rootDirectory } = params;

  const installationInfoHandle = persistentLocalInstallationInformation();

  let installInfo = await installationInfoHandle.decode(
    NodeFromScratchInstallationInformation({
      date: Date.now(),
      rootDirectories: new Set([defaults.rootDirectory, rootDirectory]),
    }),
  );

  assert.strict.ok(
    installInfo !== null,
    `Failed to decode installation information`,
  );

  installInfo = await installationInfoHandle.encode(
    updateNodeFromScratchInstallationInformation(installInfo, {
      rootDirectories: new Set([...installInfo.rootDirectories, rootDirectory]),
    }),
  );

  const inputInstallInformation = getNodeInstallInformation({
    args,
    rootDirectory,
  });

  await fs.promises.mkdir(inputInstallInformation.prefixDirectory, {
    recursive: true,
  });

  const configureArguments = getIndexBasedArgumentSequence(
    args,
    "--configure",
    ";",
  );

  const jobs =
    getArgumentAssignment(args, "--jobs", getInteger) ??
    getArgumentAssignment(args, "-j", getInteger) ??
    1;
  const installInformation = persistentDirectoryData(
    inputInstallInformation.prefixDirectory,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation,
  );

  const clean = getArgument(args, "--clean") !== null;

  if (getArgument(args, "--install") !== null) {
    const { prefixDirectory, version, name } = inputInstallInformation;
    await install({
      prefixDirectory,
      version,
      name,
      clean,
      installInformation,
      configure:
        configureArguments !== null ? { arguments: configureArguments } : null,
      jobs,
    });
  }
}

async function handleUseCommand(args: string[]) {
  const containsUseCommand = getArgument(args, "use");

  if (containsUseCommand === null) {
    return false;
  }

  let { PATH, MANPATH } = process.env;

  const transformedEnvironmentVariables = {
    PATH: [...(PATH?.split(":") ?? [])],
    MANPATH: [...(MANPATH?.split(":") ?? [])],
  };

  const nfsInstallInfo =
    await persistentLocalInstallationInformation().decode(null);

  assert.strict.ok(
    nfsInstallInfo !== null,
    `Failed to decode installation information`,
  );

  // Remove old prefixes from environment variables
  for (const [, value] of Object.entries(transformedEnvironmentVariables)) {
    for (const prefix of nfsInstallInfo.rootDirectories) {
      for (let i = 0; i < value.length; i++) {
        const environmentVariableItem = value[i] ?? null;
        assert.strict.ok(
          environmentVariableItem !== null,
          `Environment variable item is null`,
        );
        if (environmentVariableItem.startsWith(prefix)) {
          value.splice(i, 1);
          i--;
        }
      }
    }
  }

  const targetInstallInformation = getNodeInstallInformation({
    args,
    rootDirectory: defaults.rootDirectory,
  });

  const existingInstallInfoHandle = await persistentDirectoryData(
    targetInstallInformation.prefixDirectory,
    encodeNodeVersionInstallationInformation,
    decodeNodeVersionInstallationInformation,
  ).decode(null);

  if (existingInstallInfoHandle === null) {
    console.error(
      `No installation found for ${targetInstallInformation.version}`,
    );
    process.exitCode = 1;
    return true;
  }

  // Add new values
  transformedEnvironmentVariables.PATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "bin"),
  );

  transformedEnvironmentVariables.MANPATH.unshift(
    path.resolve(existingInstallInfoHandle.location, "share/man"),
  );

  const { TextStream } = await import("@textstream/core");
  const stream = await import("node:stream");

  const cs = new TextStream();

  for (const [key, value] of Object.entries(transformedEnvironmentVariables)) {
    cs.write(`${key}=${value.join(":")}\n`);
  }

  await stream.promises.pipeline(
    stream.PassThrough.from([new TextEncoder().encode(cs.value())]),
    process.stdout,
  );

  return true;
}

(async () => {
  const process = await import("node:process");
  const args = process.argv.slice(2);
  const rootDirectory =
    getArgumentAssignment(args, "--root-dir", getString) ??
    getArgumentAssignment(args, "-r", getString) ??
    defaults.rootDirectory;

  if (await handleUseCommand(args)) {
  } else {
    await createEnvironment({ args, rootDirectory });
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
