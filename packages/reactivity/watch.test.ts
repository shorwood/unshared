import { computed } from './computed'
import { reactive } from './reactive'
import { reference } from './reference'
import { watch } from './watch'

describe('watch', () => {
  test('should watch a reactive object', () => {
    const callback = vi.fn()
    const value = reactive({ foo: 'bar' })
    watch(value, callback)
    value.foo = 'baz'
    expect(callback).toHaveBeenCalledWith({ foo: 'baz' })
  })

  test('should watch nested properties', () => {
    const callback = vi.fn()
    const value = reactive({ foo: { bar: 'baz' } }, { deep: true })
    watch(value, callback)
    value.foo.bar = 'qux'
    expect(callback).toHaveBeenCalledWith({ foo: { bar: 'qux' } })
  })

  test('should watch a reactive reference', () => {
    const callback = vi.fn()
    const value = reference('foo')
    watch(value, callback)
    value.value = 'bar'
    expect(callback).toHaveBeenCalledWith('bar')
  })

  test('should watch a computed value', () => {
    const callback = vi.fn()
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { eager: true })
    watch(sum, callback)
    a.value = 2
    expect(callback).toHaveBeenCalledWith(4)
  })

  test('should return a function to stop watching', () => {
    const callback = vi.fn()
    const value = reactive({ foo: 'bar' })
    const stop = watch(value, callback)
    stop()
    value.foo = 'baz'
    expect(callback).not.toHaveBeenCalled()
  })

  test('should infer the parameters of  the callback', () => {
    const value = reference<'foo'>('foo')
    watch(value, (value) => {
      expectTypeOf(value).toEqualTypeOf<'foo'>()
    })
  })
})
