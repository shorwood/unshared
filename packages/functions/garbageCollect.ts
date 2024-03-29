/* eslint-disable @typescript-eslint/no-var-requires */
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import { nextGarbageCollection } from './nextGarbageCollection'

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
  // --- Use the global function if it is available.
  if (typeof globalThis.gc === 'function') { globalThis.gc(); return }

  // --- Otherwise, use the `vm.runInNewContext()` function.
  setFlagsFromString('--expose_gc')
  runInNewContext('globalThis.gc()')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should run the garbage collector', () => {
    vi.stubGlobal('gc', vi.fn())
    garbageCollect()
    expect(globalThis.gc).toHaveBeenCalled()
  })

  it('should create a new context if the global function is not available', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.stubGlobal('gc', undefined)
    const object = { foo: 'bar' }
    const result = nextGarbageCollection(object, { timeout: 1 })
    garbageCollect()
    expect(result).resolves.toEqual(undefined)
  })
}
