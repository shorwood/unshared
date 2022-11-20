import { getEnvironment } from './getEnvironment'

/**
 * Get a variable from the environment.
 * @param name Name of the variable.
 * @param transform Transform function to apply to the variable.
 * @returns The variable's value.
 * @example
 * getVariable('MY_VARIABLE', Number.parseInt) // => 42
 * getVariable('MY_VARIABLE_DEFAULTED', 'Hello World!') // => 'Hello World!'
 */
export function getVariable(name: string): string | undefined
export function getVariable<U>(name: string, transform?: U): string | U | undefined
export function getVariable<U>(name: string, transform?: (value?: string | boolean, name?: string) => U): U | undefined
export function getVariable(name: string, transform?: unknown | Function): unknown {
  const environment = getEnvironment()
  const value = environment[name]
    ?? environment[`VITE_${name}`]
    ?? environment[`SNOWPACK_PUBLIC_${name}`]
    ?? environment[`REACT_APP_${name}`]
    ?? environment[`NEXT_PUBLIC_${name}`]
    ?? environment[`GATSBY_${name}`]
    ?? environment[`NUXT_ENV_${name}`]
    ?? environment[`DANGEROUSLY_SET_${name}`]

  // --- Transforms/default the value.
  return typeof transform === 'function'
    ? transform(value, name)
    : value ?? transform
}
