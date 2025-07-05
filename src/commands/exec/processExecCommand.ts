import assert from "node:assert";
import getInstallationEnvironmentVariables from "../../getInstallationEnvironmentVariables";
import getEnvironmentInformationFromArguments from "../../getEnvironmentInformationFromArguments";

/**
 * Run a command with the environment variables of the specified Node.js environment.
 *
 * @param args The command line arguments.
 * @param index The index of the first argument to be passed to the command.
 * @param rootDirectory The root directory where all the Node.js versions are installed.
 *
 * @returns `true` if the command was executed successfully.
 */
export default async function processExecCommand({
  args,
  rootDirectory,
  index
}: {
  args: string[];
  index: number;
  rootDirectory: string;
}): Promise<boolean> {
  const environmentInfo = await getEnvironmentInformationFromArguments(args, index);
  const environmentVariables = await getInstallationEnvironmentVariables(
    rootDirectory,
    environmentInfo
  );

  // TODO: If no environment information is provided, check for the currently loaded version and use it

  if (environmentVariables === null) {
    return false;
  }

  const line = args.splice(index, args.length);

  const command = line[0] ?? null;

  assert.strict.ok(command !== null, `Failed to get command from arguments`);

  const { spawn } = await import("node:child_process");

  const child = spawn(command, line.slice(1), {
    env: {
      ...process.env,
      ...Object.entries(environmentVariables).reduce<Record<string, string>>(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      )
    },
    stdio: "inherit"
  });

  await new Promise<void>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });

  return true;
}
