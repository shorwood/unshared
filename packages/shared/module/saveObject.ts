import { PathLike } from 'node:fs'
import { FileHandle, writeFile } from 'node:fs/promises'

/**
 * Exports an object as a JSON file.
 * @param pathOrFd The path or file descriptor to the output file.
 * @param object The object to export.
 * @return A promise that resolves when the file has been written.
 */
export const saveObject = async(pathOrFd: PathLike | FileHandle, object: unknown): Promise<void> => {
  const json = JSON.stringify(object, undefined, 2)
  return await writeFile(pathOrFd, json)
}
