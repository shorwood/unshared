import { toCamelCase } from '@unshared/string'

/**
 * The default parser function that can be used to parse environment variables.
 * This parser function will parse the boolean-like values and number-like values.
 *
 * @param name The name of the environment variable
 * @param value The value of the environment variable
 * @returns The parsed value of the environment variable
 */
function DEFAULT_PARSER(name: string, value: string): boolean | number | string {
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^\d+$/.test(value)) return Number.parseInt(value)
  return value
}

/**
 * A parser function that can be used to parse environment variables.
 *
 * @param name The name of the environment variable
 * @param value The value of the environment variable
 * @returns The parsed value of the environment variable
 */
export type EnvironmentParser<T = unknown> = (name: string, value: string) => T

/**
 * Given a prefix, return all environment variables that start with that prefix
 * and return them as an object where the keys are camelCased versions of the
 * environment variable names and with the prefix removed.
 *
 * Additionally, you can provide a parser function to parse the environment variables
 * before returning them. If no parser function is provided, the number-like values
 * will be returned as numbers and the boolean-like values will be returned as booleans.
 *
 * @param prefix The prefix to filter the environment variables by
 * @param parse An optional parser function to parse the environment variables
 * @returns An object containing the environment variables that start with the prefix
 * @example
 *
 * // .env
 * APP_NAME=My App
 * APP_PORT=3000
 * APP_DEV=true
 * APP_VERSION=1.0.0
 * APP_DATABASE_TYPE=sqlite
 * APP_DATABASE_URL=sqlite://localhost
 *
 * // Extract the environment variables that start with 'APP'.
 * const config = parseEnvironments('APP')
 *
 * // Print the config object.
 * console.log(config)
 * // {
 * //   name: 'My App',
 * //   port: 3000,
 * //   dev: true,
 * //   version: '1.0.0',
 * //   databaseType: 'sqlite',
 * //   databaseUrl: 'sqlite://localhost'
 * // }
 */
export function parseEnvironments<T>(prefix: string, parse: EnvironmentParser<T>): Record<string, T>
export function parseEnvironments(prefix: string): Record<string, boolean | number | string>
export function parseEnvironments(prefix: string, parse = DEFAULT_PARSER): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  // --- Iterate over all environment variables.
  for (const key in process.env) {
    if (key.startsWith(`${prefix}_`)) {
      const name = key.slice(prefix.length).replace(/^_+/, '')
      const objectKey = toCamelCase(name)
      const objectValue = process.env[key] ?? ''
      result[objectKey] = parse(objectKey, objectValue)
    }
  }

  // --- Return the environment variables.
  return result
}
