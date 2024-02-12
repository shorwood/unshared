/**
 * Wrap a string to make it blink in the console.
 *
 * @param text The string to wrap.
 * @returns The wrapped string.
 * @example setBlink('Hello') // => '\u001B[5mHello\u001B[25m'
 */
export function setBlink(text: string): string {
  return `\u001B[5m${text}\u001B[25m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should wrap a string in blink', () => {
    const result = setBlink('Hello')
    expect(result).toEqual('\u001B[5mHello\u001B[25m')
  })
}
