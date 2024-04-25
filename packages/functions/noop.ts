/**
 * Function that does nothing and returns undefined.
 *
 * @example noop() // undefined
 */
export function noop(): void {}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return undefined', () => {
    const result = noop()
    expect(result).toBeUndefined()
  })
}
