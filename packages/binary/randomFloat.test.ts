import { randomFloat } from './randomFloat'

it('returns a random float between 0 and 1', () => {
  const result = randomFloat()
  expect(result).toEqualTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0)
  expect(result).toEqualLessThanOrEqual(1)
})

it('returns a random float between min and max', () => {
  const result = randomFloat(10, 20)
  expect(result).toEqualTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(10)
  expect(result).toEqualLessThanOrEqual(20)
})
