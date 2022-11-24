import { PathLike } from 'node:fs'
import { FileHandle } from 'node:fs/promises'

// TODO: Support .yaml files
// TODO: Support .toml files
// TODO: Support .xml files
// TODO: Support .ini files
// TODO: Support .csv files
// TODO: Support .tsv files
// TODO: Support .env files
// TODO: Support .properties files
// TODO: Support .xslx files

/**
 * Exports an object as a JSON file.
 * @param pathOrFd The path or file descriptor to the output file.
 * @param object The object to export.
 * @return A promise that resolves when the file has been written.
 * @throws If the file could not be written.
 */
export const saveObject = async(pathOrFd: PathLike | FileHandle, object: unknown): Promise<void> => {
  const { writeFile } = await import('node:fs/promises')
  const json = JSON.stringify(object, undefined, 2)
  return await writeFile(pathOrFd, json)
}