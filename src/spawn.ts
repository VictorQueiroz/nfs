import { SpawnOptionsWithoutStdio } from "node:child_process";
import buildException from "./buildException";
import asyncStreamWrite from "./asyncStreamWrite";
import chalk from "chalk";
import Exception from "./Exception";
import process from "node:process";
import { Socket } from "node:net";

export default async function spawn(
  cmd: string,
  args: ReadonlyArray<string> = [],
  options: SpawnOptionsWithoutStdio = {}
): Promise<void> {
  const child_process = await import("node:child_process");

  // Print colored command
  if (!(process.stdout instanceof Socket)) {
    await asyncStreamWrite(process.stdout, [
      ["$", chalk.green.bold(cmd), ...args.map(arg => chalk.cyan(arg))].join(" "),
      "\n"
    ]);
  }

  const child = child_process.spawn(cmd, args, {
    // env: { ...process.env, ...options.env },
    // shell: true,

    stdio: "inherit",
    ...options
  });

  return new Promise<void>((resolve, reject) => {
    child.on("error", (err: Error) => {
      reject(buildException(err));
    });
    child.on("exit", code => {
      if (code !== null && code !== 0) {
        reject(
          new Exception(
            [
              `Process exited with non-zero code.`,
              `Command: ${cmd} ${args.join(" ")}`,
              `Exit code: ${code}`
            ].join(" ")
          )
        );
      } else {
        resolve();
      }
    });
  });
}
