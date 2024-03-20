import { TimeLike } from 'node:fs'
import { mkdir, stat, utimes, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface TouchOptions {
  /**
   * The time to set as the file's last access time.
   *
   * @default Date.now()
   */
  accessTime?: TimeLike
  /**
   * The time to set as the file's last modified time.
   *
   * @default Date.now()
   */
  modifiedTime?: TimeLike
}

/**
 * Touch a file at the given path. You can optionally specify the access and modified times
 * to set on the file. If the file does not exists, an empty file and any missing parent
 * folders will be created.
 *
 * @param path The path to the file to touch.
 * @param options The access and modified times to set on the file.
 * @returns A promise that resolves when the file has been touched.
 * @example
 * // Touch a file with a specific access and modified time.
 * await touch('/foo/bar.txt', { accessTime: 1000, modifiedTime: 2000 })
 *
 * // Check the file's access and modified times.
 * const stats = await stat('/foo/bar.txt')
 * expect(stats.atimeMs).toEqual(1000)
 * expect(stats.mtimeMs).toEqual(2000)
 */
export async function touch(path: string, options: TouchOptions = {}): Promise<void> {
  const {
    accessTime = Date.now(),
    modifiedTime = Date.now(),
  } = options

  // --- If the path does not exist, then create it.
  const fileExists = await stat(path)
    .then(() => true)
    .catch(() => false)

  if (!fileExists) {
    const fileDirectory = dirname(path)
    await mkdir(fileDirectory, { recursive: true })
    await writeFile(path, [])
  }

  // --- Update the file's access and modified times.
  await utimes(path, accessTime, modifiedTime)
}

/** c8 ignore next */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should create a file if it does not exist', async() => {
    await touch('/foo.txt')
    const now = Date.now() * 1000
    const stats = await stat('/foo.txt')
    expect(stats.atimeMs).toEqual(now)
    expect(stats.mtimeMs).toEqual(now)
  })

  it('should create a nested file if the parent folder does not exist', async() => {
    await touch('/foo/bar.txt')
    const now = Date.now() * 1000
    const stats = await stat('/foo/bar.txt')
    expect(stats.atimeMs).toEqual(now)
    expect(stats.mtimeMs).toEqual(now)
  })

  it('should update the access and modified times of an existing file', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await touch('/foo.txt', { accessTime: 1000 })
    const stats = await stat('/foo.txt')
    expect(stats.atimeMs).toEqual(1000 * 1000)
  })

  it('should update the modified time of an existing file', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await touch('/foo.txt', { modifiedTime: 1000 })
    const stats = await stat('/foo.txt')
    expect(stats.mtimeMs).toEqual(1000 * 1000)
  })
}
