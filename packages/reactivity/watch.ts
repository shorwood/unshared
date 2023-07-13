import { Reactive, ReactiveData, reactive } from './reactive'
import { Reference, reference } from './reference'
import { Unwraped, unwrap } from './unwrap'

/** Stop watching a reactive object. */
export type Unwatch = () => void

/**
 * The callback to invoke when a reactive object or reference changes.
 * If the object is a reference, the value will be unwrapped.
 *
 * @template T The type of the reactive object or reference.
 * @example (value: string) => console.log(value)
 */
export type WatchCallback<T extends Reactive | Reference> = (value: Unwraped<T>) => void

/**
 * Watch a reactive object for changes on a specific path, and invoke a callback
 * when the value changes. If the object is a `Reference`, the callback will be
 * invoked with the unwrapped value.
 *
 * @param value The reactive object or reference to watch.
 * @param callback The callback to invoke when the value changes.
 * @returns A function to stop watching the object.
 * @example
 * const ref = reference('foo')
 * const stop = watch(ref, value => console.log(value))
 */
export function watch<T extends Reactive | Reference>(value: T, callback: WatchCallback<T>): Unwatch {
  const internalCallback = (value: T) => callback(<any>unwrap(value))

  // --- Add the callback to the reactive object.
  value[ReactiveData].callbacks.push(internalCallback)

  // --- Return a function to remove the callback.
  return () => {
    const index = value[ReactiveData].callbacks.indexOf(internalCallback)
    if (index !== -1) value[ReactiveData].callbacks.splice(index, 1)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should watch a reactive object', () => {
    const callback = vi.fn()
    const value = reactive({ foo: 'bar' })
    watch(value, callback)
    value.foo = 'baz'
    expect(callback).toHaveBeenCalledWith({ foo: 'baz' })
  })

  it('should watch a reactive reference', () => {
    const callback = vi.fn()
    const value = reference('foo')
    watch(value, callback)
    value.value = 'bar'
    expect(callback).toHaveBeenCalledWith('bar')
  })

  it('should return a function to stop watching', () => {
    const callback = vi.fn()
    const value = reactive({ foo: 'bar' })
    const stop = watch(value, callback)
    stop()
    value.foo = 'baz'
    expect(callback).not.toHaveBeenCalled()
  })

  it('should infer the parameters of  the callback', () => {
    const value = reference<'foo'>('foo')
    watch(value, (value) => {
      expectTypeOf(value).toEqualTypeOf<'foo'>()
    })
  })
}
