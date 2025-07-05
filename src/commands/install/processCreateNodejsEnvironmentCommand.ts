import getIndexBasedArgumentSequence from "../../getIndexBasedArgumentSequence";
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getInteger } from "cli-argument-helper/number";
import { getArgument } from "cli-argument-helper";
import installNodeVersion from "./installNodeVersion";
import { INodeEnvironmentInformation } from "../../getEnvironmentInformationFromArguments";
import findSingleNodeInstallInformation from "../../findSingleNodeInstallInformation";

export interface ICreateEnvironmentParams {
  rootDirectory: string;
  environmentInformation: INodeEnvironmentInformation;
}

/**
 * Process the `create` command.
 *
 * @param args The command line arguments.
 * @param params The parameters of the command.
 * @returns `true` if the command was executed successfully.
 */
export default async function processCreateNodejsEnvironmentCommand(
  args: string[],
  params: ICreateEnvironmentParams
): Promise<boolean> {
  const { rootDirectory, environmentInformation } = params;

  // Handle potentially new Node.js installation
  await findSingleNodeInstallInformation(rootDirectory, environmentInformation);

  const configureArguments = getIndexBasedArgumentSequence(args, "--configure", ";");

  const jobs =
    getArgumentAssignment(args, "--jobs", getInteger) ??
    getArgumentAssignment(args, "-j", getInteger) ??
    1;

  await installNodeVersion({
    rootDirectory,
    version: environmentInformation.version,
    reconfigure: getArgument(args, "--reconfigure") !== null,
    name: environmentInformation.environmentName,
    clean: getArgument(args, "--clean") !== null,
    install: getArgument(args, "--build-only") === null,
    configure: configureArguments !== null ? { arguments: configureArguments } : null,
    jobs,
    keep: getArgument(args, "--keep") !== null
  });

  return true;
}
