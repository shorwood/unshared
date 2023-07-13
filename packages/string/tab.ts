/**
 * Replace tabs with substring of spaces.
 *
 * @param string The string to replace tabs in.
 * @param spaces The number of spaces to replace each tab with. (Default: 2)
 * @returns The string with tabs replaced.
 * @example tab('\tHello World', 2) // returns '  Hello World'
 */
export const tab = (string: string, spaces = 2): string => {
  const replacement = ' '.repeat(spaces)
  return string.replace('\t', replacement)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should replace tabs with spaces', () => {
    const result = tab('\tHello World', 2)
    expect(result).toEqual('  Hello World')
  })
}
