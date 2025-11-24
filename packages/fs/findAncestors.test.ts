/* eslint-disable n/no-extraneous-import */
import { vol } from 'memfs'
import { findAncestors } from './findAncestors'

describe('findAncestors', () => {
  test('should resolve ancestors from current directory', async() => {
    vi.stubGlobal('process', { cwd: () => '/home/user/project' })
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = await findAncestors('file')
    expect(result).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should resolve ancestors at from given directory', async() => {
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = await findAncestors('file', '/home/user/project')
    expect(result).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should be iterable', async() => {
    vol.fromJSON({
      '/file': '',
      '/home/file': '',
      '/home/user/file': '',
      '/home/user/project/file': '',
    })
    const result = findAncestors('file', '/home/user/project')
    const items = []
    for await (const item of result) items.push(item)
    expect(items).toStrictEqual([
      '/home/user/project/file',
      '/home/user/file',
      '/home/file',
      '/file',
    ])
  })

  test('should return empty array if no ancestors were found', async() => {
    const result = await findAncestors('filename')
    expect(result).toStrictEqual([])
  })
})
