/* oxlint-disable unicorn/error-message */
const STACK_EXP = /(?:file:\/{2})?((?:\/[^/:]+)+)\.\w+/g

/**
 * Get the call stack of the current function. This function is useful for
 * debugging and logging but should not be used in production code as it uses
 * an hacky way to get the stack by throwing an error and parsing the stack
 * from the error.
 *
 * @returns The file paths of the stack frames.
 * @example getStack() // ['/home/user/project/foo.js', '/home/user/project/index.js']
 */
export function getStack() {
  return new Error().stack?.match(STACK_EXP)?.map(file => file.replace('file://', '')) ?? []
}
