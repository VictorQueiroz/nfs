// The "prefix" is where the `usr`, `src`, `share`, and `lib` folders sit

export type NodeVersionInstallationInformation {
  // Name of the environment, if any
  optional<string> name;
  // Node.js version
  string version;
  // Absolute path of the Node.js named environment prefix
  string location;
  NodeVersionInstallationBuildInformation buildInformation;
}

export type NodeVersionInstallationBuildInformation {
  // Source code location, defaults to `<prefix>/src`
  string location;
  // Arguments used to configure the compilation
  vector<string> configureArguments;
}

export type NodeFromScratchInstallationInformation {
  int date;
  // A list of directories that have Node.js installations in them,
  // marked by the presence of `data.bin` file
  set<string> rootDirectories;
}