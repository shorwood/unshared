import { MaybePromise, NotPromise } from '@unshared/types'

/**
 * A result type that can be used to represent the result of an operation that
 * can fail. This type is similar to the `Either` type in functional programming
 * languages.
 *
 * @template T The type of the value.
 * @template E The type of the error.
 * @example Result<string, Error> // [string | undefined, Error | undefined]
 */
export type Result<T = unknown, E extends Error = Error> = [
  value: T | undefined,
  error: E | undefined,
]

/**
 * Run a function and return the value or error in an array. If the function
 * throws an error, the error will be returned in the second element of the
 * array. Otherwise, the value will be returned in the first element of the
 * array. This allows for similar error handling to Rust's `Result` type.
 *
 * If the function is asynchronous, the result will be a promise that resolves
 * to the result asynchronously. If the function is synchronous, the result will
 * be returned immediately.
 *
 * @param fn The function to run.
 * @returns A tuple with the value and the error if any.
 * @example
 * const [result, error] = attempt(() => true) // [true, undefined]
 * const [result, error] = attempt(() => { throw new Error('I am failing') }) // [undefined, Error('I am failing')]
 */
export function attempt<R, E extends Error = Error>(fn: () => Promise<R>): Promise<Result<R, E>>
export function attempt<R, E extends Error = Error>(fn: () => NotPromise<R>): Result<R, E>
export function attempt<R, E extends Error = Error>(fn: () => MaybePromise<R>): MaybePromise<Result<R, E>>
export function attempt(fn: Function): unknown {
  try {
    const result = fn()

    // --- Return a promise if the function is asynchronous.
    return result instanceof Promise
      ? result
        .then(value => [value, undefined])
        .catch(error => [undefined, error])

      // --- Return the result immediately if the function is synchronous.
      : [result, undefined]
  }

  // --- Catch sync error.
  catch (error: unknown) {
    return [undefined, error]
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  const throws = (): number => { throw new Error('I am failing') }
  const throwsAsync = async() => { throw new Error('I am failing asyncrhonously') }
  const returns = () => 'I am valid'
  const resolves = async() => 'I am valid asynchronously'

  it('should returns value and error for a failing sync function', async() => {
    const [result, error] = attempt(throws)
    expect(result).toEqual(undefined)
    expect(error).toBeInstanceOf(Error)
    expect(error!.message).toEqual('I am failing')
  })

  it('should returns value and error for a failing async function', async() => {
    const [result, error] = await attempt(throwsAsync)
    expect(result).toEqual(undefined)
    expect(error).toBeInstanceOf(Error)
    expect(error!.message).toEqual('I am failing asyncrhonously')
  })

  it('should returns value and undefined for a valid sync function', async() => {
    const [result, error] = attempt(returns)
    expect(result).toEqual('I am valid')
    expect(error).toEqual(undefined)
  })

  it('should returns value and undefined for a valid async function', async() => {
    const [result, error] = await attempt(resolves)
    expect(result).toEqual('I am valid asynchronously')
    expect(error).toEqual(undefined)
  })

  it('should type the return value if a syncronous function is passed', () => {
    const result = attempt(returns)
    expectTypeOf(result).toEqualTypeOf<[string | undefined, Error | undefined]>()
  })

  it('should type the return value if an asyncronous function is passed', async() => {
    const result = attempt(resolves)
    expectTypeOf(result).toEqualTypeOf<Promise<[string | undefined, Error | undefined]>>()
  })

  it('should type the return value if a maybe asyncronous function is passed', async() => {
    const result = attempt(returns as () => MaybePromise<string>)
    expectTypeOf(result).toEqualTypeOf<Promise<[string | undefined, Error | undefined]> | [string | undefined, Error | undefined]>()
  })
}
