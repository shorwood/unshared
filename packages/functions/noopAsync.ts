
/**
 * Function that does nothing and returns a promise that resolves to undefined.
 *
 * @returns A promise that resolves to undefined
 * @example await noopAsync() // undefined
 */
export function noopAsync(): Promise<void> {
  return Promise.resolve()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return undefined', async() => {
    const result = noopAsync()
    expect(result).resolves.toEqual(undefined)
  })
}
