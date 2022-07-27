import { isNode } from './runtime'

// TODO: Split this into a separate file.
// TODO: Improved tree-shaking

/** Current process's environment object. */
export const environment = isNode ? process.env : {}

/** Is process running in development environment. */
export const isDevelopment = environment.DEV === 'true' || environment.NODE_ENV !== 'production'

/** Is process running in production environment. */
export const isProduction = !isDevelopment

/**
 * Get a variable from the environment.
 * @param name Name of the variable.
 * @param transform Transform function to apply to the variable.
 * @returns The variable's value.
 * @example
 * ```ts
 * getVariable('MY_VARIABLE', Number.parseInt) // => 42
 * ```
 */
export const getVariable = <U = string>(name: string, transform?: (value?: string) => U): U | undefined => {
  if (!isNode) return undefined
  const value = process.env[name] ?? process.env[`VITE_${name}`]
  return transform?.(value) ?? value as any
}
