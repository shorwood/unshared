import { NotPromise } from '@unshared/types/NotPromise'
import { MaybePromise } from '@unshared/types/MaybePromise'
import { Result } from '@unshared/types/Result'

/**
 * Run a function and return a tuple with the value and the error if any.
 *
 * @param fn The function to run.
 * @returns A tuple with the value and the error if any.
 * @example const [result, error] = attempt(() => true) // [true, undefined]
 */
export function attempt<R, E extends Error = Error>(fn: () => Promise<R>): Promise<Result<R, E>>
export function attempt<R, E extends Error = Error>(fn: () => NotPromise<R>): Result<R, E>
export function attempt<R, E extends Error = Error>(fn: () => MaybePromise<R>): MaybePromise<Result<R, E>>
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
