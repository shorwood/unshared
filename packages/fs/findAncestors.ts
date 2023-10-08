import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { vol } from 'memfs'

/**
 * Find all ancestors of a file from a given path. The search will start
 * from the given path and will continue until the root directory is reached.
 * If the file is not found, an empty array will be returned.
 *
 * @param name The file name to find.
 * @param path The path to start from.
 * @returns The absolute paths of the files found.
 * @example findAncestors('.npmrc', cwd()) // ['/home/user/project/.npmrc', '/home/user/.npmrc']
 */
export async function findAncestors(name: string, path: string): Promise<string[]> {
  const paths: string[] = []
  while (path !== '/') {
    const absolutePath = resolve(path, name)
    try {
      await access(absolutePath, constants.F_OK)
      paths.push(absolutePath)
    }
    catch {}
    path = dirname(path)
  }
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
}
