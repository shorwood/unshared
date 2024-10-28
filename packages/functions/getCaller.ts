import { getStack } from './getStack'

/**
 * Get the file path of the caller of the current function.
 *
 * @returns The file path where this function was called.
 * @example getCaller() // '/home/user/project/index.js'
 */
export function getCaller(): string {
  const stack = getStack()
  return stack[3] ?? stack[2] ?? stack[1] ?? stack[0]
}
