export interface INodeVersionInfo {
  version: string;
  date: string;
  files: string[];
  npm: string;
  v8: string;
  uv: string;
  zlib: string;
  openssl: string;
  modules: string;
  lts: boolean;
  security: boolean;
}

/**
 * Prints a nicely formatted string with information about a given Node.js version.
 *
 * @param {INodeVersionInfo} versionInfo - The information about the Node.js version to be printed.
 *
 * @returns {Promise<void>} - A promise that resolves when all the information has been printed.
 */
export default async function prettyPrintNodejsVersionInformation(versionInfo: INodeVersionInfo) {
  const chalk = (await import("chalk")).default;
  const { version, date, files, npm, v8, uv, zlib, openssl, modules, lts, security } = versionInfo;

  console.log(chalk.bold.cyan(`\nNode.js Version ${version}`));
  console.log(chalk.gray(`Released on ${date}`));
  console.log("");

  const printField = (label: string, value: string | string[]) => {
    const formattedLabel = chalk.bold.white(`${label}:`);
    const formattedValue = Array.isArray(value)
      ? chalk.green(value.join(", "))
      : chalk.green(value);
    console.log(`${formattedLabel} ${formattedValue}`);
  };

  printField("npm", npm);
  printField("V8", v8);
  printField("libuv", uv);
  printField("zlib", zlib);
  printField("OpenSSL", openssl);
  printField("Modules", modules);
  printField("Files", files);
  printField("LTS", lts ? chalk.bgGreen.black(" YES ") : chalk.bgRed.white(" NO "));
  printField(
    "Security Fix",
    security ? chalk.bgGreen.black(" YES ") : chalk.bgYellow.black(" NO ")
  );
}
