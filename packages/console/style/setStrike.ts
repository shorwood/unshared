/**
 * Stylize a string as strikethrough.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setStrike('Hello') // '\u001B[9mHello\u001B[29m'
 */
export function setStrike(text: string): string {
  return `\u001B[9m${text}\u001B[29m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should wrap a string in a strikethrough', () => {
    const result = setStrike('Hello')
    expect(result).toEqual('\u001B[9mHello\u001B[29m')
  })
}
