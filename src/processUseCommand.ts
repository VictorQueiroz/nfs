import assert from "node:assert";
import { INodeEnvironmentInformation } from "./getEnvironmentInformationFromArguments";

export default async function processUseCommand(
  rootDirectory: string,
  envInfo: INodeEnvironmentInformation
) {
  const getInstallationEnvironmentVariables = (
    await import("./getInstallationEnvironmentVariables")
  ).default;
  const environmentVariables = await getInstallationEnvironmentVariables(rootDirectory, envInfo);

  assert.strict.ok(environmentVariables !== null, `Failed to get environment variables`);

  const { TextStream } = await import("@textstream/core");
  const stream = await import("node:stream");
  const process = await import("node:process");
  const cs = new TextStream();

  for (const [key, value] of Object.entries(environmentVariables)) {
    cs.write(`${key}=${value}\n`);
  }

  await stream.promises.pipeline(
    stream.PassThrough.from([new TextEncoder().encode(cs.value())]),
    process.stdout
  );

  return true;
}
