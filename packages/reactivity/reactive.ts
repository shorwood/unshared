import type { Function, NotUndefined } from '@unshared/types'
import { ReactiveData, ReactiveFlag } from './constants'

/**
 * A callback to call when an object is changed.
 *
 * @param object The object that was changed.
 */
export type ReactiveCallback<T = unknown> = (object: T) => void

export interface ReactiveOptions<T = unknown> {

  /**
   * An array of functions that will be called when the object is changed.
   * This is used internally to pass the callbacks to nested reactive objects.
   * You should not use this option directly and instead use the `watch`
   * function.
   *
   * @internal
   */
  callbacks?: Array<ReactiveCallback<T>>

  /**
   * Whether to recursively watch the nested objects and arrays. Be careful
   * when using this option, as it can cause performance issues if the object
   * is very large or deeply nested.
   *
   * @default false
   * @example
   * const source = { foo: { bar: 'baz' } }
   * const callback = () => console.log('Object changed!')
   * const object = reactive(source, { deep: true, callbacks: [callback] })
   * object.foo.bar = 'qux' // 'Object changed!'
   */
  deep?: boolean

  /**
   * An array of protype methods that will trigger a change. This is used to
   * capture changes to arrays and maps.
   *
   * @example
   * const source = [1, 2, 3]
   * const callback = () => console.log('Array changed!')
   * const array = reactive(source, { hooks: ['push'], callbacks: [callback] })
   * array.push(4) // 'Array changed!'
   */
  hooks?: string[]

  /**
   * The root object that is being watched. This is and should only be used
   * internally to track changes to nested objects.
   *
   * @internal
   */
  root?: T
}

/**
 * A reactive object is the proxy object that is returned by the `reactive`
 * function. It is used to track changes to the object and notify any
 * subscribers.
 *
 * @template T The type of the object.
 * @returns A reactive object.
 * @example Reactive<{ foo: string }>
 */
export type Reactive<T = unknown> = T & {
  [ReactiveData]: {
    callbacks: Array<ReactiveCallback<T extends unknown ? any : T>>
    source: T extends unknown ? any : T
  }
  [ReactiveFlag]: true
}

/**
 * An object that might be reactive.
 *
 * @template T The type of the object.
 * @returns An object that might be reactive.
 * @example MaybeReactive<{ foo: string }>
 */
export type MaybeReactive<T = unknown> = Reactive<T> | T

/**
 * Wrap a function in a function that will trigger a callback when the function
 * is called. Handles both synchronous and asynchronous functions.
 *
 * @param fn The function to wrap.
 * @param callback The callback to call when the function is called.
 * @param source The source object that is being wrapped.
 * @param root The root object that is being watched.
 * @returns The wrapped function.
 */
function wrapFunction(fn: Function, callback: Function, source: unknown, root: unknown) {
  return function(...args: unknown[]) {
    const result = fn.apply(source, args) as unknown

    // --- If the result is a promise, wait for it to resolve before calling
    if (result instanceof Promise)
      return result.then((value: unknown) => { callback(root); return value })

    // --- the callback. Otherwise, call the callback immediately.
    callback(root)
    return result
  }
}

/**
 * Wrap a Proxy operation in a function that will trigger a callback when the
 * operation is called.
 *
 * @param operation The name of the operation.
 * @param callback The callback to call when the operation is called.
 * @param source The source object that is being wrapped.
 * @param root The root object that is being watched.
 * @returns The wrapped operation.
 */
function wrapOperation(operation: keyof ProxyHandler<object>, callback: Function, source: unknown, root: unknown) {
  return function(...args: unknown[]) {
    if (operation === 'defineProperty') {
      const [target, property, descriptor] = args as Parameters<NotUndefined<ProxyHandler<object>['defineProperty']>>
      const newValue: unknown = descriptor.value
      const oldValue: unknown = Reflect.get(target, property, source)
      if (newValue === oldValue) return true
    }

    // --- Apply the operation, trigger the callback, and return the operation result.
    // @ts-expect-error: The `operation` is a valid key of `Reflect`.
    const result = Reflect[operation].apply(source, args) as boolean
    callback(root)
    return result
  }
}

/**
 * Wrap an object in a Proxy that will trigger a callback when a sub-property is set.
 * This is useful for watching objects and arrays for changes. You can set the
 * `deep` option to `true` to recursively watch nested objects and arrays.
 *
 * Callback will not be called if you set a property using `Object.defineProperty`
 * or `Object.defineProperties` as it will not trigger the Proxy handler. You can
 * leverage this behavior to modify the object without triggering the callback.
 *
 * When watching arrays, prototype methods that modify the array will not trigger
 * the callback. You can use the `hooks` option to register the names of methods
 * that will trigger the callback.
 *
 * @param source The source object.
 * @param options The options.
 * @returns A proxy object that will trigger when a property is changed.
 * @example
 * const callback = () => console.log('Object changed!')
 * const value = reactive({ foo: 'bar', { callbacks: [callback] })
 * value.foo = 'baz' // 'Object changed!'
 */
export function reactive<T>(source: T, options: ReactiveOptions<T> = {}): Reactive<T> {
  const { callbacks = [], deep = false, hooks = [], root = source } = options

  // --- Check if the source is an object.
  if (typeof source !== 'object' || source === null)
    throw new TypeError('The source must be an object or array.')

  // --- Define a function that will call all the callbacks associated with the object.
  const callback = () => { for (const callback of callbacks) callback(root) }

  // --- Create the proxy.
  return new Proxy(source, {
    defineProperty: wrapOperation('defineProperty', callback, source, root),
    deleteProperty: wrapOperation('deleteProperty', callback, source, root),
    setPrototypeOf: wrapOperation('setPrototypeOf', callback, source, root),

    // --- Get the value of a property.
    get(target, property) {
      if (property === ReactiveFlag) return true
      if (property === ReactiveData) return { callbacks, source }
      let value: unknown = Reflect.get(target, property, source)

      // --- Bind functions to the target.
      // --- If the function is registered as a hook, wrap it.
      if (typeof value === 'function') {
        return hooks.includes(property as string)
          ? wrapFunction(value as Function, callback, source, root)
          : value.bind(target) as unknown
      }

      // --- If deep and the value is an object, watch it.
      if (deep && typeof value === 'object' && value !== null)
        value = reactive(value as T, { callbacks, deep, hooks, root })

      // --- Return the value.
      return value
    },
  }) as Reactive<T>
}
