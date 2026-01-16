/* eslint-disable sonarjs/no-nested-conditional */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/pseudo-random */
import type { Constructor, Function, MaybeArray } from '@unshared/types'
import { sleep } from './sleep'

export namespace Retry {

  /** Context provided to retry callbacks and conditions. */
  export interface Context {

    /** The current attempt number (1-indexed). */
    attempt: number

    /** The total number of attempts allowed (initial + retries). */
    attemptsLeft: number

    /** The error that caused the retry. */
    error: Error

    /** The total elapsed time in milliseconds since the first attempt. */
    elapsed: number

    /** The delay in milliseconds before the next retry attempt. */
    nextDelay: number
  }

  /** Backoff strategy function that returns the delay for a given attempt. */
  export type BackoffStrategy = (attempt: number, delay: number) => number

  /**
   * Error matcher that can be an error constructor, string, regex, or predicate function.
   * Used with `retryOn` to selectively retry on specific errors.
   */
  export type ErrorMatcher =
    | Constructor<Error>
    | Function<boolean, [error: Error]>
    | RegExp
    | string

  export interface Options {

    /**
     * The maximum number of retry attempts. Set to `0` to disable retries.
     *
     * @default 3
     */
    retries?: number

    /**
     * The base delay in milliseconds between retry attempts.
     *
     * @default 1000
     */
    delay?: number

    /**
     * The minimum delay in milliseconds between retries.
     * Useful as a floor when using jitter.
     *
     * @default 0
     */
    minDelay?: number

    /**
     * The backoff strategy to use for calculating delays between retries.
     * Can be a multiplier number for exponential backoff, or a custom function.
     *
     * - `'exponential'`: Exponential backoff with factor of 2 (delay * 2^attempt)
     * - `'linear'`: Linear backoff (delay * attempt)
     * - `'constant'`: No backoff, constant delay
     * - `number`: Custom exponential factor (delay * factor^attempt)
     * - `function`: Custom strategy `(attempt, baseDelay) => delayMs`
     *
     * @default 'exponential'
     */
    backoff?: 'constant' | 'exponential' | 'linear' | BackoffStrategy | number

    /**
     * The maximum delay in milliseconds between retries.
     * Useful to cap exponential backoff.
     *
     * @default Number.POSITIVE_INFINITY
     */
    maxDelay?: number

    /**
     * A function to determine whether to retry based on the error.
     * Return `true` to retry, `false` to stop and throw the error.
     * This is checked after `retryOn` if provided.
     *
     * @default () => true
     */
    shouldRetry?: (context: Context) => boolean | Promise<boolean>

    /**
     * A shorthand to only retry on specific errors. Can be:
     * - An error constructor (e.g., `TypeError`)
     * - A string to match against the error message
     * - A regex to test against the error message
     * - A predicate function `(error) => boolean`
     * - An array of the above
     *
     * This is checked before `shouldRetry`. If not provided, all errors are retried.
     */
    retryOn?: MaybeArray<ErrorMatcher>

    /**
     * A callback function called before each retry attempt.
     * Useful for logging or cleanup between attempts.
     */
    onRetry?: (context: Context) => Promise<void> | void

    /**
     * A callback function called when the function succeeds.
     * Receives the attempt number and elapsed time.
     */
    onSuccess?: (context: { attempt: number; elapsed: number }) => void

    /**
     * A callback function called when all retries are exhausted.
     * Called with the final context before throwing the error.
     */
    onFailure?: (context: Context) => void

    /**
     * Optional timeout in milliseconds for each attempt.
     * If the function takes longer than this, it will be aborted and retried.
     */
    timeout?: number

    /**
     * Whether to add random jitter to the delay to prevent thundering herd.
     * When enabled, adds ±25% randomness to the calculated delay. This helps
     * to spread out retry attempts when many clients are retrying simultaneously.
     *
     * @default false
     */
    jitter?: boolean

    /**
     * An AbortSignal to cancel the retry operation.
     * When aborted, the current attempt will be cancelled and an AbortError will be thrown.
     */
    signal?: AbortSignal
  }

  /** The result type of a retried function, preserving the original return type. */
  export type Result<T extends Function> = (...parameters: Parameters<T>) => Promise<Awaited<ReturnType<T>>>
}

