/* eslint-disable sonarjs/no-nested-conditional */
import type { Constructor, Function, MaybeArray } from '@unshared/types'

export namespace Rethrow {

  /**
   * Error matcher that can be an error constructor, string, regex, or predicate function.
   * Used to selectively match errors for ignoring or rethrowing.
   */
  export type ErrorMatcher =
    | Constructor<Error>
    | Function<boolean, [error: Error]>
    | RegExp
    | string

  export interface Options<T = undefined> {

    /**
     * Errors to ignore (swallow silently). Can be:
     * - An error constructor (e.g., `TypeError`)
     * - A string to match against the error message or code
     * - A regex to test against the error message
     * - A predicate function `(error) => boolean`
     * - An array of the above
     *
     * When an error matches, it will be swallowed and the fallback value returned.
     */
    ignore?: MaybeArray<ErrorMatcher>

    /**
     * Errors to explicitly rethrow. Can be:
     * - An error constructor (e.g., `TypeError`)
     * - A string to match against the error message or code
     * - A regex to test against the error message
     * - A predicate function `(error) => boolean`
     * - An array of the above
     *
     * When specified, only matching errors will be rethrown; others will be ignored.
     * If both `ignore` and `rethrow` are specified, `ignore` takes precedence.
     */
    match?: MaybeArray<ErrorMatcher>

    /**
     * A fallback value to return when an error is ignored.
     * If not provided, `undefined` is returned.
     */
    fallback?: T

    /**
     * A callback function called when an error is ignored.
     * Useful for logging ignored errors.
     */
    onIgnore?: (error: Error) => void

    /**
     * A callback function called before an error is rethrown.
     * Useful for logging or transforming errors.
     */
    onRethrow?: (error: Error) => void
  }

  /** The result type of a rethrow-wrapped function. */
  export type Result<T extends Function, F> =
    (...parameters: Parameters<T>) => ReturnType<T> extends Promise<infer R>
      ? Promise<F | R>
      : F | ReturnType<T>
}

/**
 * Check if an error matches a given error matcher.
 *
 * @param error The error to check.
 * @param matcher The error matcher.
 * @returns Whether the error matches.
 */
function matchesError(error: Error, matcher: Rethrow.ErrorMatcher): boolean {
  if (typeof matcher === 'function') {
    // Check if it's an error constructor or a predicate function
    if (matcher.prototype instanceof Error || matcher === Error)
      return error instanceof (matcher as new (...args: unknown[]) => Error)
    return (matcher as (error: Error) => boolean)(error)
  }
  if (typeof matcher === 'string') {
    // Match against message or code (for Node.js errors)
    const code = (error as NodeJS.ErrnoException).code
    return error.message.includes(matcher) || code === matcher
  }
  if (matcher instanceof RegExp)
    return matcher.test(error.message)
  return false
}

/**
 * Check if an error matches any of the given matchers.
 *
 * @param error The error to check.
 * @param matchers The normalized array of error matchers (or undefined).
 * @returns Whether the error matches any matcher.
 */
function matchesAny(error: Error, matchers: Rethrow.ErrorMatcher[] | undefined): boolean {
  if (!matchers) return false
  return matchers.some(matcher => matchesError(error, matcher))
}

/**
 * Handle an error based on the rethrow options.
 *
 * @param error The error to handle.
 * @param ignoreMatchers Matchers for errors to ignore.
 * @param rethrowMatchers Matchers for errors to rethrow.
 * @param fallback The fallback value to return when ignored.
 * @param onIgnore Callback when an error is ignored.
 * @param onRethrow Callback when an error is rethrown.
 * @returns The fallback value if ignored.
 * @throws The error if it should be rethrown.
 */
function handleError(
  error: Error,
  ignoreMatchers: Rethrow.ErrorMatcher[] | undefined,
  rethrowMatchers: Rethrow.ErrorMatcher[] | undefined,
  fallback: unknown,
  onIgnore: ((error: Error) => void) | undefined,
  onRethrow: ((error: Error) => void) | undefined,
): unknown {

  // --- If error matches ignore, swallow it.
  if (matchesAny(error, ignoreMatchers)) {
    if (onIgnore) onIgnore(error)
    return fallback
  }

  // --- If rethrow matchers are defined, only rethrow matching errors.
  if (rethrowMatchers) {
    if (matchesAny(error, rethrowMatchers)) {
      if (onRethrow) onRethrow(error)
      throw error
    }
    // Error doesn't match rethrow list, so ignore it.
    if (onIgnore) onIgnore(error)
    return fallback
  }

  // --- No rethrow matchers defined, rethrow all non-ignored errors.
  if (onRethrow) onRethrow(error)
  throw error
}

