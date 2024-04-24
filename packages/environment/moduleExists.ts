import { createRequire } from 'node:module'

/**
 * Determines if a module exists safely.
 *
 * @param moduleId The module ID to check.
 * @returns `true` if the module exists, `false` otherwise.
 * @example moduleExists('node:fs') // true
 */
export function moduleExists(moduleId: string): boolean {
  try {
    createRequire(import.meta.url).resolve(moduleId)
    return true
  }
  catch {
    return false
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return true when passing a native module', () => {
    const result = moduleExists('node:fs')
    expect(result).toEqual(true)
  })

  it('should return false if the module does not exist', () => {
    const result = moduleExists('not-a-real-module')
    expect(result).toEqual(false)
  })
}
