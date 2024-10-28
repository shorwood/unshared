import { flow } from './flow'

describe('flow', () => {
  test('should transform a value using the given transformers', () => {
    const result = flow(1, n => n + 1, n => n * 2, n => n.toString())
    expect(result).toBe('4')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should be able to transform a value using async transformers', async() => {
    const result = flow(1, n => Promise.resolve(n), n => n.toFixed(1) )
    await expect(result).resolves.toBe('1.0')
    expectTypeOf(result).toEqualTypeOf<Promise<string>>()
  })
})
