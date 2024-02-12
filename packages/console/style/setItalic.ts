/**
 * Stylize a string as italic.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setItalic('Hello') // '\u001B[3mHello\u001B[23m'
 */
export function setItalic(text: string): string {
  return `\u001B[3m${text}\u001B[23m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should wrap a string in an italic', () => {
    const result = setItalic('Hello')
    expect(result).toEqual('\u001B[3mHello\u001B[23m')
  })
}
