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
 * @example resolveAncestor('.npmrc') // '/home/user/.npmrc'
 */
export const resolveAncestor = async(name: string, path: string = cwd()): Promise<string> => {
  // --- Try to find the file in the current working directory or parent directories.
  while (path !== '/') {
    const filePath = resolve(path, name)
    try { await access(filePath, constants.F_OK); return filePath }
    catch {}
    path = dirname(path)
  }

  // --- If the file was not found, return undefined.
  throw new Error(`Could not find "${name}" in the parent directories of "${path}".`)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve ancestor', async() => {
    const json = { '/file': '' }
    vol.fromJSON(json)
    const result = await resolveAncestor('file', '/home/user/project')
    expect(result).toEqual('/file')
  })

  it('should resolve ancestor at root', async() => {
    vol.fromJSON({ '/file': '' })
    const result = await resolveAncestor('file', '/')
    expect(result).toEqual('/file')
  })

  it('should throw if ancestor is not found', async() => {
    vol.fromJSON({})
    const result = resolveAncestor('file', '/')
    await expect(result).rejects.toThrow()
  })

  it('should throw if name is not a string', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldReject = () => resolveAncestor(1, '/')
    expect(shouldReject).rejects.toThrow()
  })

  it('should throw if from is not a string', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldReject = () => resolveAncestor('file', 1)
    expect(shouldReject).rejects.toThrow()
  })
}
