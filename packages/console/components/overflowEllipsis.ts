/**
 * Hide overflow of a multi-line string with an ellipsis.
 *
 * @param text The string to hide overflow of.
 * @param maxWidth The maximum width of the string.
 * @returns The wrapped string.
 * @example overflowEllipsis('Hello\nWorld', 3) // 'Hel\n...Wor...'
 */
export function overflowEllipsis(text: string, maxWidth: number): string {
  return text
    .split('\n')
    .map(line => (line.length <= maxWidth ? line : `${line.slice(0, maxWidth - 3)}...`))
    .join('\n')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should hide overflow of a string with multiple lines', () => {
    const result = overflowEllipsis('Hello\nWorld', 3)
    expect(result).toEqual('Hel\n...Wor...')
  })
}
