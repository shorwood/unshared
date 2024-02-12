import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { vol } from 'memfs'

/**
 * Find the first ancestor of a file from a given path. The search will start
 * from the given path and will continue until the root directory is reached.
 * If the file is not found, will throw an error.
 *
 * @param name The file name to find.
 * @param from The path to start from.
 * @returns The absolute path of the file found.
 * @example
 * // Create a file in the root directory.
 * await writeFile('/home/user/file.txt', 'Hello, world!')
 *
 * // Find the file from a subdirectory.
 * await findAncestor('file.txt', '/home/user/project') // '/home/user/file.txt'
 */
export async function findAncestor(name: string, from: string): Promise<string | undefined> {
  while (from !== '') {
    const absolutePath = resolve(from, name)
    try {
      await access(absolutePath, constants.F_OK)
      return absolutePath
    }
    catch {
      /** Ignore error. */
    }
    if (from === '/') break
    from = dirname(from)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve ancestor at current directory', async() => {
    vol.fromJSON({ '/home/user/project/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toEqual('/home/user/project/.npmrc')
  })

  it('should resolve ancestor at parent directory', async() => {
    vol.fromJSON({ '/home/user/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toEqual('/home/user/.npmrc')
  })

  it('should resolve ancestor at root directory', async() => {
    vol.fromJSON({ '/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toEqual('/.npmrc')
  })

  it('should resolve the first ancestor', async() => {
    vol.fromJSON({
      '/home/user/project/.npmrc': '',
      '/home/user/.npmrc': '',
      '/.npmrc': '',
    })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toEqual('/home/user/project/.npmrc')
  })

  it('should return undefined if no ancestor', async() => {
    vol.fromJSON({})
    const result = await findAncestor('file', '/')
    expect(result).toEqual(undefined)
  })
}
