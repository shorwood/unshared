/* eslint-disable jsdoc/check-param-names */
import type { MaybePromise } from '@unshared/types'
import type { PathLike } from 'node:fs'
import { open, readFile, writeFile } from 'node:fs/promises'

/**
 * A callback that updates a file's contents.
 *
 * @template T The type of the file's contents.
 * @example UpdateFileCallback<string> // (content: string) => Promise<string> | string
 */
export type UpdateFileCallback<T extends Buffer | string> = (content: T) => MaybePromise<Buffer | string>

/**
 * Open a file, update its contents using the provided callback, and close it. The file
 * must exist before calling this function or an error will be thrown.
 *
 * @param path The path to the file to update.
 * @param callback A callback that updates the file's contents.
 * @param encoding The encoding to use when reading the file.
 * @returns A promise that resolves when the file is updated.
 * @example
 * // Create a file.
 * await writeFile('/path/to/file.txt', 'foo')
 *
 * // Update a file's contents using a transform function.
 * await updateFile('/path/to/file.txt', toUpperCase, 'utf8')
 *
 * // Check the file's contents.
 * await readFile('/path/to/file.txt', 'utf8') // 'FOO'
 */
export async function updateFile(path: PathLike, callback: UpdateFileCallback<Buffer>): Promise<void>
export async function updateFile(path: PathLike, callback: UpdateFileCallback<string>, encoding: BufferEncoding): Promise<void>
export async function updateFile(path: PathLike, callback: UpdateFileCallback<any>, encoding?: BufferEncoding): Promise<void> {
  const fileHandle = await open(path, 'r+')
  const fileContents = await readFile(fileHandle, encoding)
  const newFileContents = await callback(fileContents)
  await writeFile(fileHandle, newFileContents)
  await fileHandle.close()
}
