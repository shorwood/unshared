/* eslint-disable @typescript-eslint/no-var-requires */
import { garbageCollection } from './garbageCollection'

/**
 * Force the garbage collector to run. It allows you to free up memory that is
 * no longer being used. It is the equivalent of calling `global.gc()` in Node.js
 * but you don't need to pass the `--expose-gc` flag.
 *
 * This function throws if the garbage collector is not available. For example if
 * you are running in a browser.
 *
 * @example garbageCollect()
 * @see https://nodejs.org/api/globals.html#globals_global_gc
 */
export function garbageCollect(): void {
  // --- Use the `global.gc()` function if it is available.
  if (typeof globalThis.gc === 'function') { globalThis.gc(); return }

  // --- Otherwise, use the `vm.runInNewContext()` function.
  const { runInNewContext } = require('node:vm') as typeof import('node:vm')
  const { setFlagsFromString } = require('node:v8') as typeof import('node:v8')
  setFlagsFromString('--expose_gc')
  runInNewContext('globalThis.gc()')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should garbage collect when `globalThis.gc()` is available', () => {
    globalThis.gc = vi.fn()
    garbageCollect()
    expect(globalThis.gc).toHaveBeenCalled()
  })

  it('should garbage collect when `globalThis.gc()` is not available', () => {
    globalThis.gc = undefined
    const object = { foo: 'bar' }
    const result = garbageCollection(object, { timeout: 1 })
    garbageCollect()
    expect(result).resolves.toEqual(undefined)
  })
}
