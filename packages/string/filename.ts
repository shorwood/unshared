/**
 * Return the last portion of a path. Similar to the `path.basename`
 * method from Node.js but this method will also remove the extension.
 * Often used to extract the file name from a fully qualified path.
 *
 * This method also works with URLs and will extract the file name
 * from the path part of the URL.
 *
 * @param path The path to extract the file name from.
 * @returns The file name without the extension.
 * @example getFileName('/path/to/file.ext') // 'file'
 */
export const filename = (path: string): string => {
  if (typeof path !== 'string')
    throw new TypeError('Path must be a string.')

  // --- Get the file name without the extension.
  const name = path.match(/([^/]+?)(?=\.[^.]*$|$)/)?.[0]
  if (!name) throw new Error('File name not found.')
  return name
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return as-is if it is already a file name', () => {
    const result = filename('file')
    expect(result).toEqual('file')
  })

  it('should strip the extension', () => {
    const result = filename('file.ext')
    expect(result).toEqual('file')
  })

  it('should only strip the last extension', () => {
    const result = filename('file.ext.ext')
    expect(result).toEqual('file.ext')
  })

  it('should return the file name from an URL', () => {
    const result = filename('https://example.com/path/to/file.html')
    expect(result).toEqual('file')
  })

  it('should return the file name from an absolute path', () => {
    const result = filename('/path/to/file')
    expect(result).toEqual('file')
  })

  it('should return the file name from a relative path', () => {
    const result = filename('path/to/file')
    expect(result).toEqual('file')
  })

  it('should throw if the path is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => filename(123)
    expect(shouldThrow).toThrow(TypeError)
  })
}
