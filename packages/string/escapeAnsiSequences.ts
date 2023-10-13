const ANSI_REGEX = new RegExp([
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
].join('|'), 'g')

/**
 * Escapes ANSI sequences from a string. Namely, it removes ANSI escape codes
 * and hyperlinks that are used in terminal emulators to display colors and
 * links.
 *
 * @param text The string to escape.
 * @returns The escaped string.
 * @example escapeAnsiSequences('\u001B[1mHello\u001B[22m') // 'Hello'
 */
export function escapeAnsiSequences(text: string): string {
  return text.replaceAll(ANSI_REGEX, '')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should escape ANSI sequences from a string', () => {
    const result = escapeAnsiSequences('\u001B[1mHello\u001B[22m')
    expect(result).toEqual('Hello')
  })

  it('should escape ANSI sequences from a string with multiple sequences', () => {
    const result = escapeAnsiSequences('\u001B[1mHello\u001B[22m \u001B[2mWorld\u001B[22m')
    expect(result).toEqual('Hello World')
  })

  it('should escape hyperlinks', () => {
    const result = escapeAnsiSequences('\u001B]8;;https://example.com\u0007Hello\u001B]8;;\u0007')
    expect(result).toEqual('Hello')
  })
}
