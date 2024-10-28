import type { NumberIntegerPositive } from '@unshared/types'

/**
 * Create a promise that resolves after a given delay.
 *
 * @param delay The amount of milliseconds to sleep for.
 * @returns A promise that resolves in `ms` milliseconds
 * @example await sleep(1000)
 */
export function sleep<N extends number>(delay: NumberIntegerPositive<N>): Promise<void> {
  if (Number.isSafeInteger(delay) === false) throw new TypeError('Expected an integer delay.')
  if (delay < 0) throw new RangeError('Expected delay to be a positive number.')
  return new Promise(resolve => setTimeout(resolve, delay))
}