/**
 * Calculate the delay for a given attempt based on the backoff strategy.
 *
 * @param attempt The current attempt number (1-indexed).
 * @param delay The base delay in milliseconds.
 * @param backoff The backoff strategy.
 * @param minDelay The minimum delay.
 * @param maxDelay The maximum delay.
 * @param jitter Whether to apply jitter.
 * @returns The delay in milliseconds.
 */
function calculateDelay(
  attempt: number,
  delay: number,
  backoff: 'constant' | 'exponential' | 'linear' | number | Retry.BackoffStrategy,
  minDelay: number,
  maxDelay: number,
  jitter: boolean,
): number {

  // --- Calculate base delay based on backoff strategy.
  let calculatedDelay: number
  if (typeof backoff === 'function')
    calculatedDelay = backoff(attempt, delay)
  else if (typeof backoff === 'number')
    calculatedDelay = delay * (backoff ** attempt)
  else if (backoff === 'linear')
    calculatedDelay = delay * attempt
  else if (backoff === 'constant')
    calculatedDelay = delay
  else
    calculatedDelay = delay * (2 ** attempt)

  // --- Apply jitter if enabled (±25% randomness).
  if (jitter) {
    const jitterFactor = 0.75 + Math.random() * 0.5
    calculatedDelay = Math.floor(calculatedDelay * jitterFactor)
  }

  // --- Clamp the delay between min and max.
  return Math.max(minDelay, Math.min(calculatedDelay, maxDelay))
}

/**
 * Check if an error matches a given error matcher.
 *
 * @param error The error to check.
 * @param matcher The error matcher.
 * @returns Whether the error matches.
 */
function matchesError(error: Error, matcher: Retry.ErrorMatcher): boolean {
  if (typeof matcher === 'function') {
    // Check if it's an error constructor or a predicate function
    if (matcher.prototype instanceof Error || matcher === Error)
      return error instanceof (matcher as new(...args: unknown[]) => Error)
    return (matcher as (error: Error) => boolean)(error)
  }
  if (typeof matcher === 'string')
    return error.message.includes(matcher)
  if (matcher instanceof RegExp)
    return matcher.test(error.message)
  return false
}

/**
 * Check if an error should be retried based on the retryOn matchers.
 *
 * @param error The error to check.
 * @param matchers The normalized array of error matchers (or undefined).
 * @returns Whether the error should be retried.
 */
function shouldRetryOnError(error: Error, matchers: Retry.ErrorMatcher[] | undefined): boolean {
  if (!matchers) return true
  return matchers.some(matcher => matchesError(error, matcher))
}

/**
 * Create a promise that rejects after the specified timeout.
 *
 * @param ms The timeout in milliseconds.
 * @returns A promise that rejects with a timeout error.
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Retry attempt timed out after ${ms}ms`)), ms)
  })
}

/**
 * Wrap a function to automatically retry on failure with configurable backoff.
 *
 * @param fn The function to wrap with retry logic.
 * @param options The retry options.
 * @returns A function that will retry on failure.
 * @example
 * // Basic usage with default options (3 retries, exponential backoff)
 * const fetchData = retry(async () => {
 *   const response = await fetch('/api/data')
 *   if (!response.ok) throw new Error('Failed to fetch')
 *   return response.json()
 * })
 *
 * @example
 * // Custom retry configuration
 * const fetchWithRetry = retry(fetchData, {
 *   retries: 5,
 *   delay: 500,
 *   backoff: 'exponential',
 *   maxDelay: 10000,
 *   shouldRetry: ({ error }) => error.message !== 'Not Found',
 *   onRetry: ({ attempt, error }) => console.log(`Attempt ${attempt} failed: ${error.message}`),
 * })
 *
 * @example
 * // With timeout per attempt
 * const fetchWithTimeout = retry(fetchData, {
 *   retries: 3,
 *   timeout: 5000,
 * })
 */
