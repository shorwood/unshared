/**
 * Check if the current environment is Deno.
 *
 * @returns `true` if the current environment is Deno
 */
export function isDeno(): boolean {
  return typeof process !== 'undefined'
    && typeof process.versions.deno === 'string'
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return true if the current environment is Deno', () => {
    vi.stubGlobal('process', { versions: { deno: '0.0.0' } })
    const result = isDeno()
    expect(result).toEqual(true)
  })

  it('should return false if the current environment is not Deno', () => {
    vi.stubGlobal('process', { versions: { deno: undefined } })
    const result = isDeno()
    expect(result).toEqual(false)
  })

  it('should return false if the current environment is browser', () => {
    vi.stubGlobal('process', {})
    const result = isDeno()
    expect(result).toEqual(false)
  })
}
