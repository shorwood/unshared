/* eslint-disable n/no-extraneous-import */
import { vol } from 'memfs'
import { statSync } from 'node:fs'
import { touch } from './touch'

describe('touch', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should create a file if it does not exist', async() => {
    await touch('/foo.txt')
    const now = Date.now() * 1000
    const stats = statSync('/foo.txt')
    expect(stats.atimeMs).toStrictEqual(now)
    expect(stats.mtimeMs).toStrictEqual(now)
  })

  test('should create a nested file if the parent folder does not exist', async() => {
    await touch('/foo/bar.txt')
    const now = Date.now() * 1000
    const stats = statSync('/foo/bar.txt')
    expect(stats.atimeMs).toStrictEqual(now)
    expect(stats.mtimeMs).toStrictEqual(now)
  })

  test('should update the access and modified times of an existing file', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await touch('/foo.txt', { accessTime: 1000 })
    const stats = statSync('/foo.txt')
    expect(stats.atimeMs).toStrictEqual(1000 * 1000)
  })

  test('should update the modified time of an existing file', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await touch('/foo.txt', { modifiedTime: 1000 })
    const stats = statSync('/foo.txt')
    expect(stats.mtimeMs).toStrictEqual(1000 * 1000)
  })
})
