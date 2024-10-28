import { randomInt } from 'node:crypto'
import { Once } from './Once'

describe('Once', () => {
  test('should return the same value if no arguments are passed', () => {
    const fn = vi.fn(Math.random)
    class MyClass { @Once() getId() { return fn() } }
    const instance = new MyClass()
    const id1 = instance.getId()
    const id2 = instance.getId()
    expect(id1).toStrictEqual(id2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith()
  })

  test('should return the same values if different arguments are passed', () => {
    const fn = vi.fn((n = 0) => (n as number) + randomInt(0, 1e6))
    class MyClass { @Once() getId(n: number) { return fn(n) } }
    const instance = new MyClass()
    const id1 = instance.getId(1)
    const id2 = instance.getId(1)
    const id3 = instance.getId(2)
    expect(id1).toStrictEqual(id2)
    expect(id1).toStrictEqual(id3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
    expect(fn).not.toHaveBeenCalledWith(2)
  })

  test('should preserve the method context', () => {
    class MyClass { value = { foo: 42 }; @Once() getValue() { return this?.value } }
    const instance = new MyClass()
    const result1 = instance.getValue()
    const result2 = instance.value
    expect(result1).toBe(result2)
  })

  test('should have different results for different instances', () => {
    class MyClass { @Once() getValue() { return randomInt(0, 1e6) } }
    const instance1 = new MyClass()
    const instance2 = new MyClass()
    const result1 = instance1.getValue()
    const result2 = instance2.getValue()
    expect(result1).not.toStrictEqual(result2)
  })
})
