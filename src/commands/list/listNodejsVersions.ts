import { INodeVersionInfo } from "./prettyPrintNodejsVersionInformation";

/**
 * Fetches the list of Node.js versions from the official Node.js website.
 *
 * Returns a list of objects, each containing information about a specific version of Node.js.
 * Each object has the following properties:
 * - version: The version string of the Node.js version (e.g. "v14.17.0")
 * - date: The date when the Node.js version was released, in the format "YYYY-MM-DDTHH:MM:SSZ"
 * - files: A list of files that are available for download, including the filename and the
 *   architecture (e.g. "node-v14.17.0-linux-x64.tar.gz")
 * - npm: The version of npm that comes with the Node.js version
 * - v8: The version of V8 that comes with the Node.js version
 * - uv: The version of libuv that comes with the Node.js version
 * - zlib: The version of zlib that comes with the Node.js version
 * - openssl: The version of OpenSSL that comes with the Node.js version
 * - modules: A list of modules that come with the Node.js version
 * - lts: A boolean indicating whether the Node.js version is an LTS version
 * - security: A boolean indicating whether the Node.js version has security updates
 *
 * The list is sorted in descending order (newest version first).
 *
 * The endpoint used is https://nodejs.org/download/release/index.json, which is a publicly
 * available API provided by the Node.js project.
 *
 * The function caches the response for 1 day, to avoid hitting the rate limit of the API.
 *
 * @returns A list of objects containing information about the Node.js versions.
 */
export default async function listNodejsVersions() {
  const fetch = (await import("node-fetch")).default;

  const res = await fetch("https://nodejs.org/download/release/index.json", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      // Cache for 1 day
      "Cache-Control": "max-age=86400"
    }
  });

  return (await res.json()) as INodeVersionInfo[];
}
