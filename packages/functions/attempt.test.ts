import type { Result } from './attempt'
import { attempt } from './attempt'

describe('attempt', () => {
  test('should returns value using a valid sync function', () => {
    const result = attempt(() => 'Hello, world!')
    expect(result).toStrictEqual({ value: 'Hello, world!' })
    expectTypeOf(result).toEqualTypeOf<Result<string, Error>>()
  })

  test('should returns error using a failing sync function', () => {
    const result = attempt(() => { throw new Error('Uh oh! Something went wrong!') })
    expect(result).toStrictEqual({ error: new Error('Uh oh! Something went wrong!') })
    expectTypeOf(result).toEqualTypeOf<Result<never, Error>>()
  })

  test('should returns value using a valid async function', async() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const result = await attempt(async() => 'Hello, world!')
    expect(result).toStrictEqual({ value: 'Hello, world!' })
    expectTypeOf(result).toEqualTypeOf<Result<string, Error>>()
  })

  test('should returns error using a failing async function', async() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const result = await attempt(async() => { throw new Error('Uh oh! Something went wrong!') })
    expect(result).toStrictEqual({ error: new Error('Uh oh! Something went wrong!') })
    expectTypeOf(result).toEqualTypeOf<Result<never, Error>>()
  })

  test('should return a discriminated union type', () => {
    const result = attempt(() => 'Hello, world!')
    if (result.error) expectTypeOf(result).toEqualTypeOf<{ error: Error; value: undefined }>()
    if (result.value) expectTypeOf(result).toEqualTypeOf<{ error: undefined; value: string }>()
  })
})
