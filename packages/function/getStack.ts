/**
 * Get the call stack of the current function.
 *
 * @returns The file paths of the stack frames.
 * @example resolveStack() // ['/home/user/project/foo.js', '/home/user/project/index.js']
 */
export function getStack() {
  // eslint-disable-next-line unicorn/error-message
  return new Error().stack
    ?.match(/(?:file:\/\/)?(\/.*)\.\w+/g)
    ?.map(file => file.replace('file://', '')) ?? []
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the stack of the current function', () => {
    const result = getStack()
    const expected = import.meta.url.slice(7)
    const isArrayString = result.every(item => typeof item === 'string')
    const isArrayAbsolute = result.every(item => item.startsWith('/'))
    expect(isArrayString, 'Expected the stack to be an array of strings')
    expect(isArrayAbsolute, 'Expected the stack to be an array of absolute paths')
    expect(result[0]).toEqual(expected)
  })
}
