#!/usr/bin/env node

import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getString } from "cli-argument-helper/string";
import defaults from "./config";
import createEnvironment from "./createEnvironment";
import processUseCommand from "./processUseCommand";
import processListAvailableVersionsCommand from "./commands/processListAvailableVersionsCommand";

(async () => {
  const process = await import("node:process");
  const args = process.argv.slice(2);
  const rootDirectory =
    getArgumentAssignment(args, "--root-dir", getString) ??
    getArgumentAssignment(args, "-r", getString) ??
    defaults.rootDirectory;

  if (await processListAvailableVersionsCommand({ args })) {
  } else if (await processUseCommand(args)) {
  } else {
    await createEnvironment({ args, rootDirectory });
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
