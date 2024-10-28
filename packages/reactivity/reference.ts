import type { Reactive, ReactiveOptions } from './reactive'
import { ReferenceFlag } from './constants'
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
