import type { Awaitable } from '@unshared/functions/awaitable'
import { awaitable } from '@unshared/functions/awaitable'
import { access, constants } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

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
export function findAncestors(name: string, from = process.cwd()): Awaitable<AsyncIterable<string>, string[]> {
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
