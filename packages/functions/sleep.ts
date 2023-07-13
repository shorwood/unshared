/**
 * Create a promise that resolves after a given delay.
 *
 * @param delay The amount of milliseconds to sleep for.
 * @returns A promise that resolves in `ms` milliseconds
 * @example await sleep(1000)
 */
export function sleep(delay: number): Promise<void> {
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
    expect(result).resolves.toBeUndefined()
  })

  it('should throw if delay is negative', async() => {
    const shouldThrow = () => sleep(-1000)
    expect(shouldThrow).toThrow(RangeError)
  })
}
