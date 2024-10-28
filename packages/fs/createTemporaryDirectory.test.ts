/* eslint-disable sonarjs/publicly-writable-directories */
import { existsSync, statSync } from 'node:fs'
import { createTemporaryDirectory } from './createTemporaryDirectory'

describe('createTemporaryDirectory', () => {
  test('should create an empty temporary directory in "/tmp/<random>"', async() => {
    const [path] = await createTemporaryDirectory()
    const isDirectory = statSync(path).isDirectory()
    expect(path).toMatch(/^\/tmp\/[\da-z]+$/)
    expect(isDirectory).toBe(true)
  })

  test('should create a temporary directory in the specified directory', async() => {
    const [path] = await createTemporaryDirectory({ directory: '/cache' })
    expect(path).toMatch(/^\/cache\/[\da-z]+$/)
  })

  test('should recursively create the specified directory', async() => {
    const [path] = await createTemporaryDirectory({ directory: '/tmp/foo/bar' })
    expect(path).toMatch(/^\/tmp\/foo\/bar\/[\da-z]+$/)
  })

  test('should create a temporary file with the given random function', async() => {
    const [path] = await createTemporaryDirectory({ random: () => 'foo' })
    expect(path).toMatch(/^\/tmp\/foo$/)
  })

  test('should remove the temporary file after calling the remove function', async() => {
    const [path, remove] = await createTemporaryDirectory()
    await remove()
    const exists = existsSync(path)
    expect(exists).toBe(false)
  })
})
