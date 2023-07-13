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
 * @param path The path to start from.
 * @returns The absolute path of the file found.
 * @throws {Error} If the file was not found.
 * @example findAncestor('.npmrc') // '/home/user/.npmrc'
 */
export const findAncestor = async(name: string, path: string = cwd()): Promise<string> => {
  while (path !== '/') {
    const absolutePath = resolve(path, name)
    try {
      await access(absolutePath, constants.F_OK)
      return absolutePath
    }
    catch {}
    path = dirname(path)
  }
  throw new Error(`Could not find "${name}" in the parent directories of "${path}".`)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve ancestor', async() => {
    const json = { '/home/file': '' }
    vol.fromJSON(json)
    const result = await findAncestor('file', '/home/user/project')
    expect(result).toEqual('/home/file')
  })

  it('should resolve ancestor at root', async() => {
    vol.fromJSON({ '/file': '' })
    const result = await findAncestor('file', '/')
    expect(result).toEqual('/file')
  })

  it('should throw if ancestor is not found', async() => {
    vol.fromJSON({})
    const result = findAncestor('file', '/')
    await expect(result).rejects.toThrow()
  })
}
