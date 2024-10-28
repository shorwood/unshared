import { kindOf } from './kindOf'

describe('kindOf', () => {
  test('should return the kind of a null', () => {
    const result = kindOf(null)
    expect(result).toBe('null')
  })

  test('should return the kind of an undefined', () => {
    const result = kindOf()
    expect(result).toBe('undefined')
  })

  test('should return the kind of a boolean', () => {
    const result = kindOf(true)
    expect(result).toBe('boolean')
  })

  test('should return the kind of a number', () => {
    const result = kindOf(1)
    expect(result).toBe('number')
  })

  test('should return the kind of a String', () => {
    const result = kindOf('foo')
    expect(result).toBe('string')
  })

  test('should return the kind of a Symbol', () => {
    const value = Symbol('foo')
    const result = kindOf(value)
    expect(result).toBe('symbol')
  })

  test('should return the kind of a BigInt', () => {
    const result = kindOf(1n)
    expect(result).toBe('bigint')
  })

  test('should return the kind of a Function', () => {
    const value = () => { /* noop */ }
    const result = kindOf(value)
    expect(result).toBe('function')
  })

  test('should return the kind of an Array', () => {
    const value: unknown[] = []
    const result = kindOf(value)
    expect(result).toBe('Array')
  })

  test('should return the kind of an Object', () => {
    const value = { foo: 'bar' }
    const result = kindOf(value)
    expect(result).toBe('object')
  })

  test('should return the kind of a class instance', () => {
    class Foo {}
    const value = new Foo()
    const result = kindOf(value)
    expect(result).toBe('Foo')
  })
})
