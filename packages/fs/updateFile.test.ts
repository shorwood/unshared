import { vol } from 'memfs'
import { readFile } from 'node:fs/promises'
import { updateFile } from './updateFile'

describe('updateFile', () => {
  test('should update a file with a callback using buffer', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await updateFile('/foo.txt', content => content.toString('utf8').toUpperCase())
    const result = await readFile('/foo.txt', 'utf8')
    expect(result).toBe('HELLO, WORLD!')
  })

  test('should update a file with a callback using utf8 encoding', async() => {
    vol.fromJSON({ '/foo.txt': 'Hello, world!' })
    await updateFile('/foo.txt', content => content.toUpperCase(), 'utf8')
    const result = await readFile('/foo.txt', 'utf8')
    expect(result).toBe('HELLO, WORLD!')
  })

  test('should throw an error if the file does not exist', async() => {
    const shouldThrow = updateFile('/foo.txt', content => content)
    await expect(shouldThrow).rejects.toThrow('ENOENT: no such file or directory, open')
  })
})
