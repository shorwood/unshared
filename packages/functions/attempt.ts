import { MaybePromise } from '@unshared/types/MaybePromise'
import { NotPromise } from '@unshared/types/NotPromise'

/**
 * A result type that can be used to represent the result of an operation that
 * can fail. This type is similar to the `Either` type in functional programming
 * languages.
 *
 * @template T The type of the value.
 * @template E The type of the error.
 * @example AttemptResult<string, Error> // [string | undefined, Error | undefined]
 */
export type AttemptResult<T = unknown, E extends Error = Error> = [T | undefined, E | undefined]

/**
 * Run a function and return the result and error in an array. If the function
 * throws an error, the error will be returned in the second element of the
 * array. Otherwise, the result will be returned in the first element of the
 * array.
 *
 * If the function is asynchronous, the result will be a promise that resolves
 * to the result and error as an array.
 *
 * @param fn The function to run.
 * @returns A tuple with the value and the error if any.
 * @example const [result, error] = attempt(() => true) // [true, undefined]
 */
export function attempt<R, E extends Error = Error>(fn: () => Promise<R>): Promise<AttemptResult<R, E>>
export function attempt<R, E extends Error = Error>(fn: () => NotPromise<R>): AttemptResult<R, E>
export function attempt<R, E extends Error = Error>(fn: () => MaybePromise<R>): MaybePromise<AttemptResult<R, E>>
export function attempt(fn: Function): unknown {
  try {
    const result = fn()
    return result instanceof Promise
      ? result
        .then(value => [value, undefined])
        .catch(error => [undefined, error])
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
    expectTypeOf(result).toEqualTypeOf<[string | undefined, Error | undefined] | Promise<[string | undefined, Error | undefined]>>()
  })
}
