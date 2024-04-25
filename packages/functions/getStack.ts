/**
 * Get the call stack of the current function. This function is useful for
 * debugging and logging but should not be used in production code as it uses
 * an hacky way to get the stack by throwing an error and parsing the stack
 * from the error.
 *
 * @returns The file paths of the stack frames.
 * @example getStack() // ['/home/user/project/foo.js', '/home/user/project/index.js']
 */
export function getStack() {
  // eslint-disable-next-line unicorn/error-message
  return new Error().stack
    ?.match(/(?:file:\/\/)?(\/.*)\.\w+/g)
    ?.map(file => file.replace('file://', '')) ?? []
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return the stack of the current function', () => {
    const result = getStack()
    const expected = import.meta.url.slice(7)
    expect(result[0]).toStrictEqual(expected)
  })
}
