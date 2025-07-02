import { INodeVersionInfo } from "./prettyPrintNodejsVersionInformation";

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
