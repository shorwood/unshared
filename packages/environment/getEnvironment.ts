export interface GetEnvironmentOptions {
  /** Ignore environment variables from `process.env` */
  ignoreProcess?: boolean
  /** Ignore environment variables from `globalThis` */
  ignoreGlobal?: boolean
  /** Ignore environment variables from `.env` files */
  // ignoreDotEnv?: boolean
  /**
   * Environment namespace(s) to use for `.env` files
   *
   * @example
   * getEnvironment({ namespace: 'staging' }) // Variables from `.env.staging` will be used.
   */
  // namespace?: string | string[]
}

/**
 * Get the environment variables.
 *
 * @param options Options.
 * @returns The environment variables.
 * @example
 * getEnvironment() // => { NODE_ENV: 'development', ... }
 * getEnvironment({ ignoreProcess: true }) // => { ... }
 */
export function getEnvironment(options: GetEnvironmentOptions = {}): NodeJS.ProcessEnv {
  const { ignoreProcess } = options
  let environment: NodeJS.ProcessEnv = {}

  // --- Gather environment variables from `.env` files.
  // TODO: Support `.env` files.
  // if (!ignoreDotEnv) {
  //   const { getDotEnv } = await import('./getDotEnvironment')
  //   environment = { ...environment, ...getDotEnv() }
  // }

  // --- Gather environment variables from `process.env`.
  if (!ignoreProcess && typeof process !== 'undefined')
    environment = { ...process.env }

  // --- Return the environment.
  return environment
}
