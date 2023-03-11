import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { vol } from 'memfs'

/**
 * Find all ancestors of a file from a given path. The search will start
 * from the given path and will continue until the root directory is reached.
 * If the file is not found, an empty array will be returned.
 *
 * @param name The file name to find.
 * @param from The path to start from.
 * @returns The absolute paths of the files found.
 * @example findAncestors('.npmrc') // ['/home/user/project/.npmrc', '/home/user/.npmrc']
 */
export async function findAncestors(name: string, from: string): Promise<string[]> {
  if (typeof name !== 'string')
    throw new TypeError('Expected file name to be a string.')
  if (typeof from !== 'string')
    throw new TypeError('Expected start path to be a string.')

  // --- Initialize variables.
  const paths: string[] = []
  let last = from

  // --- Find the file in the current working directory or parent directories.
  do {
    const filePath = resolve(from, name)
    try {
      await access(filePath, constants.F_OK)
      paths.push(filePath)
    }
    catch {}
    last = from
    from = dirname(from)
  } while (from !== last)

  // --- Return the paths.
  return paths
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve ancestors', async() => {
    const json = {
      '/home/user/project/file': '',
      '/home/user/file': '',
      '/home/file': '',
      '/file': '',
    }
    vol.fromJSON(json)
    const result = await findAncestors('file', '/home/user/project')
    const expected = Object.keys(json)
    expect(result).toEqual(expected)
  })

  it('should resolve ancestors at root', async() => {
    const json = { '/file': '' }
    vol.fromJSON(json)
    const result = await findAncestors('file', '/')
    const expected = Object.keys(json)
    expect(result).toEqual(expected)
  })

  it('should return empty array if no ancestors', async() => {
    const result = await findAncestors('file', '/home/user/project')
    expect(result).toEqual([])
  })

  it('should throw if name is not a string', async() => {
    // @ts-expect-error: Invalid arguments.
    const shouldReject = () => findAncestors(1, '/home/user/project')
    expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should throw if from is not a string', async() => {
    // @ts-expect-error: Invalid arguments.
    const shouldReject = () => findAncestors('file', 1)
    expect(shouldReject).rejects.toThrow(TypeError)
  })
}
