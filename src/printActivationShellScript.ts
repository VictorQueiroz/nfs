import { INodeVersionEnvironmentVariables } from "./originalEnvironmentVariables";

export default async function printActivationShellScript(
  environmentVariables: INodeVersionEnvironmentVariables
) {
  const process = await import("node:process");
  const generateExportEnvironmentVariablesShellScript = (
    await import("./generateExportEnvironmentVariablesShellScript")
  ).default;
  const asyncStreamWrite = (await import("./asyncStreamWrite")).default;
  const cs = await generateExportEnvironmentVariablesShellScript(
    new Map<string, string | string[]>([
      ["PATH", environmentVariables.PATH],
      ["MANPATH", environmentVariables.MANPATH]
    ])
  );

  await asyncStreamWrite(process.stdout, cs.value());
}
