import { randomInt } from 'node:crypto'
import { Memoize } from './Memoize'

describe('Memoize', () => {
  test('should memoize the method', () => {
    const fn = vi.fn(() => randomInt(0, 1e6))
    class MyClass { @Memoize() getId() { return fn() } }
    const instance = new MyClass()
    const id1 = instance.getId()
    const id2 = instance.getId()
    expect(id1).toStrictEqual(id2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith()
  })

  test('should memoize the method by parameter', () => {
    const fn = vi.fn((n = 0) => (n as number) + randomInt(0, 1e6))
    class MyClass { @Memoize() getId(n: number) { return fn(n) } }
    const instance = new MyClass()
    const id1 = instance.getId(1)
    const id2 = instance.getId(1)
    const id3 = instance.getId(2)
    expect(id1).toStrictEqual(id2)
    expect(id1).not.toStrictEqual(id3)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledWith(1)
    expect(fn).toHaveBeenCalledWith(2)
  })

  test('should preserve the method context', () => {
    class MyClass { value = { foo: 42 }; @Memoize() getValue() { return this?.value } }
    const instance = new MyClass()
    const result1 = instance.getValue()
    const result2 = instance.value
    expect(result1).toBe(result2)
  })
})
