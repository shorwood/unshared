/**
 * Hide overflow of a multi-line string.
 *
 * @param text The string to hide overflow of.
 * @param maxWidth The maximum width of the string.
 * @returns The wrapped string.
 * @example overflowHidden('Hello\nWorld', 3) // 'Hel\nWor'
 */
export function overflowHidden(text: string, maxWidth: number): string {
  return text
    .split('\n')
    .map(line => line.slice(0, maxWidth))
    .join('\n')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should hide overflow of a string with multiple lines', () => {
    const result = overflowHidden('Hello\nWorld', 3)
    expect(result).toEqual('Hel\nWor')
  })
}
