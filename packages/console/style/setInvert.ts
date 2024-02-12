/**
 * Invert the color of of a string.
 *
 * @param text The string to invert.
 * @returns The inverted string.
 * @example setInvert('Hello') // => '\u001B[7mHello\u001B[27m'
 */
export function setInvert(text: string): string {
  return `\u001B[7m${text}\u001B[27m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should invert the color of a string', () => {
    const result = setInvert('Hello')
    expect(result).toEqual('\u001B[7mHello\u001B[27m')
  })
}
