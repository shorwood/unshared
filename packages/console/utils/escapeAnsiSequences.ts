const ANSI_REGEX = new RegExp([
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
].join('|'), 'g')

/**
 * Escapes ANSI sequences from a string.
 *
 * @param text The string to escape.
 * @returns The escaped string.
 * @example escapeAnsiSequences('\u001B[1mHello\u001B[22m') // 'Hello'
 */
export function escapeAnsiSequences(text: string): string {
  return text.replace(ANSI_REGEX, '')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should escape ANSI sequences', () => {
    const result = escapeAnsiSequences('\u001B[1mHello\u001B[22m')
    expect(result).toEqual('Hello')
  })
}
