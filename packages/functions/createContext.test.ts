import { createContext } from './createContext'

describe('createContext', () => {
  test('should create a context with an initial value', () => {
    const context = createContext({ foo: 'bar' })
    expect(context.value).toStrictEqual({ foo: 'bar' })
    expectTypeOf(context).toExtend<{
      runInContext: <U>(fn: (context: { foo: string }) => U) => U
      value: { foo: string }
    }>()
  })

  test('should set the context value globally', () => {
    const context = createContext({ foo: 'bar' })
    context.value = { foo: 'baz' }
    expect(context.value).toStrictEqual({ foo: 'baz' })
  })

  test('should run a function in the context and return the result', () => {
    const context = createContext({ foo: 'bar' })
    const result = context.runInContext(context => context.foo)
    expect(result).toBe('bar')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should run a function that modifies the context', () => {
    const context = createContext({ foo: 'bar' })
    context.runInContext(context => context.foo = 'baz')
    expect(context.value).toStrictEqual({ foo: 'baz' })
  })

  test('should run with the context being isolated even when modified from the outside', async() => {
    const context = createContext({ foo: 'bar' })
    const result = await context.runInContext(context => new Promise(resolve => setTimeout(() => resolve(context.foo), 10)))
    context.value.foo = 'baz'
    expect(result).toBe('bar')
  })
})
