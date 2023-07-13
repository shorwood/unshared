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
 * @example Unwraped<Reactive<{ foo: 'bar' }>> // { foo: 'bar' }
 * @example Unwraped<Reference<'foo'>> // 'foo'
 */
export type Unwraped<T> =
  T extends Reference<infer U> ? U
    : T extends Reactive<infer V> ? V
      : T

/**
 * Dereference a {@link reactive} object or unwrap a {@link reference}.
 * If the value is not reactive, it is returned as-is.
 *
 * @param value The value to unwrap.
 * @returns The unwrapd value.
 * @example unwrap(reactive({ foo: 'bar' })) // { foo: 'bar' }
 * @example unwrap(reference('foo')) // 'foo'
 */
export function unwrap<T>(value: T): Unwraped<T> {
  if (isReactive(value)) value = value[ReactiveData].source as T
  if (isReference(value)) value = value.value as T
  return value as Unwraped<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should unwrap reactive object', () => {
    const source = { foo: 'bar' }
    const value = reactive(source)
    const result = unwrap(value)
    expect(result).toStrictEqual(source)
    expectTypeOf(result).toEqualTypeOf<typeof source>()
  })

  it('should unwrap reactive references', () => {
    const value = reference<'foo'>('foo')
    const result = unwrap(value)
    expect(result).toEqual('foo')
    expectTypeOf(result).toEqualTypeOf<'foo'>()
  })

  it('should return non-reactive values as-is', () => {
    const value = { foo: 'bar' }
    const result = unwrap(value)
    expect(result).toStrictEqual(value)
    expectTypeOf(result).toEqualTypeOf<typeof value>()
  })
}
