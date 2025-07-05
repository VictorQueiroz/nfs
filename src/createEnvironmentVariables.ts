/**
 * Creates a new `NodeJS.ProcessEnv` object from the given `env` object by
 * joining all string arrays with a space separator and removing any null/undefined
 * values.
 *
 * @param env The environment variables to create the new `ProcessEnv` object from.
 * @returns A new `ProcessEnv` object.
 */
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
