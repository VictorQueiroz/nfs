import { ConfigurationInformation, InstallationInformation } from "../traits.jsb";

// The "prefix" is where the `usr`, `src`, `share`, and `lib` folders sit

export type NodeVersionInstallationInformation {
  NodeVersionInstallationInformationReference id;
  // Absolute path of the Node.js named environment prefix
  string location;
  // Information used during Node.js build
  NodeVersionInstallationBuildInformation buildInformation;
}

export type NodeVersionInstallationBuildInformation {
  // Source code location, defaults to `<prefix>/src`
  string location;
  // Arguments used to configure the compilation
  vector<string> configureArguments;
}

export type NodeFromScratchInstallationConfigurationInformation : ConfigurationInformation {
  optional<NodeVersionInstallationInformationReference> defaultInstallation;
}

export type NodeFromScratchInstallationInformation : InstallationInformation {
  // Root directory of NFS installation
  string location;
  // A list of directories that a list of Node.js installation prefixes inside them,
  // marked by the presence of `data.bin` file
  set<string> installRootDirectories;
}

export type NodeVersionInstallationInformationReference {
  string name;
  string version;
}
