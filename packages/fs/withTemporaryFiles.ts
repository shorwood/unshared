import { MaybeArray, Tuple, TupleLength, Function } from '@unshared/types'
import { CreateTemporaryFileOptions, createTemporaryFile } from './createTemporaryFile'

type Callback<U, N extends number> = (...paths: Tuple<N, string>) => Promise<U> | U

/**
 * Wrap a function that will create one or more temporary files and
 * remove them after the function has been executed, regardless of
 * whether the function throws an error or not.
 *
 * @param count The number of temporary files to create.
 * @param fn The function to wrap.
 * @returns A promise that resolves to the result of the function.
 */
export async function withTemporaryFiles<U, N extends number>(count: N, fn: Callback<U, N>): Promise<U>
export async function withTemporaryFiles<U, T extends CreateTemporaryFileOptions[]>(options: T, fn: Callback<U, TupleLength<T>>): Promise<U>
export async function withTemporaryFiles<U, T extends CreateTemporaryFileOptions>(option: T, fn: Callback<U, 1>): Promise<U>
export async function withTemporaryFiles(options: MaybeArray<CreateTemporaryFileOptions> | number, fn: Function<unknown>): Promise<unknown> {

  // --- Normalize the arguments.
  if (typeof options === 'number') options = Array.from({ length: options }, () => ({}))
  if (!Array.isArray(options)) options = [options]

  // --- Create temporary files.
  const pathsPromises = options.map(option => createTemporaryFile(undefined, option))
  const pathsInstances = await Promise.all(pathsPromises)
  const paths = pathsInstances.map(x => x[0])

  try {
    return await fn(...paths)
  }
  finally {
    const promises = pathsInstances.map(x => x[1]())
    await Promise.all(promises)
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { existsSync } = await import('node:fs')

  it('should call a function with one temporary file', async() => {
    await withTemporaryFiles(1, (path) => {
      const exists = existsSync(path)
      expect(exists).toEqual(true)
    })
  })

  it('should call a function with two temporary files', async() => {
    await withTemporaryFiles(2, (path1, path2) => {
      const exists1 = existsSync(path1)
      const exists2 = existsSync(path2)
      expect(exists1).toEqual(true)
      expect(exists2).toEqual(true)
    })
  })

  it('should remove the temporary files after calling the function', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryFiles(2, (path1, path2) => {
      temporaryPath1 = path1
      temporaryPath2 = path2
    })
    const exists1 = existsSync(temporaryPath1!)
    const exists2 = existsSync(temporaryPath2!)
    expect(exists1).toEqual(false)
    expect(exists2).toEqual(false)
  })

  it('should remove the temporary files after the function throws an error', async() => {
    let temporaryPath1: string
    let temporaryPath2: string
    await withTemporaryFiles(2, (path1, path2) => {
      temporaryPath1 = path1
      temporaryPath2 = path2
      throw new Error('Test error')
    }).catch(() => {})
    const exists1 = existsSync(temporaryPath1!)
    const exists2 = existsSync(temporaryPath2!)
    expect(exists1).toEqual(false)
    expect(exists2).toEqual(false)
  })

  it('should call a function with a temporary file in the specified directory', async() => {
    await withTemporaryFiles({ directory: '/cache' }, (path) => {
      expect(path).toMatch(/^\/cache\/[\da-z]+$/)
    })
  })

  it('should call a function with a temporary file with the specified extension', async() => {
    await withTemporaryFiles({ extension: 'txt' }, (path) => {
      expect(path).toMatch(/^\/tmp\/[\da-z]+\.txt$/)
    })
  })

  it('should call a function with a temporary file with the given random function', async() => {
    await withTemporaryFiles({ random: () => 'foo' }, (path) => {
      expect(path).toMatch(/^\/tmp\/foo$/)
    })
  })

  it('should call a function with multiple temporary files with different options', async() => {
    await withTemporaryFiles([{ directory: '/cache' }, { extension: 'txt' }, { random: () => 'foo' }], (path1, path2, path3) => {
      expect(path1).toMatch(/^\/cache\/[\da-z]+$/)
      expect(path2).toMatch(/^\/tmp\/[\da-z]+\.txt$/)
      expect(path3).toMatch(/^\/tmp\/foo$/)
    })
  })

  it('should return the result of the function', async() => {
    const result = await withTemporaryFiles(1, () => 42)
    expect(result).toEqual(42)
  })

  it('should throw an error if the function throws an error', async() => {
    const shouldReject = withTemporaryFiles(1, () => { throw new Error('Test error') })
    await expect(shouldReject).rejects.toThrow('Test error')
  })
}
