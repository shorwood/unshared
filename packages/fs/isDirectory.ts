import { PathLike } from 'node:fs'
import { stat } from 'node:fs/promises'
import { vol } from 'memfs'

/**
 * Check if a path points to a directory.
 *
 * @param path The path to check.
 * @returns `true` if the path points to a file.
 * @example isDirectory('/directory/') // true
 */
export async function isDirectory(path: PathLike): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  }
  catch { /** Ignore */ }
  return false
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true if the path points to a directory', async() => {
    vol.fromJSON({ '/dir': undefined })
    const result = await isDirectory('/dir')
    expect(result).toEqual(true)
  })

  it('should return false if the path points to a file', async() => {
    vol.fromJSON({ '/file.txt': 'Hello World!' })
    const result = await isDirectory('/file.txt')
    expect(result).toEqual(false)
  })

  it('should return false if the path does not exist', async() => {
    const result = await isDirectory('/file.txt')
    expect(result).toEqual(false)
  })

  it('should throw if the path is not a string', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => isDirectory(123)
    expect(shouldThrow).toThrow(TypeError)
  })
}
