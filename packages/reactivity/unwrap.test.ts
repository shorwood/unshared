import { computed } from './computed'
import { reactive } from './reactive'
import { reference } from './reference'
import { unwrap } from './unwrap'

describe('unwrap', () => {
  test('should unwrap reactive object', () => {
    const source = { foo: 'bar' }
    const value = reactive(source)
    const result = unwrap(value)
    expect(result).toMatchObject(source)
    expect(result).not.toStrictEqual(source)
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  test('should unwrap reactive value', () => {
    const value = reference('foo')
    const result = unwrap(value)
    expect(result).toBe('foo')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should unwrap a computed value', () => {
    const value = computed([], () => 'foo')
    const result = unwrap(value)
    expect(result).toBe('foo')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should return non-reactive object as-is', () => {
    const value = { foo: 'bar' }
    const result = unwrap(value)
    expect(result).toStrictEqual(value)
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  test('should return non-reactive string as-is', () => {
    const value = 'foo'
    const result = unwrap(value)
    expect(result).toStrictEqual(value)
    expectTypeOf(result).toEqualTypeOf<string>()
  })
})
