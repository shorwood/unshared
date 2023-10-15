import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'
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
 * await writeFile('/home/user/.npmrc', '...')
 *
 * // Find the file from a subdirectory.
 * await findAncestor('.npmrc', '/home/user/project/src/subdir')
 */
export async function findAncestor(name: string, from: string = cwd()): Promise<string | undefined> {
  do {
    const absolutePath = resolve(from, name)
    try {
      await access(absolutePath, constants.F_OK)
      return absolutePath
    }
    catch {
      /** Ignore error. */
    }
    from = dirname(from)
  } while (from !== '/')
}

/** c8 ignore next */
if (import.meta.vitest) {
  beforeEach(() => {
    vi.mock('node:process', () => ({
      cwd: () => '/home/user/project',
    }))
  })

  it('should resolve ancestor from current directory', async() => {
    vol.fromJSON({ '/home/user/project/.npmrc': '' })
    const result = await findAncestor('.npmrc')
    expect(result).toEqual('/home/user/project/.npmrc')
  })

  it('should resolve ancestor from a custom path', async() => {
    vol.fromJSON({ '/home/user/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/custom')
    expect(result).toEqual('/home/user/.npmrc')
  })

  it('should resolve ancestor at root', async() => {
    vol.fromJSON({ '/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/')
    expect(result).toEqual('/.npmrc')
  })

  it('should return undefined if no ancestor', async() => {
    vol.fromJSON({})
    const result = await findAncestor('file', '/')
    expect(result).toEqual(undefined)
  })
}
