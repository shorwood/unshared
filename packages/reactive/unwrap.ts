import { Computed, computed } from './computed'
import { isComputed } from './isComputed'
import { isReactive } from './isReactive'
import { isReference } from './isReference'
import { Reactive, ReactiveData, reactive } from './reactive'
import { Reference, reference } from './reference'

/**
 * Dereference a {@link Reactive} type or unwrap a {@link Reference}.
 * If the value is not reactive, it is returned as-is.
 *
 * @template T The type of the value to unwrap.
 * @returns The unwrapd value.
 * @example Unwrapped<Reactive<{ foo: 'bar' }>> // { foo: 'bar' }
 * @example Unwrapped<Reference<'foo'>> // 'foo'
 */
export type Unwrapped<T> =
  T extends Reference<infer U> ? U
    : T extends Computed<infer U> ? U
      : T extends Reactive<infer U> ? U
        : T

/**
 * Dereference a {@link reactive} object or unwrap a {@link reference}.
 * If the value is not reactive, it is returned as-is.
 *
 * @param value The value to unwrap.
 * @returns The unwrapd value.
 * const value = reference('foo')
 * unwrap(value) // 'foo'
 */
export function unwrap<T>(value: T): Unwrapped<T> {
  if (isComputed(value)) return value.value as Unwrapped<T>
  if (isReference(value)) return value.value as Unwrapped<T>
  if (isReactive(value)) return value[ReactiveData].source as Unwrapped<T>
  return value as Unwrapped<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should unwrap reactive object', () => {
    const source = { foo: 'bar' }
    const value = reactive(source)
    const result = unwrap(value)
    expect(result).toEqual(source)
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  it('should unwrap reactive value', () => {
    const value = reference('foo')
    const result = unwrap(value)
    expect(result).toEqual('foo')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it('should unwrap a computed value', () => {
    const value = computed([], () => 'foo')
    const result = unwrap(value)
    expect(result).toEqual('foo')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it('should return non-reactive values as-is', () => {
    const value = 'foo'
    const result = unwrap(value)
    expect(result).toStrictEqual(value)
    expectTypeOf(result).toEqualTypeOf<string>()
  })
}
