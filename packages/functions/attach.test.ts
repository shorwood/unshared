import { attach } from './attach'

describe('attach', () => {
  test('should attach the "this" paramater to the first parameter of a function', () => {
    const fn = vi.fn((person: { name: string }) => `Hello, I am ${person.name}`) as (person: { name: string }) => string
    const result = attach(fn)
    const object = { name: 'Joe' }
    const called = result.call(object)
    expect(called).toBe('Hello, I am Joe')
    expect(fn).toHaveBeenCalledWith(object)
    expectTypeOf(result).toEqualTypeOf<(this: { name: string }) => string>()
  })

  test('should attach the "this" paramater to the first parameter of a function with multiple parameters', () => {
    const fn = vi.fn((person: { name: string }, message: string) => `${message}, I am ${person.name}`) as (person: { name: string }, message: string) => string
    const result = attach(fn)
    const object = { name: 'Joe' }
    const called = result.call(object, 'Hello')
    expect(called).toBe('Hello, I am Joe')
    expect(fn).toHaveBeenCalledWith(object, 'Hello')
    expectTypeOf(result).toEqualTypeOf<(this: { name: string }, message: string) => string>()
  })

  test('should not attach the "this" paramater if the function does not have any parameters', () => {
    const fn = vi.fn(() => 'Hello') as () => string
    const result = attach(fn)
    const object = { name: 'Joe' }
    const called = result.call(object)
    expect(called).toBe('Hello')
    expect(fn).toHaveBeenCalledWith(object)
    expectTypeOf(result).toEqualTypeOf<() => string>()
  })
})
