/* eslint-disable n/no-sync */
import { existsSync } from 'node:fs'
import { withTemporaryFiles } from './withTemporaryFiles'

describe('withTemporaryFiles', () => {
  test('should call a function with one temporary file', async() => {
    await withTemporaryFiles(1, (path) => {
      const exists = existsSync(path)
      expect(exists).toBe(true)
    })
  })

  test('should call a function with two temporary files', async() => {
    await withTemporaryFiles(2, (path1, path2) => {
      const exists1 = existsSync(path1)
      const exists2 = existsSync(path2)
      expect(exists1).toBe(true)
      expect(exists2).toBe(true)
    })
  })

  test('should remove the temporary files after calling the function', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryFiles(2, (path1, path2) => {
      temporaryPath1 = path1
      temporaryPath2 = path2
    })
    const exists1 = existsSync(temporaryPath1!)
    const exists2 = existsSync(temporaryPath2!)
    expect(exists1).toBe(false)
    expect(exists2).toBe(false)
  })

  test('should remove the temporary files after the function throws an error', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryFiles(2, (path1, path2) => {
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
    await withTemporaryFiles({ directory: '/cache' }, (path) => {
      expect(path).toMatch(/^\/cache\/[\da-z]+$/)
    })
  })

  test('should call a function with a temporary file with the specified extension', async() => {
    await withTemporaryFiles({ extension: 'txt' }, (path) => {
      expect(path).toMatch(/^\/tmp\/[\da-z]+\.txt$/)
    })
  })

  test('should call a function with a temporary file with the given random function', async() => {
    await withTemporaryFiles({ random: () => 'foo' }, (path) => {
      expect(path).toMatch(/^\/tmp\/foo$/)
    })
  })

  test('should call a function with multiple temporary files with different options', async() => {
    await withTemporaryFiles([{ directory: '/cache' }, { extension: 'txt' }, { random: () => 'foo' }], (path1, path2, path3) => {
      expect(path1).toMatch(/^\/cache\/[\da-z]+$/)
      expect(path2).toMatch(/^\/tmp\/[\da-z]+\.txt$/)
      expect(path3).toMatch(/^\/tmp\/foo$/)
    })
  })

  test('should return the result of the function', async() => {
    const result = await withTemporaryFiles(1, () => 42)
    expect(result).toBe(42)
  })

  test('should throw an error if the function throws an error', async() => {
    const shouldReject = withTemporaryFiles(1, () => { throw new Error('Test error') })
    await expect(shouldReject).rejects.toThrow('Test error')
  })
})
