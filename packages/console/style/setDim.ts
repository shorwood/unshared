/**
 * Dim a string.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setDim('Hello') // => '\u001B[2mHello\u001B[22m'
 */
export function setDim(text: string): string {
  return `\u001B[2m${text}\u001B[22m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should dim a string', () => {
    const result = setDim('Hello')
    expect(result).toEqual('\u001B[2mHello\u001B[22m')
  })
}
