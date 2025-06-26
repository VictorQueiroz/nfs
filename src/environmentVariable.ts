export default function environmentVariable(key: string) {
  return process.env[key] ?? null;
}
