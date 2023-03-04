/* eslint-disable sonarjs/cognitive-complexity */
export interface WatchOptions<T extends object = object> {
  /**
   * Whether to recursively watch the nested objects and arrays. Be careful
   * when using this option, as it can cause performance issues if the object
   * is very large or deeply nested.
   *
   * @default false
   */
  deep?: boolean
  /**
   * The root object that is being watched. This is used to allow nested
   * objects to be watched without having to pass the root object to each
   * nested object.
   *
   * @internal
   */
  root?: T
  /**
   * An array of protype methods that will trigger a change. This is used to
   * capture changes to arrays and maps.
   *
   * @example
   * const source = [1, 2, 3]
   * const callback = () => console.log('Array changed!')
   * const array = watch(source, callback, { hooks: ['push'] })
   * array.push(4) // 'Array changed!'
   */
  hooks?: string[]
}

/**
 * The callback to call when an object is changed.
 *
 * @param object The object that was changed.
 */
export type WatchCallback<T extends object> = (object: T) => void

/**
 * Create an object that will call a callback when one of its properties is set. You can
 * also watch nested objects and arrays by setting the `deep` option to `true`.
 *
 * ### Note 1:
 *
 * This function will not work with `Object.defineProperty` or `Object.defineProperties`
 * as it will not trigger the Proxy handler. You can leverage this behavior to modify
 * the object without triggering the callback.
 *
 * ### Note 2:
 *
 * When watching arrays, you can use the `hooks` option to specify which methods will
 * trigger a change. For example, if you only want to watch when an item is added to
 * the array, you can set the `hooks` option to `['push']`.
 *
 * @param source The source object.
 * @param callback The callback to call when a property is set.
 * @param options The options.
 * @returns A proxy object that will trigger when a property is changed.
 * @example
 * const source = { foo: 'bar' }
 * const callback = () => console.log('Object changed!')
 * const object = watch(source, callback)
 * result.foo = 'baz' // 'Object changed!'
 * @example
 * const source = [1, 2, 3]
 * const callback = () => console.log('Array changed!')
 * const array = watch(source, callback, { hooks: ['push'] })
 * array.push(4) // 'Array changed!'
 */
