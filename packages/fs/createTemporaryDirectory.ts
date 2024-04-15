import { rm, mkdir } from 'node:fs/promises'
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
    random = () => Math.random().toString(36).slice(2),
  } = options

  // --- Generate a random name.
  const name = random()
  const path = join(directory, name)

  // --- Create the directory.
  await mkdir(path, { recursive: true })

  // --- Return the path and a function to remove the directory.
  const remove = () => rm(path, { recursive: true, force: true })
  return [path, remove] as const
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { statSync, existsSync } = await import('node:fs')

  it('should create an empty temporary directory in "/tmp/<random>"', async() => {
    const [path] = await createTemporaryDirectory()
    const isDirectory = statSync(path).isDirectory()
    expect(path).toMatch(/^\/tmp\/[\da-z]+$/)
    expect (isDirectory).toEqual(true)
  })

  it('should create a temporary directory in the specified directory', async() => {
    const [path] = await createTemporaryDirectory({ directory: '/cache' })
    expect(path).toMatch(/^\/cache\/[\da-z]+$/)
  })

  it('should recursively create the specified directory', async() => {
    const [path] = await createTemporaryDirectory({ directory: '/tmp/foo/bar' })
    expect(path).toMatch(/^\/tmp\/foo\/bar\/[\da-z]+$/)
  })

  it('should create a temporary file with the given random function', async() => {
    const [path] = await createTemporaryDirectory({ random: () => 'foo' })
    expect(path).toMatch(/^\/tmp\/foo$/)
  })

  it('should remove the temporary file after calling the remove function', async() => {
    const [path, remove] = await createTemporaryDirectory()
    await remove()
    const exists = existsSync(path)
    expect(exists).toEqual(false)
  })
}
