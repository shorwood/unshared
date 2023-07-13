import { PathLike } from 'node:fs'
import { stat } from 'node:fs/promises'
import { vol } from 'memfs'

/**
 * Check if a path points to a file.
 *
 * @param path The path to check.
 * @returns `true` if the path points to a fil.
 * @example isFile('/file.txt') // true
 */
export async function isFile(path: PathLike): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isFile()
  }
  catch { /** Ignore */ }
  return false
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true if the path points to a file', async() => {
    vol.fromJSON({ '/file.txt': 'Hello World!' })
    const result = await isFile('/file.txt')
    expect(result).toEqual(true)
  })

  it('should return false if the path points to a directory', async() => {
    vol.fromJSON({ '/dir': undefined })
    const result = await isFile('/dir')
    expect(result).toEqual(false)
  })

  it('should return false if the path does not exist', async() => {
    const result = await isFile('/file.txt')
    expect(result).toEqual(false)
  })

  it('should throw if the path is not a string', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => isFile(123)
    expect(shouldThrow).toThrow(TypeError)
  })
}