export function watch<T extends object>(source: T, callback: WatchCallback<T>, options: WatchOptions<T> = {}): T {
  if (typeof source !== 'object' || source === null)
    throw new TypeError('Expected the object to be an object')
  if (typeof callback !== 'function')
    throw new TypeError('Expected the callback to be a function')
  if (typeof options !== 'object' || options === null)
    throw new TypeError('Expected the options to be an object')

  // --- Destructure the options.
  const {
    deep = false,
    root = source,
    hooks = [],
  } = options

  // --- Validate the options.
  if (typeof deep !== 'boolean')
    throw new TypeError('Expected the deep option to be a boolean')
  if (typeof root !== 'object' || root === null)
    throw new TypeError('Expected the root option to be an object')
  if (!Array.isArray(hooks))
    throw new TypeError('Expected the methods option to be an array')
  if (hooks.some(method => typeof method !== 'string'))
    throw new TypeError('Expected the methods option to be an array of strings')

  // --- Wrap a watched function.
  const wrapFunction = (fn: Function) => (...args: unknown[]) => {
    const result = fn(...args)
    callback(root)
    return result
  }

  // --- Wrap an operation.
  const wrapOperation = (operation: keyof ProxyHandler<T>) => (...args: unknown[]) => {
    // --- Do not callback if the value is the same.
    if (operation === 'defineProperty') {
      const [target, property, descriptor] = args as [T, PropertyKey, PropertyDescriptor]
      const newValue = descriptor.value
      const oldValue = Reflect.get(target, property)
      if (newValue === oldValue) return true
    }

    // --- Reflect the operation on the source object.
    // @ts-expect-error: ignore
    const result = Reflect[operation].apply(source, args)
    callback(root)
    return result
  }

  // --- Create the proxy.
  return new Proxy(source, {
    get(target, property) {
      let value = Reflect.get(target, property)

      // --- Bind the function to the object.
      if (typeof value === 'function') value = value.bind(target)

      // --- If the value is hooked, wrap it.
      if (hooks.includes(<string>property)) return wrapFunction(value)

      // --- If deep and the property is an object, watch it.
      if (deep && typeof value === 'object' && value !== null)
        value = watch(value, callback, { deep, root, hooks })

      // --- Return the value.
      return value
    },

    // --- Wrap write operations.
    defineProperty: wrapOperation('defineProperty'),
    deleteProperty: wrapOperation('deleteProperty'),
    setPrototypeOf: wrapOperation('setPrototypeOf'),
  }) as T
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('shoult return a proxy of the object', () => {
    const object = { foo: 'bar' }
    const result = watch(object, () => {})
    expect(result).toEqual(object)
    expect(result).not.toStrictEqual(object)
    expectTypeOf(result).toEqualTypeOf(object)
  })

  it('should trigger when a property is set', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    result.foo = 'baz'
    expect(callback).toHaveBeenCalledWith({ foo: 'baz' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when a property is added', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    // @ts-expect-error: ignore
    result.baz = 'qux'
    expect(callback).toHaveBeenCalledWith({ foo: 'bar', baz: 'qux' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when a property is deleted', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    // @ts-expect-error: ignore
    delete result.foo
    expect(callback).toHaveBeenCalledWith({})
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when Object.assign is used', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    Object.assign(result, { baz: 'qux' })
    expect(callback).toHaveBeenCalledWith({ foo: 'bar', baz: 'qux' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when a property is set with Object.defineProperty', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    Object.defineProperty(result, 'foo', { value: 'baz' })
    expect(callback).toHaveBeenCalledWith({ foo: 'baz' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when a property is set with Object.defineProperties', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    Object.defineProperties(result, { foo: { value: 'baz' } })
    expect(callback).toHaveBeenCalledWith({ foo: 'baz' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when the prototype is set', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    Object.setPrototypeOf(result, { baz: 'qux' })
    expect(callback).toHaveBeenCalledWith({ foo: 'bar' })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when a nested property is set', () => {
    const callback = vi.fn()
    const object = { foo: { bar: { baz: 'qux' } } }
    const result = watch(object, callback, { deep: true })
    result.foo.bar.baz = 'quux'
    expect(callback).toHaveBeenCalledWith({ foo: { bar: { baz: 'quux' } } })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when an item is pushed to an array', () => {
    const callback = vi.fn()
    const object = ['bar']
    const result = watch(object, callback, { hooks: ['push'] })
    const resultPush = result.push('baz')
    expect(resultPush).toEqual(2)
    expect(callback).toHaveBeenCalledWith(['bar', 'baz'])
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should trigger when an items is pushed to a nested array', () => {
    const callback = vi.fn()
    const object = { foo: ['bar'] }
    const result = watch(object, callback, { deep: true, hooks: ['push'] })
    const resultPush = result.foo.push('baz')
    expect(resultPush).toEqual(2)
    expect(callback).toHaveBeenCalledWith({ foo: ['bar', 'baz'] })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('should not trigger when a property is set to the same value', () => {
    const callback = vi.fn()
    const object = { foo: 'bar' }
    const result = watch(object, callback)
    result.foo = 'bar'
    expect(callback).not.toHaveBeenCalled()
  })

  it('should throw if the source is not an object', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch('foo', () => {})
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the callback is not a function', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch({}, 'foo')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the deep option is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch({}, () => {}, { deep: 'foo' })
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the root option is not an object', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch({}, () => {}, { root: 'foo' })
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the hooks option is not an array', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch({}, () => {}, { hooks: 'foo' })
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the hooks option is not an array of strings', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => watch({}, () => {}, { hooks: [1] })
    expect(shouldThrow).toThrow(TypeError)
  })
}
