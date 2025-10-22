import type { Reference } from './reference'
import { ReactiveFlag, ReferenceFlag } from './constants'
import { reference } from './reference'

describe('reference', () => {
  test('should create a reference', () => {
    const callback = vi.fn()
    const result = reference(1, { callbacks: [callback] })
    expect(result[ReferenceFlag]).toBe(true)
    expect(result[ReactiveFlag]).toBe(true)
    expect(result.value).toBe(1)
  })

  test('should create a reference with no value', () => {
    const result = reference<number>()
    expect(result[ReferenceFlag]).toBe(true)
    expect(result[ReactiveFlag]).toBe(true)
    expect(result.value).toBeUndefined()
  })

  test('should call callbacks when the value changes', () => {
    const callback = vi.fn()
    const result = reference(1, { callbacks: [callback] })
    result.value = 2
    expect(callback).toHaveBeenCalledExactlyOnceWith({ [ReferenceFlag]: true, value: 2 })
  })

  test('should return as-is if the value is already reactive reference', () => {
    const value1 = reference(1)
    const value2 = reference(value1)
    expect(value2).toMatchObject(value1)
  })

  test('should infer the type of the value', () => {
    const value = reference('foo')
    expectTypeOf(value).toEqualTypeOf<Reference<string>>()
  })

  test('should pass the type of the value as a generic', () => {
    const value = reference<'bar' | 'foo'>('foo')
    expectTypeOf(value).toEqualTypeOf<Reference<'bar' | 'foo'>>()
  })
})
