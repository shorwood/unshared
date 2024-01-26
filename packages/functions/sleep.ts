import { NumberIntegerPositive } from "@unshared/types"

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

/* c8 ignore next */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should resolve after a given delay', async() => {
    const result = sleep(1000)
    vi.advanceTimersByTime(1000)
    await expect(result).resolves.toBeUndefined()
  })

  it('should throw an error if the delay is negative', () => {
    // @ts-expect-error: Delay is negative
    const shouldThrow = () => sleep(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the delay is not an integer', () => {
    // @ts-expect-error: Delay is not an integer
    const shouldThrow = () => sleep(1.5)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the delay is not finite', () => {
    const shouldThrow = () => sleep(Number.NaN)
    expect(shouldThrow).toThrow(TypeError)
  })
}
