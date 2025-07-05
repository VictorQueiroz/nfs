import { INodeVersionEnvironmentVariables } from "./originalEnvironmentVariables";

/**
 * Prints a shell script to stdout that activates a Node.js version.
 *
 * This function will write a shell script to stdout that contains the
 * necessary environment variables to activate a Node.js version. The
 * shell script is written in a format that is compatible with Bash, Zsh,
 * and Fish.
 *
 * @param environmentVariables - The environment variables that are needed
 * to activate the Node.js version.
 */
export default async function printActivationShellScript(
  environmentVariables: INodeVersionEnvironmentVariables
) {
  const { TextStream } = await import("@textstream/core");
  const stream = await import("node:stream");
  const process = await import("node:process");
  const cs = new TextStream();

  for (const [key, value] of new Map([
    ["PATH", environmentVariables.PATH],
    ["MANPATH", environmentVariables.MANPATH]
  ])) {
    cs.write(`${key}=${Array.from(new Set(value)).join(":")}\n`);
    cs.write(`export ${key}\n\n`);
  }

  await stream.promises.pipeline(
    stream.PassThrough.from([new TextEncoder().encode(cs.value())]),
    process.stdout
  );
}
