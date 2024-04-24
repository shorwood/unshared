/* eslint-disable sonarjs/no-duplicate-string */
import { getEnvironment } from './getEnvironment'

/**
 * Get a variable from the environment.
 *
 * @param name Name of the variable.
 * @param transform Transform function to apply to the variable.
 * @returns The variable's value.
 * @example
 * getVariable('MY_VARIABLE', Number.parseInt) // => 42
 * getVariable('MY_VARIABLE_DEFAULTED', 'Hello World!') // => 'Hello World!'
 */
export function getVariable(name: string): string | undefined
export function getVariable<U>(name: string, transform?: U): U | string | undefined
export function getVariable<U>(name: string, transform?: (value?: boolean | string, name?: string) => U): U | undefined
export function getVariable(name: string, transform?: Function): unknown {
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

// TODO:

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return undefined if the variable does not exist', () => {
    const result = getVariable('NOT_A_REAL_VARIABLE')
    expect(result).toEqual(undefined)
  })

  it('should return the default value if the variable does not exist', () => {
    const result = getVariable('NOT_A_REAL_VARIABLE', 'Hello World!')
    expect(result).toEqual('Hello World!')
  })

  it('should return the default value if the variable is undefined', () => {
    const result = getVariable('UNDEFINED', 'Hello World!')
    expect(result).toEqual('Hello World!')
  })
}
