/**
 * Normalize the indentation of a multi-line string. The indentation of the first
 * line is used as the base indentation for the whole string.
 *
 * @param string The string to dedent.
 * @returns The dedented string.
 * @throws If the value is not a string.
 * @example
 * const result = dedent(`
 *   def write_hello_world():
 *     with open('hello_world.txt', 'w') as f:
 *       f.write('Hello world!')
 * `)
 */
export const dedent = (string: string): string => {
  if (typeof string !== 'string')
    throw new TypeError('Value must be a string')

  // --- Computes the base indentation of the string
  const lines = string.split('\n')
  const firstLine = lines[1]
  const indentation = firstLine.indexOf(firstLine.trimStart())

  // --- Dedent the string
  return lines
    .map(line => line.slice(indentation))
    .join('\n')
    .trim()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should dedent a string with space tabulation', () => {
    const result = dedent('\n    Hello\n      World')
    expect(result).toEqual('Hello\n  World')
  })

  it('should dedent a string with tab tabulation', () => {
    const result = dedent('\n\t\tHello\n\t\t\tWorld')
    expect(result).toEqual('Hello\n\tWorld')
  })

  it('should throw when value is not a string', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => dedent(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
