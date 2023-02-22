import Module from 'node:module'
import { ipcExpose } from './ipcExpose'

/**
 * Expose every function of the current module to be called from the `ipcCall` function.
 *
 * @param module The module to expose. Defaults to the current module.
 * @returns The exposed functions.
 * @example
 * // math.worker.ts
 * export const add = (a: number, b: number) => a + b
 * ipcExposeModule() // Exposes all functions in the current module.
 *
 * // main.ts
 * const workerPath = new URL('./math.worker.ts', import.meta.url)
 */
export function ipcExposeModule(module: Module) {
  if (!module) throw new Error('Could not find the current module')

  const exposed: Record<string, Function> = {}

  // --- Expose every function in the module.
  for (const key in module) {
    const value = module.exports[key]
    if (typeof value !== 'function') continue
    exposed[key] = ipcExpose(key, value)
  }

  // --- Return the exposed functions.
  return exposed
}
