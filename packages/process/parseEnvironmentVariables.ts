import { toCamelCase } from '@unshared/string'
import { env } from 'node:process'

export type EnvironmentVariablesParser<T extends Record<string, unknown>> = (environment: Record<string, string>) => T

/**
 * Given a prefix, return all environment variables that start with that prefix
 * and return them as an object where the keys are camelCased versions of the
 * environment variable names and with the prefix removed.
 *
 * @param prefix The prefix to filter the environment variables by
 * @param parse An optional parser function to parse the environment variables
 * @returns An object containing the environment variables that start with the prefix
 * @example
 *
 * // .env
 * APP_NAME=My App
 * APP_VERSION=1.0.0
 * APP_DATABASE_TYPE=sqlite
 * APP_DATABASE_URL=sqlite://localhost
 *
 * // Extract the environment variables that start with 'APP'.
 * const config = parseEnvironmentVariables('APP')
 *
 * // Print the config object.
 * console.log(config)
 * // {
 * //   name: 'My App',
 * //   version: '1.0.0',
 * //   databaseType: 'sqlite',
 * //   databaseUrl: 'sqlite://localhost'
 * // }
 */
export function parseEnvironmentVariables<T extends Record<string, unknown> = Record<string, string>>(prefix: string, parse?: EnvironmentVariablesParser<T>): T {
  const environment: Record<string, string> = {}

  // --- Iterate over all environment variables.
  for (const key in env) {
    if (key.startsWith(`${prefix}_`)) {
      const name = key.slice(prefix.length).replace(/^_+/, '')
      const objectKey = toCamelCase(name)
      const objectValue = process.env[key] ?? ''
      environment[objectKey] = objectValue
    }
  }

  // --- Return the environment variables.
  return parse ? parse(environment) : environment as T
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { createSchema, assertString } = await import('../validation/index')

  beforeEach(() => {
    vi.stubEnv('APP_NAME', 'My App')
    vi.stubEnv('APP_VERSION', '1.0.0')
    vi.stubEnv('APP_DATABASE_TYPE', 'sqlite')
    vi.stubEnv('APP_DATABASE_URL', 'sqlite://localhost')
    vi.stubEnv('APP_PORT', '3000')
    vi.stubEnv('APP_IS_ACTIVE', 'true')
    vi.stubEnv('OTHER_NAME', 'Other App')
  })

  test('should return all environment variables that start with the prefix', () => {
    const result = parseEnvironmentVariables('APP')
    expect(result).toStrictEqual({
      name: 'My App',
      version: '1.0.0',
      databaseType: 'sqlite',
      databaseUrl: 'sqlite://localhost',
      port: '3000',
      isActive: 'true',
    })
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>()
  })

  test('should return and parse all environment variables that start with the prefix', () => {
    const result = parseEnvironmentVariables('APP', createSchema({
      name: assertString,
      version: assertString,
      databaseType: assertString,
      databaseUrl: assertString,
      port: Number.parseInt,
      isActive: Boolean,
    }))
    expect(result).toStrictEqual({
      name: 'My App',
      version: '1.0.0',
      databaseType: 'sqlite',
      databaseUrl: 'sqlite://localhost',
      port: 3000,
      isActive: true,
    })
    expectTypeOf(result).toEqualTypeOf<{
      name: string
      version: string
      databaseType: string
      databaseUrl: string
      port: number
      isActive: boolean
    }>()
  })
}
