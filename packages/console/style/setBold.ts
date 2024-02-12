/**
 * Stylize a string as bold.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setBold('Hello') // => '\u001B[1mHello\u001B[22m'
 */
export function setBold(text: string): string {
  return `\u001B[1m${text}\u001B[22m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should wrap a string in bold', () => {
    const result = setBold('Hello')
    expect(result).toEqual('\u001B[1mHello\u001B[22m')
  })
}
