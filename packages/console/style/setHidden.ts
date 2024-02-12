/**
 * Hide a string from the console.
 *
 * @param text The string to hide.
 * @returns The hidden string.
 * @example setHidden('Hello') // => '\u001B[8mHello\u001B[28m'
 */
export function setHidden(text: string): string {
  return `\u001B[8m${text}\u001B[28m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should hide a string', () => {
    const result = setHidden('Hello')
    expect(result).toEqual('\u001B[8mHello\u001B[28m')
  })
}
