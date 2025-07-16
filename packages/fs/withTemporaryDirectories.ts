import type { Function, MaybeArray, Tuple, TupleLength } from '@unshared/types'
import type { CreateTemporaryDirectoryOptions } from './createTemporaryDirectory'
import { createTemporaryDirectory } from './createTemporaryDirectory'

type Callback<U, N extends number> = (...paths: Tuple<N, string>) => Promise<U> | U

/**
 * Wrap a function that will create a temporary directory and
 * recursively remove it after the function has been executed,
 * regardless of whether the function throws an error or not.
 *
 * @param count The number of temporary directories to create.
 * @param fn The function to wrap that takes the temporary directory path(s) as arguments.
 * @returns A promise that resolves to the result of the function.
 */
export async function withTemporaryDirectories<U, N extends number>(count: N, fn: Callback<U, N>): Promise<U>

/**
 * Executes a function with temporary directories that are automatically cleaned up.
 *
 * This function creates one or more temporary directories, passes their paths to the
 * provided function, and ensures cleanup occurs even if the function throws an error.
 *
 * @param options Configuration for temporary directory creation. Can be:
 * - A number indicating how many directories to create with default options
 * - A single CreateTemporaryDirectoryOptions object
 * - An array of CreateTemporaryDirectoryOptions objects
 * @param fn The function to execute with the temporary directory paths as arguments
 * @returns A promise that resolves to the return value of the provided function
 *
 * @example
 * // Create a single temporary directory
 * await withTemporaryDirectories({}, (tempDir) => {
 *   // Use tempDir...
 * });
 *
 * // Create multiple temporary directories
 * await withTemporaryDirectories([{}, { prefix: 'test-' }], (dir1, dir2) => {
 *   // Use dir1 and dir2...
 * });
 *
 * // Create 3 directories with default options
 * await withTemporaryDirectories(3, (dir1, dir2, dir3) => {
 *   // Use all three directories...
 * });
 */
export async function withTemporaryDirectories<U, T extends CreateTemporaryDirectoryOptions[]>(options: T, fn: Callback<U, TupleLength<T>>): Promise<U>
export async function withTemporaryDirectories<U, T extends CreateTemporaryDirectoryOptions>(option: T, fn: Callback<U, 1>): Promise<U>
export async function withTemporaryDirectories(options: MaybeArray<CreateTemporaryDirectoryOptions> | number, fn: Function<unknown>): Promise<unknown> {

  // --- Normalize the arguments.
  if (typeof options === 'number') options = Array.from({ length: options }, () => ({}))
  if (!Array.isArray(options)) options = [options]

  // --- Create temporary files.
  const pathsPromises = options.map(option => createTemporaryDirectory(option))
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
