/**
 * Normalize the indentation of a multi-line string. The indentation of the first
 * line is used as the base indentation for the whole string.
 *
 * @param string The string to dedent.
 * @returns The dedented string.
 * @throws If the value is not a string.
 * @example
 * dedent(`
 *   def write_hello_world():
 *     with open('hello_world.txt', 'w') as f:
 *       f.write('Hello world!')
 * `)
 */
export const dedent = (string: string): string => {
  // --- Split the string into lines and remove empty lines.
  const lines = string.split('\n').filter(x => x.trim() !== '')

  // --- Return early if the string is empty or has only one line.
  if (lines.length === 0) return string
  if (lines.length === 1) return string.trim()

  // --- Get the minimum indentation of all lines.
  const indentations = lines.map(line => line.length - line.trimStart().length)
  const indentation = Math.min(...indentations)

  // --- Dedent the string.
  return string
    .split('\n')
    .map(line => line.slice(indentation))
    .join('\n')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should dedent a string with space indent', () => {
    const result = dedent('\n    Hello\n      World\n')
    expect(result).toEqual('Hello\n  World\n')
  })

  it('should dedent a string with tab indent', () => {
    const result = dedent('\n\t\tHello\n\t\t\tWorld')
    expect(result).toEqual('Hello\n\tWorld')
  })

  it('should dedent a string with mixed indent', () => {
    const result = dedent('\n\t\tHello\n      World')
    expect(result).toEqual('Hello\n  World')
  })
}
