/**
 * Suppresses warnings from the given function or process.
 *
 * @param fn The function or process to suppress warnings from.
 * @returns The result of the function or process.
 * @throws If argument is not a function or process
 * @example suppressWarnings(); // undefined
 */
export function suppressWarnings<T>(fn: () => T): T
export function suppressWarnings<T>(fn: Process<T>): T
export function suppressWarnings<T>(fn: (() => T) | Process<T>): T {
  if (typeof fn !== 'function')
    throw new TypeError('Expected a function')

  // --- Suppress warnings.
  const originalConsoleWarn = console.warn
  console.warn = () => {}

  // --- Run the function or process.
  const result = fn()

  // --- Restore the original console.warn function.
  console.warn = originalConsoleWarn

  // --- Return the result.
  return result
}
