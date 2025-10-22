import type { Reactive } from './reactive'
import { reactive } from './reactive'

describe('reactive', () => {
  test('should return a proxy of the object', () => {
    const object = { foo: 'bar' }
    const result = reactive(object)
    expect(result).toMatchObject(object)
    expect(result).not.toStrictEqual(object)
    expectTypeOf(result).toEqualTypeOf<Reactive<typeof object>>()
  })

  test('should trigger when a property is set', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    result.foo = 'baz'
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: 'baz' })
    expectTypeOf(result).toEqualTypeOf<Reactive<typeof object>>()
  })

  test('should trigger when a property is ad2ded', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })

    // @ts-expect-error: ignore
    result.baz = 'qux'
    expect(callback).toHaveBeenCalledExactlyOnceWith({ baz: 'qux', foo: 'bar' })
    expectTypeOf(result).toEqualTypeOf<Reactive<typeof object>>()
  })

  test('should trigger when a property is deleted', () => {
    const callback = vi.fn() as () => object
    const object: { foo?: string } = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    delete result.foo
    expect(callback).toHaveBeenCalledExactlyOnceWith({})
  })

  test('should trigger when Object.assign is used', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    Object.assign(result, { baz: 'qux' })
    expect(callback).toHaveBeenCalledExactlyOnceWith({ baz: 'qux', foo: 'bar' })
  })

  test('should trigger when a property is set with Object.defineProperty', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    Object.defineProperty(result, 'foo', { value: 'baz' })
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: 'baz' })
  })

  test('should trigger when a property is set with Object.defineProperties', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    Object.defineProperties(result, { foo: { value: 'baz' } })
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: 'baz' })
  })

  test('should trigger when the prototype is set', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    Object.setPrototypeOf(result, { baz: 'qux' })
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: 'bar' })
  })

  test('should trigger when a nested property is set', () => {
    const callback = vi.fn() as () => object
    const object = { foo: { bar: { baz: 'qux' } } }
    const result = reactive(object, { callbacks: [callback], deep: true })
    result.foo.bar.baz = 'quux'
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: { bar: { baz: 'quux' } } })
  })

  test('should trigger when an item is pushed to an array', () => {
    const callback = vi.fn() as () => object
    const object = ['bar']
    const result = reactive(object, { callbacks: [callback], hooks: ['push'] })
    const resultPush = result.push('baz')
    expect(resultPush).toBe(2)
    expect(callback).toHaveBeenCalledExactlyOnceWith(['bar', 'baz'])
  })

  test('should trigger when an items is pushed to a nested array', () => {
    const callback = vi.fn() as () => object
    const object = { foo: ['bar'] }
    const result = reactive(object, { callbacks: [callback], deep: true, hooks: ['push'] })
    const resultPush = result.foo.push('baz')
    expect(resultPush).toBe(2)
    expect(callback).toHaveBeenCalledExactlyOnceWith({ foo: ['bar', 'baz'] })
  })

  test('should not trigger when a property is set to the same value', () => {
    const callback = vi.fn() as () => object
    const object = { foo: 'bar' }
    const result = reactive(object, { callbacks: [callback] })
    result.foo = 'bar'
    expect(callback).not.toHaveBeenCalledOnce()
  })
})
