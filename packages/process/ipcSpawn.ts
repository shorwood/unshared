/* eslint-disable @typescript-eslint/consistent-type-imports */
import { getCaller } from '@unshared/functions/getCaller'
import { IPCCallOptions, ipcCall } from './ipcCall'
import { CallOptions } from './utils/moduleCall'

export interface IPCSpawnOptions<T extends object = object, K extends string = keyof T & string> extends CallOptions, IPCCallOptions {
  /**
   * Keep the worker alive after the call. This is useful if you want to spawn multiple functions
   * from the same module. Be aware that the worker will not be terminated until the process exits
   *
   * @default false
   */
  keepAlive?: boolean
}

/**
 * The parameters of a spawned function.
 *
 * @template T The module type.
 * @template K The export key.
 * @example SpawnParameters<typeof import('lodash'), 'add'> // [number, number]
 */
export type SpawnParameters<T, K> =
  K extends keyof T
    ? T[K] extends (...p: infer P) => unknown ? P : unknown[]
    : unknown[]

/**
 * The result of a spawned function. Will always return a promise.
 *
 * @template T The module type.
 * @template K The export key.
 * @example SpawnResult<typeof import('lodash'), 'add'> // Promise<number>
 */
export type SpawnResult<T, K> =
  K extends keyof T
    ? T[K] extends (...p: any[]) => infer R
      ? R extends Promise<infer V> ? V : R
      : unknown
    : unknown

/**
 * Call a function from a module in a separate thread and retrieve the result through IPC.
 * You have to pass the module ID and the name of the export to spawn. The function will
 * be called with the given arguments and the result will be returned.
 *
 * @param id The module ID to spawn.
 * @param options The options to use.
 * @returns A promise that resolves with the result of the function.
 * @example ipcSpawn('lodash-es', { name: 'add', parameters: [1, 2] }) // Promise<number>
 * @todo
 * Add support for [#26242](https://github.com/microsoft/TypeScript/issues/26242) when it is
 * integrated and supported by TypeScript. This would allow us to infer the named export from
 * the call parameters.
 */
export async function ipcSpawn<T extends object, K extends keyof T & string>(id: string, options: IPCSpawnOptions<T, K>): Promise<SpawnResult<T, K>>
export async function ipcSpawn<T extends object>(id: string, options: IPCSpawnOptions<T>): Promise<unknown>
/**
 * Call a function from a module in a separate thread and retrieve the result through IPC.
 * You have to pass the module ID and the name of the export to spawn. The function will
 * be called with the given arguments and the result will be returned.
 *
 * @param id The module ID to spawn.
 * @param name The name of the export to spawn.
 * @param parameters The parameters to pass to the function.
 * @returns A promise that resolves with the result of the function.
 * @example ipcSpawn('lodash-es', 'add', 1, 2) // Promise<number>
 * @todo
 * Add support for [#26242](https://github.com/microsoft/TypeScript/issues/26242) when it is
 * integrated and supported by TypeScript. This would allow us to infer the named export from
 * the call parameters.
 */
export async function ipcSpawn<T extends object, K extends keyof T>(id: string, name: K, ...parameters: SpawnParameters<T, K>): Promise<SpawnResult<T, K>>
export async function ipcSpawn<T extends object>(id: string, name: keyof T & string, ...parameters: unknown[]): Promise<unknown>
export async function ipcSpawn(id: string, name: string, ...parameters: unknown[]): Promise<unknown>
export async function ipcSpawn(id: string, ...parameters: unknown[]): Promise<unknown> {
  // --- Normalize the options.
  // @ts-expect-error: will be asserted later
  const options: IPCSpawnOptions = typeof parameters[0] === 'string'
    ? { exportName: parameters[0], args: parameters.slice(1) }
    : parameters[0]

  // --- Validate the options.
  if (typeof id !== 'string')
    throw new TypeError('Expected the module ID to be a string')
  if (typeof options !== 'object' || options === null)
    throw new TypeError('Expected the options to be an object')
  if (typeof options.exportName !== 'string')
    throw new TypeError('Expected the export name to be a string')

  // --- Call the worker and return the result.
  if (!options.caller) options.caller = getCaller()
  const workerUrl = new URL('ipcSpawn.worker.ts', import.meta.url)
  return ipcCall(workerUrl, 'spawn', { ...options, id })
}

/** c8 ignore next */
if (import.meta.vitest) {
  const idRelative = './__fixtures__/workerModule'
  const idAbsolute = new URL(idRelative, import.meta.url).pathname
  type WorkerModule = typeof import('./__fixtures__/module')

  it('should spawn a function from a module at a relative path', async() => {
    const result = await ipcSpawn<WorkerModule, 'upperCase'>(idRelative, 'upperCase', 'Hello World')
    expect(result).toEqual('HELLO WORLD')
  })

  it('should spawn a function from a module at an absolute path', async() => {
    const result = await ipcSpawn<WorkerModule, 'upperCase'>(idAbsolute, 'upperCase', 'Hello World')
    expect(result).toEqual('HELLO WORLD')
  })
}
