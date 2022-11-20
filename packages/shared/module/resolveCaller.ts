import { resolveStack } from './resolveStack'

/**
 * Resolve the file path where this function was called.
 * @example
 * resolveCaller() // '/home/user/project/index.js'
 */
export const resolveCaller = (): string =>
  resolveStack()[2] ?? import.meta.url.slice(7)
