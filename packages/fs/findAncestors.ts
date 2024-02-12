import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { awaitable, Awaitable } from '@unshared/functions/awaitable'
import { vol } from 'memfs'

/**
 * Find all ancestors of a file from a given path. The search will start
 * from the given path and will continue until the root directory is reached.
 * If the file is not found, an empty array will be returned.
 *
 * @param name The file name to find.
 * @param path The path to start from.
 * @returns An awaitable iterator of the absolute paths of the files found.
 * @example
 * // Get all ancestors as an array.
 * const ancestors = await findAncestors('file', '/home/user/project')
 *
 * // Or, iterate over the ancestors one by one.
 * const ancestors = findAncestors('file', '/home/user/project')
 * for await (const ancestor of ancestors) console.log(ancestor)
 */
export function findAncestors(name: string, path: string): Awaitable<AsyncIterable<string>, string[]> {
  async function *createIterator() {
    do {
      const absolutePath = resolve(path, name)
      try {
        await access(absolutePath, constants.F_OK)
        yield absolutePath
      }
      catch {
        /** Ignore error. */
      }
      path = dirname(path)
    } while (path !== '/')
  }

  // --- Instantiate the iterator and wrap it in an awaitable.
  const iterator = createIterator()
  return awaitable(iterator)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve ancestors at path', async() => {
    const json = {
      '/home/user/project/filename': '',
      '/filename': '',
    }
    vol.fromJSON(json)
    const result = await findAncestors('filename', '/home/user/project')
    const expected = Object.keys(json)
    expect(result).toEqual(expected)
  })

  it('should resolve ancestors at root', async() => {
    const json = { '/filename': '' }
    vol.fromJSON(json)
    const result = await findAncestors('filename', '/')
    const expected = Object.keys(json)
    expect(result).toEqual(expected)
  })

  it('should return empty array if no ancestors', async() => {
    const result = await findAncestors('filename', '/home/user/project')
    expect(result).toEqual([])
  })
}
