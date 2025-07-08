import defaults from "./config";

export default async function generateExportEnvironmentVariablesShellScript(
  inputEnvironmentVariables:
    | Map<string, string[] | string>
    | Readonly<Record<string, string | string[]>>
) {
  const { TextStream } = await import("@textstream/core");
  const cs = new TextStream();

  if (!(inputEnvironmentVariables instanceof Map)) {
    inputEnvironmentVariables = new Map(Object.entries(inputEnvironmentVariables));
  }

  const environmentVariables = Array.from(
    new Map(
      [...inputEnvironmentVariables].map(([key, value]) => [
        key,
        typeof value === "string" ? [value] : value
      ])
    )
  );

  cs.write("#!/bin/bash\n\n");

  for (const item of environmentVariables) {
    const [key, value] = item;
    cs.write(`${key}=${Array.from(new Set(value)).join(":")}\n`);
    cs.write(`export ${key}\n`);
    if (item !== environmentVariables[environmentVariables.length - 1]) {
      cs.write("\n");
    }
  }

  // Fail if the NFS directory environment variable is not defined
  // cs.write(
  //   `if [ -z "$${defaults.environmentVariableNames.nfsDirectory}" ]; then\n`,
  //   () => {
  //     cs.write("echo 'NFS_DIR environment variable is not defined'\n");
  //     cs.write("exit 1\n");
  //   },
  //   "fi\n"
  // );

  cs.write("\n");
  cs.write(
    `nfs() {\n`,
    () => {
      cs.write('nfs-js "$@" || exit 1\n');
      cs.write('nfs-js env "$@"\n');
      cs.write('eval "$(nfs-js env "$@")"\n');
    },
    "}\n"
  );

  return cs;
}
