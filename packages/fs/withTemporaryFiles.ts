import type { Function, MaybeArray, Tuple, TupleLength } from '@unshared/types'
import type { CreateTemporaryFileOptions } from './createTemporaryFile'
import { createTemporaryFile } from './createTemporaryFile'

type Callback<U, N extends number> = (...paths: Tuple<N, string>) => Promise<U> | U

/**
 * Wrap a function that will create one or more temporary files and
 * remove them after the function has been executed, regardless of
 * whether the function throws an error or not.
 *
 * @param count The number of temporary files to create.
 * @param fn The function to wrap that takes the temporary directory path(s) as arguments.
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

  // --- Execute the function with the temporary files.
  try {
    return await fn(...paths)
  }

  // --- On completion, remove the temporary files.
  finally {
    const promises = pathsInstances.map(x => x[1]())
    await Promise.all(promises)
  }
}
