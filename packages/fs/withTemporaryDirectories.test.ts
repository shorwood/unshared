import { existsSync } from 'node:fs'
import { withTemporaryDirectories } from './withTemporaryDirectories'

describe('withTemporaryDirectories', () => {
  test('should call a function with one temporary directory', async() => {
    await withTemporaryDirectories(1, (path) => {
      const exists = existsSync(path)
      expect(exists).toBe(true)
    })
  })

  test('should call a function with two temporary directories', async() => {
    await withTemporaryDirectories(2, (path1, path2) => {
      const exists1 = existsSync(path1)
      const exists2 = existsSync(path2)
      expect(exists1).toBe(true)
      expect(exists2).toBe(true)
    })
  })

  test('should remove the temporary directories after calling the function', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryDirectories(2, (path1, path2) => {
      temporaryPath1 = path1
      temporaryPath2 = path2
    })
    const exists1 = existsSync(temporaryPath1!)
    const exists2 = existsSync(temporaryPath2!)
    expect(exists1).toBe(false)
    expect(exists2).toBe(false)
  })

  test('should remove the temporary directories even if the function throws an error', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryDirectories(2, (path1, path2) => {
      temporaryPath1 = path1
      temporaryPath2 = path2
      throw new Error('Test error')
    }).catch(() => {})
    const exists1 = existsSync(temporaryPath1!)
    const exists2 = existsSync(temporaryPath2!)
    expect(exists1).toBe(false)
    expect(exists2).toBe(false)
  })

  test('should call a function with a temporary file in the specified directory', async() => {
    await withTemporaryDirectories({ directory: '/cache' }, (path) => {
      expect(path).toMatch(/^\/cache\/[\da-z]+$/)
    })
  })

  test('should call a function with a temporary file with the given random function', async() => {
    await withTemporaryDirectories({ random: () => 'foo' }, (path) => {
      expect(path).toMatch(/^\/tmp\/foo$/)
    })
  })

  test('should call a function with multiple temporary files with different options', async() => {
    await withTemporaryDirectories(
      [{ directory: '/cache' }, { random: () => 'foo' }],
      (path1, path2) => {
        expect(path1).toMatch(/^\/cache\/[\da-z]+$/)
        expect(path2).toMatch(/^\/tmp\/foo$/)
      },
    )
  })

  test('should return the result of the function', async() => {
    const result = await withTemporaryDirectories(1, () => 42)
    expect(result).toBe(42)
  })

  test('should throw an error if the function throws an error', async() => {
    const shouldReject = withTemporaryDirectories(1, () => { throw new Error('Test error') })
    await expect(shouldReject).rejects.toThrow('Test error')
  })
})
