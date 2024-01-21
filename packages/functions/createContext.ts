import { AsyncLocalStorage } from 'node:async_hooks'

export interface Context<T> {
  /**
   * Run a function in the context.
   *
   * @param fn The function to run.
   * @returns The return value of the function.
   * @example
   * const context = createContext({ foo: 'bar' })
   * context.runInContext((value) => value.foo = 'baz') // 'baz'
   */
  runInContext<U>(fn: (context: T) => U): U
  /**
   * Get the current context.
   *
   * @returns The current context.
   * @example
   * const context = createContext({ foo: 'bar' })
   * context.runInContext((value) => value.foo = 'baz') // 'baz'
   * context.value // { foo: 'baz' }
   */
  value: NonNullable<T>
}

/**
 * Create a unique context that can be used to isolate data between asynchronous
 * operations. This is useful for storing data that is specific to a request or
 * user.
 *
 * This function is a wrapper around the `AsyncLocalStorage` class from Node.js
 * that provides a simpler and safer API.
 *
 * @param initialValue The context value to store.
 * @returns A unique context identifier.
 * @example
 * const context = createContext({ foo: 'bar' })
 * context.runInContext(asl, (value) => setTimeout(() => console.log(value.foo), 1000)) // 'bar'
 * context.runInContext(asl, (value) => value.foo = 'baz') // 'baz'
 */
export function createContext<T = unknown>(initialValue: NonNullable<T>): Context<T> {

  // --- Create a new AsyncLocalStorage instance.
  const asl = new AsyncLocalStorage<T>()
  let internalValue = initialValue

  // --- Create a function that can be used to run a function in the context.
  const runInContext = (fn: (context: T) => unknown) => {
    // --- If already in context, just run the function.
    const context = asl.getStore()
    if (context) return fn(context)

    // --- Otherwise, run the function in the context.
    return asl.run(internalValue, () => {
      const contextValue = asl.getStore()!
      return fn(contextValue)
    })
  }

  // --- Return the context functions.
  return {
    runInContext,
    get value() { return runInContext(context => context) as NonNullable<T> },
    set value(value: NonNullable<T>) { runInContext(() => internalValue = value) },
  } as Context<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the context value', () => {
    const context = createContext({ foo: 'bar' })
    expect(context.value).toEqual({ foo: 'bar' })
  })

  it('should set the context value', () => {
    const context = createContext({ foo: 'bar' })
    context.value = { foo: 'baz' }
    expect(context.value).toEqual({ foo: 'baz' })
  })

  it('should run a function in the context and return the result', () => {
    const context = createContext({ foo: 'bar' })
    const result = context.runInContext(context => context.foo)
    expect(result).toEqual('bar')
  })

  it('should run a function that modifies the context', () => {
    const context = createContext({ foo: 'bar' })
    context.runInContext(context => context.foo = 'baz')
    expect(context.value).toEqual({ foo: 'baz' })
  })

  it('should run a function where context is preserved', async() => {
    const context = createContext({ foo: 'bar' })
    const result = await context.runInContext(context => new Promise(resolve => setTimeout(() => resolve(context.foo), 10)))
    context.value = { foo: 'baz' }
    expect(result).toEqual('bar')
  })
}
