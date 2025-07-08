const defaults: {
  /**
   * The name of the installation.
   */
  installationName: string;

  /**
   * The name of the installation folder.
   */
  installationFolderName: string;

  environmentVariableNames: {
    defaultNodeEnvironmentName: string;
    defaultNodeVersion: string;
    nfsDirectory: string;
    defaultLongTermSupport: string;
  };

  nfsEnvironmentFileName: string;

  temporaryDirectory: string;
} = {
  temporaryDirectory: process.env["TMPDIR"] ?? "/tmp",
  nfsEnvironmentFileName: "environment.sh",
  installationName: "node",
  installationFolderName: "versions",
  environmentVariableNames: {
    nfsDirectory: "NFS_DIR",
    defaultNodeEnvironmentName: "NFS_DEFAULT_NODE_ENVIRONMENT_NAME",
    defaultNodeVersion: "NFS_DEFAULT_NODE_VERSION",
    defaultLongTermSupport: "NFS_DEFAULT_NODE_LTS"
  }
};

export const logLevelEnvironmentVariableName = "NFS_LOG_LEVEL";

export default defaults;
