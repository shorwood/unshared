import { randomInt } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export interface CreateTemporaryFileOptions {

  /**
   * The directory to create the temporary file in.
   * Defaults to the system's temporary directory.
   *
   * @default tmpdir()
   */
  directory?: string

  /**
   * The file extension to use for the temporary file.
   *
   * @default ''
   */
  extension?: string

  /**
   * A function that generates a random string.
   *
   * @default () => Math.random().toString(36).slice(2)
   */
  random?: () => string
}

/**
 * Create a temporary file with a random name and return
 * an object containing the file path, and a function to
 * remove the file.
 *
 * @param content The content to write to the temporary file.
 * @param options The options to create the temporary file.
 * @returns A promise that resolves to the temporary file object.
 * @example
 * // Create a temporary file with the specified content.
 * const [path, remove] = await createTemporaryFile('Hello, world!')
 *
 * // Do something with the file.
 * exec(`openssl sha1 ${path}`)
 *
 * // Remove the file.
 * await remove()
 */
export async function createTemporaryFile(content?: Parameters<typeof writeFile>[1], options: CreateTemporaryFileOptions = {}) {
  const {
    directory = tmpdir(),
    extension,
    random = () => randomInt(0, 1e6).toString(36),
  } = options

  // --- Generate a random name.
  const rand = random()
  const name = extension ? `${rand}.${extension}` : rand
  const path = join(directory, name)

  // --- Write the content to the file.
  await mkdir(directory, { recursive: true })
  await writeFile(path, content ?? '')

  // --- Return the path and a function to remove the file.
  const remove = () => rm(path, { force: true })
  return [path, remove] as const
}
