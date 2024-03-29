/* eslint-disable jsdoc/check-param-names */
import { PathLike } from 'node:fs'
import { open, readFile, writeFile } from 'node:fs/promises'
import { MaybePromise } from '@unshared/types'
import { vol } from 'memfs'

/**
 * A callback that updates a file's contents.
 *
 * @template T The type of the file's contents.
 * @example UpdateFileCallback<string> // (content: string) => Promise<string> | string
 */
export type UpdateFileCallback<T extends Buffer | string = any> = (content: T) => MaybePromise<Buffer | string>

/**
 * Open a file, update its contents using the provided callback, and close it. The file
 * must exist before calling this function or an error will be thrown.
 *
 * @param path The path to the file to update.
 * @param callback A callback that updates the file's contents.
 * @param encoding The encoding to use when reading the file.
 * @returns A promise that resolves when the file is updated.
 * @example
 * /// Create a file.
 * await writeFile('/path/to/file.txt', 'foo')
 *
 * // Update a file's contents.
 * await updateFile('/path/to/file.txt', toUpperCase)
 *
 * // Check the file's contents.
 * await readFile('/path/to/file.txt', 'utf8') // 'FOO'
 */
export async function updateFile(path: PathLike, callback: UpdateFileCallback<Buffer>): Promise<void>
export async function updateFile(path: PathLike, callback: UpdateFileCallback<string>, encoding: BufferEncoding): Promise<void>
export async function updateFile(path: PathLike, callback: UpdateFileCallback, encoding?: BufferEncoding): Promise<void> {
  const fileHandle = await open(path, 'r+')
  const fileContents = await readFile(fileHandle, encoding)
  const newFileContents = await callback(fileContents)
  await writeFile(fileHandle, newFileContents)
  await fileHandle.close()
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should update a file with a callback using utf8 encoding', async() => {
    vol.fromJSON({ '/foo.txt': 'foo' })
    await updateFile('/foo.txt', content => content.toUpperCase(), 'utf8')
    const result = await readFile('/foo.txt', 'utf8')
    expect(result).toEqual('FOO')
  })

  it('should update a file with a callback using no encoding', async() => {
    vol.fromJSON({ '/foo.txt': 'foo' })
    await updateFile('/foo.txt', content => content.toString().toUpperCase())
    const result = await readFile('/foo.txt', 'utf8')
    expect(result).toEqual('FOO')
  })

  it('should throw an error if the file does not exist', async() => {
    const shouldThrow = updateFile('/foo.txt', content => content)
    await expect(shouldThrow).rejects.toThrow()
  })
}
