/**
 * Function that does nothing and returns undefined.
 *
 * @example noop() // undefined
 */
export function noop(): void {}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return undefined', () => {
    const result = noop()
    expect(result).toEqual(undefined)
  })
}
