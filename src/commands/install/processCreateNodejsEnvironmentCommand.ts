import assert from "node:assert";
import getIndexBasedArgumentSequence from "../../getIndexBasedArgumentSequence";
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getInteger } from "cli-argument-helper/number";
import { getArgument } from "cli-argument-helper";
import installNodeVersion from "./installNodeVersion";
import findNodeInstallInformation from "../../findNodeInstallInformation";

export interface ICreateEnvironmentParams {
  rootDirectory: string;
  environmentName: string;
  version: string;
}

export default async function processCreateNodejsEnvironmentCommand(
  args: string[],
  params: ICreateEnvironmentParams
): Promise<boolean> {
  const { rootDirectory, environmentName, version } = params;

  // Handle potentially new Node.js installation
  const inputInstallInformationList = Array.from(
    await findNodeInstallInformation(rootDirectory, { environmentName, version })
  );

  assert.strict.ok(
    inputInstallInformationList.length <= 1,
    `Multiple node versions match name and version: ${environmentName} ${version}`
  );

  const configureArguments = getIndexBasedArgumentSequence(args, "--configure", ";");

  const jobs =
    getArgumentAssignment(args, "--jobs", getInteger) ??
    getArgumentAssignment(args, "-j", getInteger) ??
    1;

  const clean = getArgument(args, "--clean") !== null;

  await installNodeVersion({
    rootDirectory,
    version,
    name: environmentName,
    clean,
    install: getArgument(args, "--reinstall") !== null,
    configure: configureArguments !== null ? { arguments: configureArguments } : null,
    jobs
  });

  return true;
}
