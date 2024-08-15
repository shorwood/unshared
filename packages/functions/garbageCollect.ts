import { GCProfiler, setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'

/**
 * Force the garbage collector to run. It allows you to free up memory that is
 * no longer being used. It is the equivalent of calling `global.gc()` in Node.js
 * but you don't need to pass the `--expose-gc` flag.
 *
 * @example garbageCollect()
 * @see https://nodejs.org/api/globals.html#globals_global_gc
 */
export function garbageCollect(): void {

  // --- If the garbage collector is not available, enable the `--expose-gc` flag.
  if (!globalThis.gc) setFlagsFromString('--expose_gc')

  // --- Run the garbage collector in a new context to avoid timing issues.
  runInNewContext('globalThis.gc()')
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should trigger a garbage collection', () => {
    const gcProfiler = new GCProfiler()
    gcProfiler.start()
    garbageCollect()
    const gcProfilerResult = gcProfiler.stop()
    expect(gcProfilerResult.statistics).toHaveLength(1)
  })

  test('should trigger multiple garbage collections', () => {
    const gcProfiler = new GCProfiler()
    gcProfiler.start()
    garbageCollect()
    garbageCollect()
    const gcProfilerResult = gcProfiler.stop()
    expect(gcProfilerResult.statistics).toHaveLength(2)
  })
}
