export default async function processUseCommandFromArguments(
  rootDirectory: string,
  args: string[],
  index: number
) {
  const findSingleNodeInstallInformation = (await import("../../findSingleNodeInstallInformation"))
    .default;
  const originalEnvironmentVariables = (await import("../../originalEnvironmentVariables")).default;
  const processUseCommand = (await import("../../processUseCommand")).default;

  const isEmptyUseCommand = args.length === 0;

  if (isEmptyUseCommand) {
    const fallbackNodeInstallation = await findSingleNodeInstallInformation(rootDirectory, {
      environmentName: null,
      version: null,
      lts: null
    });

    if (fallbackNodeInstallation !== null) {
      return await processUseCommand(rootDirectory, {
        environmentName: fallbackNodeInstallation.id.name,
        version: fallbackNodeInstallation.id.version,
        lts: null
      });
    }
  }

  if (isEmptyUseCommand || args[index] === "system") {
    return await originalEnvironmentVariables({ rootDirectory });
  }

  const getEnvironmentInformationFromArguments = (
    await import("../../getEnvironmentInformationFromArguments")
  ).default;
  const findSingleNodeInstallInformationOrThrow = (
    await import("../../findSingleNodeInstallInformationOrThrow")
  ).default;

  const environmentInfo = await getEnvironmentInformationFromArguments(args, index);
  const versionInfo = await findSingleNodeInstallInformationOrThrow(rootDirectory, environmentInfo);

  return await processUseCommand(rootDirectory, {
    environmentName: versionInfo.id.name,
    version: versionInfo.id.version,
    lts: null
  });
}
