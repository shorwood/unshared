import { attempt } from '@unshared/functions'
import { assertNumberInRange } from './assertNumberInRange'

describe('assertNumberInRange', () => {
  describe('pass', () => {
    it('should pass if value is a number between min and max', () => {
      const result = assertNumberInRange(5, 1, 10)
      expect(result).toBeUndefined()
    })

    it('should pass if value is equal to min', () => {
      const result = assertNumberInRange(1, 1, 10)
      expect(result).toBeUndefined()
    })

    it('should pass if value is equal to max', () => {
      const result = assertNumberInRange(10, 1, 10)
      expect(result).toBeUndefined()
    })
  })
})

describe('fail', () => {
  it('should throw if value is less than min', () => {
    const shouldThrow = () => assertNumberInRange(0, 1, 10)
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_NUMBER_OUT_OF_RANGE',
      message: 'Number is not between 1 and 10.',
      context: { value: 0, min: 1, max: 10 },
    })
  })

  it('should throw if value is greater than max', () => {
    const shouldThrow = () => assertNumberInRange(11, 1, 10)
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_NUMBER_OUT_OF_RANGE',
      message: 'Number is not between 1 and 10.',
      context: { value: 11, min: 1, max: 10 },
    })
  })

  it('should throw if value is NaN', () => {
    const shouldThrow = () => assertNumberInRange(Number.NaN, 1, 10)
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_NOT_NUMBER',
      message: 'Value is not a number.',
      context: { value: Number.NaN, received: 'number' },
    })
  })

  it('should throw if value is not a number', () => {
    const shouldThrow = () => assertNumberInRange('5' as unknown, 1, 10)
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_NOT_NUMBER',
      message: 'Value is not a number.',
      context: { value: '5', received: 'string' },
    })
  })
})

describe('inference', () => {
  it('should predicate a number between min and max', () => {
    const value = 5 as unknown
    assertNumberInRange(value, 1, 10)
    expectTypeOf(value).toEqualTypeOf<number>()
  })
})
