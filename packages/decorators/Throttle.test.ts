import { Throttle } from './Throttle'

describe('Throttle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('should call the function immediately', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should not call the function more than once within the delay', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should pass the parameters of the first call to the function', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(10) fn(name: string) { fn(name) } }
    const instance = new Greeter()
    instance.fn('Alice')
    instance.fn('Bob')
    instance.fn('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Alice')
  })

  test('should call the function again after the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('should return undefined', () => {
    const fn = vi.fn(() => 'foobar')
    // @ts-expect-error: Testing return value
    class Greeter { @Throttle(100) fn() { return fn() } }
    const instance = new Greeter()
    const result = instance.fn()
    expect(result).toBeUndefined()
  })

  test('should throw a TypeError when applied to a class field', () => {
    const shouldThrow = () => {
      // @ts-expect-error: Decorator should not be applied to class fields
      class Greeter { @Throttle(100) fn = () => {} }
      return new Greeter()
    }
    expect(shouldThrow).toThrow(TypeError)
  })

  test('should throw a TypeError when applied to an accessor', () => {
    const shouldThrow = () => {
      class Greeter {
        // @ts-expect-error: Decorator should not be applied to accessors
        @Throttle(100) accessor value = 'foo'
      }
      return new Greeter()
    }
    expect(shouldThrow).toThrow(TypeError)
  })
})
