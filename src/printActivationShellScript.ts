import { INodeVersionEnvironmentVariables } from "./originalEnvironmentVariables";

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
