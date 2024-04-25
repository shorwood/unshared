/**
 * Function that does nothing and returns a promise that resolves to undefined.
 *
 * @returns A promise that resolves to undefined
 * @example await noopAsync() // undefined
 */
export function noopAsync(): Promise<void> {
  return Promise.resolve()
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a promise that resolves to undefined', async() => {
    const result = noopAsync()
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBeUndefined()
  })
}
