import { sleep } from './sleep'

describe('sleep', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should resolve after a given delay', async() => {
    const result = sleep(1000)
    vi.advanceTimersByTime(1000)
    await expect(result).resolves.toBeUndefined()
  })

  test('should throw an error if the delay is negative', () => {

    // @ts-expect-error: Delay is negative
    const shouldThrow = () => sleep(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw an error if the delay is not an integer', () => {

    // @ts-expect-error: Delay is not an integer
    const shouldThrow = () => sleep(1.5)
    expect(shouldThrow).toThrow(TypeError)
  })

  test('should throw an error if the delay is not finite', () => {
    const shouldThrow = () => sleep(Number.NaN)
    expect(shouldThrow).toThrow(TypeError)
  })
})
