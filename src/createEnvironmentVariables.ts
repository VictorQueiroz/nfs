export default function createEnvironmentVariables(
  env: Record<string, string[] | string | null>
): NodeJS.ProcessEnv {
  return {
    ...Object.entries(env).reduce<Record<string, string | undefined>>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? value.join(" ") : (value ?? undefined)
      }),
      {}
    )
  };
}
