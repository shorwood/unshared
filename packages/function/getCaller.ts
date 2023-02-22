import { resolveStack } from './getStack'

/**
 * Resolve the file path where this function was called.
 *
 * @returns The file path where this function was called.
 * @example getCaller() // '/home/user/project/index.js'
 */
export const getCaller = (): string =>
  resolveStack()[2] ?? import.meta.url.slice(7)
