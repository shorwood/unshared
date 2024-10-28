import { vol } from 'memfs'
import { findAncestor } from './findAncestor'

describe('findAncestor', () => {
  test('should resolve ancestor from current directory', async() => {
    vi.stubGlobal('process', { cwd: () => '/home/user/project' })
    vol.fromJSON({ '/home/user/project/.npmrc': '' })
    const result = await findAncestor('.npmrc')
    expect(result).toBe('/home/user/project/.npmrc')
  })

  test('should resolve ancestor from given directory', async() => {
    vol.fromJSON({ '/home/user/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toBe('/home/user/.npmrc')
  })

  test('should resolve ancestor at root directory', async() => {
    vol.fromJSON({ '/.npmrc': '' })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toBe('/.npmrc')
  })

  test('should resolve the first ancestor', async() => {
    vol.fromJSON({
      '/.npmrc': '',
      '/home/user/.npmrc': '',
      '/home/user/project/.npmrc': '',
    })
    const result = await findAncestor('.npmrc', '/home/user/project')
    expect(result).toBe('/home/user/project/.npmrc')
  })

  test('should return undefined if no ancestor was found', async() => {
    vol.fromJSON({})
    const result = await findAncestor('file', '/')
    expect(result).toBeUndefined()
  })
})
