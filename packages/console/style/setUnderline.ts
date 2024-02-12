/**
 * Stylize a string as underline.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setUnderline('Hello') // '\u001B[4mHello\u001B[24m'
 */
export function setUnderline(text: string): string {
  return `\u001B[4m${text}\u001B[24m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should wrap a string in an underline', () => {
    const result = setUnderline('Hello')
    expect(result).toEqual('\u001B[4mHello\u001B[24m')
  })
}
