import { isReference } from './isReference'
import { Reactive, ReactiveOptions, reactive } from './reactive'

/** Symbol to identify reactive references. */
export const ReferenceFlag = Symbol('Reference')

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
export type MaybeReference<T = unknown> = T | Reference<T>

/**
 * A reference to a reactive value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions.
 *
 * @returns A reactive reference to the value.
 * @example reference('foo') // { value: 'foo' }
 */
export function reference<T>(): Reference<T | undefined>
/**
 * A reference to a reactive value. This is a wrapper around a primitive value
 * that allows it to be used in reactive expressions.
 *
 * @param value The value to wrap.
 * @param options The reactive options.
 * @returns A reactive reference to the value.
 * @example reference('foo') // { value: 'foo' }
 */
export function reference<T>(value: T, options?: ReactiveOptions<ReferenceObject<T>>): Reference<T>
export function reference(value?: unknown, options: ReactiveOptions<ReferenceObject> = {}): Reference {
  return isReference(value)
    ? value
    : reactive({ value, [ReferenceFlag]: true }, options)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a reactive reference', () => {
    const callback = vi.fn()
    const result = reference(1, { callbacks: [callback] })
    result.value = 2
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith({ value: 2, [ReferenceFlag]: true })
    expectTypeOf(result).toEqualTypeOf<Reference<number>>()
  })

  it('should create a reactive reference with a default value', () => {
    const callback = vi.fn()
    const result = reference<number>(undefined, { callbacks: [callback] })
    result.value = 1
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith({ value: 1, [ReferenceFlag]: true })
    expectTypeOf(result).toEqualTypeOf<Reference<number>>()
  })

  it('should return as-is if the value is a reactive reference', () => {
    const value1 = reference()
    const value2 = reference(value1)
    expect(value2).toBe(value1)
  })
}