export function retry<T extends Function>(fn: T, options?: Retry.Options): Retry.Result<T>
export function retry(fn: Function, options: Retry.Options = {}): Function {
  const {
    retries = 3,
    delay = 1000,
    backoff = 'exponential',
    minDelay = 0,
    maxDelay = Number.POSITIVE_INFINITY,
    jitter = false,
    timeout,
    signal,
    onRetry,
    onSuccess,
    onFailure,
    shouldRetry,
    retryOn,
  } = options

  // --- Normalize options once at wrap time.
  const maxAttempts = retries + 1
  const retryOnMatchers = retryOn
    ? (Array.isArray(retryOn) ? retryOn : [retryOn])
    : undefined

  return async function retried(this: unknown, ...parameters: unknown[]): Promise<unknown> {
    const startTime = Date.now()
    let lastError: Error

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {

        // --- Check if the operation was aborted.
        if (signal?.aborted) {
          const abortError = new Error('Retry operation was aborted')
          abortError.name = 'AbortError'
          throw abortError
        }

        // --- Execute the function with optional timeout.
        const execution = fn.call(this, ...parameters) as Promise<unknown>
        const result = timeout
          ? await Promise.race([execution, createTimeout(timeout)])
          : await execution

        // --- Call onSuccess callback if provided and return result.
        if (onSuccess) onSuccess({ attempt, elapsed: Date.now() - startTime })
        return result
      }
      catch (error) {

        // --- If aborted, don't retry.
        lastError = error instanceof Error ? error : new Error(String(error))
        if (lastError.name === 'AbortError') throw lastError

        // --- If no attempts left, call onFailure and throw the error.
        const attemptsLeft = maxAttempts - attempt
        if (attemptsLeft === 0) {
          if (onFailure) onFailure({ attempt, attemptsLeft: 0, error: lastError, elapsed: Date.now() - startTime, nextDelay: 0 })
          throw lastError
        }

        // --- Check if error matches retryOn criteria (before calculating delay).
        // --- Calculate delay only if we're going to retry.
        if (!shouldRetryOnError(lastError, retryOnMatchers)) throw lastError
        const nextDelay = calculateDelay(attempt, delay, backoff, minDelay, maxDelay, jitter)

        // --- Check shouldRetry callback if provided.
        if (shouldRetry) {
          const shouldRetryResult = await shouldRetry({ attempt, attemptsLeft, error: lastError, elapsed: Date.now() - startTime, nextDelay })
          if (!shouldRetryResult) throw lastError
        }

        // --- Call onRetry callback if provided and wait for the delay before next attempt.
        if (onRetry) await onRetry({ attempt, attemptsLeft, error: lastError, elapsed: Date.now() - startTime, nextDelay })
        await sleep(nextDelay)
      }
    }

    // --- This should never be reached, but TypeScript needs it.
    throw lastError!
  }
}

/**
 * Decorate a method to automatically retry on failure with configurable backoff.
 *
 * @param options The retry options.
 * @returns The method decorator.
 * @example
 * // Basic usage with default options
 * class ApiClient {
 *   \@Retry()
 *   async fetchUser(id: string) {
 *     const response = await fetch(`/api/users/${id}`)
 *     if (!response.ok) throw new Error('Failed to fetch user')
 *     return response.json()
 *   }
 * }
 *
 * @example
 * // Custom retry configuration
 * class ApiClient {
 *   \@Retry({
 *     retries: 5,
 *     delay: 500,
 *     backoff: 'exponential',
 *     shouldRetry: ({ error }) => error.message.includes('timeout'),
 *     onRetry: ({ attempt }) => console.log(`Retrying... attempt ${attempt}`),
 *   })
 *   async fetchData() {
 *     // ...
 *   }
 * }
 */
export function Retry<This, Arguments extends unknown[], Return>(
  options?: Retry.Options,
) {
  return function(
    originalMethod: (this: This, ...args: Arguments) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Promise<Return>>,
  ): (this: This, ...args: Arguments) => Promise<Return> {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@Retry can only be applied to methods.')

    // --- Create a retried version per instance using a WeakMap.
    const instances = new WeakMap<object, (this: This, ...args: Arguments) => Promise<Return>>()
    return function(this: This, ...args: Arguments): Promise<Return> {
      let retriedMethod = instances.get(this as object)
      if (!retriedMethod) {
        retriedMethod = retry(
          originalMethod.bind(this) as (...args: Arguments) => Promise<Return>,
          options,
        ) as (this: This, ...args: Arguments) => Promise<Return>
        instances.set(this as object, retriedMethod)
      }
      return retriedMethod.call(this, ...args)
    }
  }
}
