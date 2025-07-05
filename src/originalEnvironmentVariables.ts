import assert from "node:assert";

export interface INodeVersionEnvironmentVariables {
  PATH: string[];
  MANPATH: string[];
}

/**
 * Returns the original environment variables without any NodeFromScratch prefixes.
 *
 * This is done by removing all prefixes from the current environment variables that are
 * also present in the installation information.
 *
 * @param rootDirectory The root directory where all the Node.js versions are installed.
 *
 * @returns The original environment variables without any NodeFromScratch prefixes.
 */
export default async function originalEnvironmentVariables({
  rootDirectory
}: {
  rootDirectory: string;
}): Promise<INodeVersionEnvironmentVariables> {
  const persistentLocalInstallationInformation = (
    await import("./persistentLocalInstallationInformation")
  ).default;
  const { PATH = null, MANPATH = null } = process.env;

  const transformedEnvironmentVariables = {
    PATH: [...(PATH?.split(":") ?? [])],
    MANPATH: [...(MANPATH?.split(":") ?? [])]
  };

  const nfsInstallInfo = await persistentLocalInstallationInformation(rootDirectory).decode(null);

  assert.strict.ok(nfsInstallInfo !== null, `Failed to decode installation information`);

  // Remove old prefixes from environment variables
  for (const [, value] of Object.entries(transformedEnvironmentVariables)) {
    for (const prefix of nfsInstallInfo.installRootDirectories) {
      for (let i = 0; i < value.length; i++) {
        const environmentVariableItem = value[i] ?? null;
        assert.strict.ok(environmentVariableItem !== null, `Environment variable item is null`);
        if (environmentVariableItem.startsWith(prefix)) {
          value.splice(i, 1);
          i--;
        }
      }
    }
  }

  // Original environment variables without any NFS prefixes
  return transformedEnvironmentVariables;
}
