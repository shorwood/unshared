import { randomInt } from 'node:crypto'
import { mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export interface CreateTemporaryDirectoryOptions {

  /**
   * The directory to create the temporary directory in.
   * Defaults to the system's temporary directory.
   *
   * @default tmpdir()
   */
  directory?: string

  /**
   * A function that generates a random string.
   *
   * @default () => Math.random().toString(36).slice(2)
   */
  random?: () => string
}

/**
 * Create a temporary directory with a random name and return
 * an object containing the directory path, and a function to
 * recursively remove the directory.
 *
 * @param options The options to create the temporary directory.
 * @returns A promise that resolves to the temporary directory object.
 * @example
 * // Create a temporary directory.
 * const [path, remove] = await createTemporaryDirectory()
 *
 * // Do something with the directory.
 * exec(`tar -czf ${path}.tar.gz ${path}`)
 *
 * // Remove the directory.
 * await remove()
 */
export async function createTemporaryDirectory(options: CreateTemporaryDirectoryOptions = {}) {
  const {
    directory = tmpdir(),
    random = () => randomInt(0, 1e6).toString(36),
  } = options

  // --- Generate a random name.
  const name = random()
  const path = join(directory, name)

  // --- Create the directory.
  await mkdir(path, { recursive: true })

  // --- Return the path and a function to remove the directory.
  const remove = () => rm(path, { force: true, recursive: true })
  return [path, remove] as const
}
