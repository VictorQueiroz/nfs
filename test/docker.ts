import log from "../src/log";
import spawn from "../src/spawn";

export interface IDockerCommandOptions {
  command: string;
  args: ReadonlyArray<string>;
  interactive: boolean;
  tty: boolean;
  env: ReadonlyArray<string>;
  volumes: string[] | [string, string][] | Record<string, string>;
  cwd: string;
  image: string;
  kind: DockerCommandKind;
}

export enum DockerCommandKind {
  Run,
  Exec
}

export interface IInputDockerCommandOptions extends Partial<IDockerCommandOptions> {}

function docker(options: IInputDockerCommandOptions) {
  const {
    kind = null,
    command = null,
    interactive = true,
    tty = false,
    env = [],
    image = null,
    volumes = [],
    cwd = null
  } = options;

  const args = new Array<string>();

  log.fatal(kind !== null, () => console.error(`Docker command kind is required.`));

  switch (kind) {
    case DockerCommandKind.Run:
      args.push("run");
      break;
    case DockerCommandKind.Exec:
      args.push("exec");
      break;
  }

  args.push("--rm");

  if (cwd !== null) {
    args.push("--workdir", cwd);
  }

  for (const environmentVariableAssignment of env) {
    args.push("--env", environmentVariableAssignment);
  }

  if (Array.isArray(volumes)) {
    for (const volume of volumes) {
      if (typeof volume === "string") {
        args.push("--volume", volume);
      } else {
        args.push("--volume", `${volume[0]}:${volume[1]}`);
      }
    }
  } else if (typeof volumes === "object") {
    for (const [source, target] of Object.entries(volumes)) {
      args.push("--volume", `${source}:${target}`);
    }
  }

  if (interactive) {
    args.push("--interactive");
  }

  if (tty) {
    args.push("--tty");
  }

  log.fatal(image !== null, () => console.error(`Image argument is required.`));

  args.push(image);

  log.fatal(command !== null, () => console.error(`Command argument is required.`));

  return spawn("docker", [...args, command, ...(options.args ?? [])]);
}

docker.run = function (options: Omit<IInputDockerCommandOptions, "kind">) {
  return docker({ ...options, kind: DockerCommandKind.Run });
};

export default docker;
