/* eslint-disable sonarjs/publicly-writable-directories */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createTemporaryFile } from './createTemporaryFile'

describe('createTemporaryFile', () => {
  test('should create an empty temporary file in "/tmp/<random>"', async() => {
    const [path] = await createTemporaryFile()
    const isFile = statSync(path).isFile()
    const content = readFileSync(path, 'utf8')
    expect(path).toMatch(/^\/tmp\/[\da-z]+$/)
    expect(isFile).toBe(true)
    expect(content).toBe('')
  })

  test('should create a temporary file with the specified content', async() => {
    const [path] = await createTemporaryFile('Hello, world!')
    const content = readFileSync(path, 'utf8')
    expect(content).toBe('Hello, world!')
  })

  test('should create a temporary file in the specified directory', async() => {
    const [path] = await createTemporaryFile(undefined, { directory: '/cache' })
    expect(path).toMatch(/^\/cache\/[\da-z]+$/)
  })

  test('should recursively create the specified directory', async() => {
    const [path] = await createTemporaryFile(undefined, { directory: '/tmp/foo/bar' })
    expect(path).toMatch(/^\/tmp\/foo\/bar\/[\da-z]+$/)
  })

  test('should create a temporary file with the specified extension', async() => {
    const [path] = await createTemporaryFile(undefined, { extension: 'txt' })
    expect(path).toMatch(/^\/tmp\/[\da-z]+\.txt$/)
  })

  test('should create a temporary file with the given random function', async() => {
    const [path] = await createTemporaryFile(undefined, { random: () => 'foo' })
    expect(path).toMatch(/^\/tmp\/foo$/)
  })

  test('should remove the temporary file after calling the remove function', async() => {
    const [path, remove] = await createTemporaryFile()
    await remove()
    const exists = existsSync(path)
    expect(exists).toBe(false)
  })
})
