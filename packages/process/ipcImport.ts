/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { IPCSpawnOptions, ipcSpawn } from './ipcSpawn'

export type IPCModule<T> = ({
  [K in keyof T]: T[K] extends (...p: infer P) => infer R
    ? R extends Promise<any>
      ? (...p: P) => R
      : (...p: P) => Promise<R>
    : T[K]
})

export interface IPCImportOptions extends IPCSpawnOptions {}

/**
 * Instanciate an object that will provide all exports of a module and wrap all
 * functions to be called in a worker thread.
 *
 * ### Note #1:
 *
 * The first time a property is accessed, the module will be imported. This means
 * that if the module is not found, the error will be thrown at this time and not
 * before.
 *
 * @param id The module ID to import.
 * @param options The options to use.
 * @returns The imported module with all functions wrapped.
 * @example
 * const lodash = ipcImport<typeof import('lodash')>('lodash')
 * const result = await lodash.add(1, 2) // 3
 */
export function ipcImport<T extends object>(id: string, options: IPCImportOptions = {}): IPCModule<T> {
  let module: undefined | T

  // --- Wrap all functions in a proxy to spawn them in a worker thread.
  return new Proxy({}, {
    get(_, name: string) {
      if (!module) module = require(id) as T
      const value = Reflect.get(module, name)
      if (typeof value === 'function') return ipcSpawn.bind(undefined, id, { ...options, name })
      return value
    },
  }) as IPCModule<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  const idRelative = './__fixtures__/workerModule'
  const idAbsolute = new URL(idRelative, import.meta.url).pathname
  type WorkerModule = typeof import('./__fixtures__/module')

  it('should import a module and wrap all functions at a relative path', async() => {
    const { lowerCase } = ipcImport<WorkerModule>(idRelative)
    const result = await lowerCase('HELLO WORLD')
    expect(result).toEqual('hello world')
  })

  it('should import a module and wrap all functions at an absolute path', async() => {
    const { lowerCase } = ipcImport<WorkerModule>(idAbsolute)
    const result = await lowerCase('HELLO WORLD')
    expect(result).toEqual('hello world')
  })
}