/**
 * Wrap a function to selectively ignore or rethrow errors.
 *
 * @param fn The function to wrap with error handling.
 * @param options The rethrow options.
 * @returns A function that handles errors according to the options.
 * @example
 * // Ignore specific errors and return undefined
 * const readFile = rethrow(fs.readFile, {
 *   ignore: ['ENOENT', 'EACCES'],
 * })
 *
 * @example
 * // Ignore errors with a fallback value
 * const readConfig = rethrow(loadConfig, {
 *   ignore: [SyntaxError, 'ENOENT'],
 *   fallback: { port: 3000 },
 * })
 *
 * @example
 * // Only rethrow specific errors, ignore others
 * const fetchData = rethrow(apiCall, {
 *   rethrow: [TypeError, /timeout/i],
 *   onIgnore: (error) => console.warn('Ignored:', error.message),
 * })
 *
 * @example
 * // Combine ignore and rethrow (ignore takes precedence)
 * const processData = rethrow(parse, {
 *   ignore: ['ValidationError'],
 *   rethrow: [SyntaxError],
 *   fallback: null,
 * })
 */
export function rethrow<T extends Function, F = undefined>(
  fn: T,
  options?: Rethrow.Options<F>,
): Rethrow.Result<T, F>
export function rethrow(fn: Function, options: Rethrow.Options = {}): Function {
  const {
    ignore,
    match,
    fallback,
    onIgnore,
    onRethrow,
  } = options

  // --- Normalize matchers once at wrap time.
  const ignoreMatchers = ignore
    ? (Array.isArray(ignore) ? ignore : [ignore])
    : undefined
  const rethrowMatchersNormalized = match
    ? (Array.isArray(match) ? match : [match])
    : undefined

  return function rethrowed(this: unknown, ...parameters: unknown[]): unknown {
    try {
      const result: unknown = fn.call(this, ...parameters)

      // --- Handle async functions.
      if (result instanceof Promise) {
        return result.catch((error: unknown) => handleError(
          error instanceof Error ? error : new Error(String(error)),
          ignoreMatchers,
          rethrowMatchersNormalized,
          fallback,
          onIgnore,
          onRethrow,
        ))
      }

      return result
    }
    catch (error) {
      return handleError(
        error instanceof Error ? error : new Error(String(error)),
        ignoreMatchers,
        rethrowMatchersNormalized,
        fallback,
        onIgnore,
        onRethrow,
      )
    }
  }
}

/**
 * Decorate a method to selectively ignore or rethrow errors.
 *
 * @param options The rethrow options.
 * @returns The method decorator.
 * @example
 * // Ignore specific errors
 * class FileService {
 *   \@Rethrow({ ignore: ['ENOENT'] })
 *   async readFile(path: string) {
 *     return fs.readFile(path, 'utf8')
 *   }
 * }
 *
 * @example
 * // With fallback value
 * class ConfigService {
 *   \@Rethrow({ ignore: [SyntaxError], fallback: {} })
 *   loadConfig() {
 *     return JSON.parse(fs.readFileSync('config.json', 'utf8'))
 *   }
 * }
 */
export function Rethrow<This, Arguments extends unknown[], Return, F = undefined>(
  options?: Rethrow.Options<F>,
) {
  return function(
    originalMethod: (this: This, ...args: Arguments) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Return>,
  ): (this: This, ...args: Arguments) => Return extends Promise<infer R> ? Promise<F | R> : F | Return {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@Rethrow can only be applied to methods.')

    // --- Create a rethrow-wrapped version per instance using a WeakMap.
    type WrappedMethod = (this: This, ...args: Arguments) => Return extends Promise<infer R> ? Promise<F | R> : F | Return
    const instances = new WeakMap<object, WrappedMethod>()

    return function(this: This, ...args: Arguments) {
      let wrappedMethod = instances.get(this as object)
      if (!wrappedMethod) {
        wrappedMethod = rethrow(
          originalMethod.bind(this) as (...args: Arguments) => Return,
          options,
        ) as WrappedMethod
        instances.set(this as object, wrappedMethod)
      }
      return wrappedMethod.call(this, ...args)
    } as WrappedMethod
  }
}
