import { Debounce } from './Debounce'

describe('Debounce', () => {
  beforeAll(() => vi.useFakeTimers())
  afterAll(() => vi.useRealTimers())

  test('should not call the function if the delay has not passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
  })

  test('should call the function once after the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should call the function once with the parameters of the last call', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn(name: string) { fn(name) } }
    const instance = new Greeter()
    instance.fn('Alice')
    instance.fn('Bob')
    instance.fn('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Charlie')
  })

  test('should call the function multiple times if the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('should return undefined', () => {
    const fn = vi.fn(() => 'foobar')
    // @ts-expect-error: Testing return value
    class Greeter { @Debounce(10) fn() { return fn() } }
    const instance = new Greeter()
    const result = instance.fn()
    expect(result).toBeUndefined()
  })
})
