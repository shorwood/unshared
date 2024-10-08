import type { Awaitable } from '@unshared/functions/awaitable'
import { awaitable } from '@unshared/functions/awaitable'
import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'

/**
 * Find all ancestors of a file from a given path. The search will start
 * from the given path and will continue until the root directory is reached.
 * If the file is not found, an empty array will be returned.
 *
 * @param name The file name to find.
 * @param from The path to start from.
 * @returns An awaitable iterator of the absolute paths of the files found.
 * @example
 * // Get all ancestors as an array.
 * const ancestors = await findAncestors('file', '/home/user/project')
 *
 * // Or, iterate over the ancestors one by one.
 * const ancestors = findAncestors('file', '/home/user/project')
 * for await (const ancestor of ancestors) console.log(ancestor)
 */
export function findAncestors(name: string, from: string = cwd()): Awaitable<AsyncIterable<string>, string[]> {
  async function * createIterator() {
    while (from !== '') {
      const absolutePath = resolve(from, name)
      try {
        await access(absolutePath, constants.F_OK)
        yield absolutePath
      }
      catch {

        /** Ignore error. */
      }
      if (from === '/') break
      from = dirname(from)
    }
  }

  // --- Instantiate the iterator and wrap it in an awaitable.
  const iterator = createIterator()
  return awaitable(iterator)
}

/** v8 ignore start */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  test('should resolve ancestors from current directory', async() => {
    vi.mock('node:process', () => ({ cwd: () => '/home/user/project' }))
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = await findAncestors('file')
    expect(result).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should resolve ancestors at from given directory', async() => {
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = await findAncestors('file', '/home/user/project')
    expect(result).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should be iterable', async() => {
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = findAncestors('file', '/home/user/project')
    const items = []
    for await (const item of result) items.push(item)
    expect(items).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should return empty array if no ancestors were found', async() => {
    const result = await findAncestors('filename')
    expect(result).toStrictEqual([])
  })
}
