import { writeFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Create a temporary file with a random name and return
 * an object containing the file path, and a function to
 * remove the file.
 *
 * @param content The content to write to the temporary file.
 * @param directory The directory to create the temporary file in.
 * @returns A promise that resolves to the temporary file object.
 */
export async function createTemporaryFile(content?: Parameters<typeof writeFile>[1], directory?: string) {
  if (!directory) directory = tmpdir()
  const name = Math.random().toString(36).slice(2)
  const path = join(directory, name)
  const remove = async() => await rm(path, { force: true })
  await mkdir(directory, { recursive: true })
  await writeFile(path, content ?? '')
  return [path, remove] as const
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { readFileSync, existsSync } = await import('node:fs')

  it('should create an empty temporary file in "/tmp/<random>"', async() => {
    const [path] = await createTemporaryFile()
    const content = readFileSync(path, 'utf8')
    expect(path).toMatch(/^\/tmp\/[\da-z]+$/)
    expect (content).toEqual('')
  })

  it('should create a temporary file with the specified content', async() => {
    const [path] = await createTemporaryFile('Hello, world!')
    const content = readFileSync(path, 'utf8')
    expect(content).toEqual('Hello, world!')
  })

  it('should create a temporary file in the specified directory', async() => {
    const [path] = await createTemporaryFile(undefined, '/cache')
    expect(path).toMatch(/^\/cache\/[\da-z]+$/)
  })

  it('should recursively create the specified directory', async() => {
    const [path] = await createTemporaryFile(undefined, '/tmp/foo/bar')
    expect(path).toMatch(/^\/tmp\/foo\/bar\/[\da-z]+$/)
  })

  it('should remove the temporary file after calling the remove function', async() => {
    const [path, remove] = await createTemporaryFile()
    await remove()
    const exists = existsSync(path)
    expect(exists).toEqual(false)
  })
}
