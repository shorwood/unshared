/**
 * Return the last portion of a path. Similar to the `path.basename`
 * method from Node.js but this method will also remove the extension.
 * Often used to extract the file name from a fully qualified path or URL.
 *
 * @param path The path to extract the file name from.
 * @returns The file name without the extension.
 * @example filename('/path/to/file.ext') // 'file'
 */
export function filename(path: string): string {
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

  it('should throw if no file name is found', () => {
    const shouldThrow = () => filename('http://')
    expect(shouldThrow).toThrow(Error)
  })
}
