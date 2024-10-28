import { throttle } from './throttle'

describe('throttle', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should call the function immediately', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should not call the function more than once within the delay', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    throttled()
    throttled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should pass the parameters of the first call to the function', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 10)
    throttled(1)
    throttled(2)
    throttled(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith(1)
  })

  test('should call the function again after the delay has passed', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('should return undefined', () => {
    const throttled = throttle(() => 'foobar', 100)
    const result = throttled()
    expect(result).toBeUndefined()
  })
})
