import { debounce } from './debounce'

describe('debounce', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should not call the function if the delay has not passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
  })

  test('should call the function once after the delay has passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should call the function once with the parameters of the last call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced('Alice')
    debounced('Bob')
    debounced('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Charlie')
  })

  test('should call the function multiple times if the delay has passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('should return undefined', () => {
    const debounced = debounce(() => 'foobar', 100)
    const result = debounced()
    expect(result).toBeUndefined()
  })
})
