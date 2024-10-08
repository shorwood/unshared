import type { Reactive, ReactiveOptions } from './reactive'
import { ReactiveFlag, ReferenceFlag } from './constants'
import { isReference } from './isReference'
import { reactive } from './reactive'

/**
 * A reactive reference to a value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions.
 *
 * @internal
 * @template T The type of the value.
 * @example ReferenceObject<string> // { value: string }
 */
interface ReferenceObject<T = unknown> {
  [ReferenceFlag]: true
  value: T
}

/**
 * A reactive reference to a value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions.
 *
 * @template T The type of the value.
 * @returns A reactive reference to the value.
 * @example Reference<string> // Reactive<{ value: string }>
 */
export type Reference<T = unknown> = Reactive<ReferenceObject<T>>

/**
 * A type that might be a reactive reference.
 *
 * @template T The type of the value.
 * @returns Maybe a reactive reference to the value.
 * @example MaybeReference<string> // Reactive<{ value: string }> | string
 */
export type MaybeReference<T = unknown> = Reference<T> | T

/**
 * Create a reference to a value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions. If the value is already
 * a reactive reference, it is returned as-is.
 *
 * @returns A reactive reference to the value.
 * @example reference() // { value: undefined }
 */
export function reference<T>(): Reference<T | undefined>

/**
 * Create a reference to a value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions. If the value is already
 * a reactive reference, it is returned as-is.
 *
 * @param value The value to wrap.
 * @param options The reactive options.
 * @returns A reactive reference to the value.
 * @example reference('foo') // { value: 'foo' }
 */
export function reference<T>(value: Reference<T>, options?: ReactiveOptions<ReferenceObject<T>>): Reference<T>
export function reference<T>(value: T, options?: ReactiveOptions<ReferenceObject<T>>): Reference<T>
export function reference<T>(value?: Reference<T> | T, options?: ReactiveOptions<ReferenceObject<T | undefined>>) {

  // --- Prevent nested references.
  if (isReference<T>(value)) return value

  // --- Create and return the reactive object that wraps a value.
  return reactive({ [ReferenceFlag]: true, value }, options as ReactiveOptions)
}

/* v8 ignore next */
if (import.meta.vitest) {
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
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith({ [ReferenceFlag]: true, value: 2 })
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
}
