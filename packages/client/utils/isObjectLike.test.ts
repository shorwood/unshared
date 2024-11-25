import { isObjectLike } from './isObjectLike'

describe('isObjectLike', () => {
  it('should return true for an object', () => {
    const result = isObjectLike({})
    expect(result).toBe(true)
  })

  it('should return true for an object with properties', () => {
    const result = isObjectLike({ key: 'value' })
    expect(result).toBe(true)
  })

  it('should return false for null', () => {
    const result = isObjectLike(null)
    expect(result).toBe(false)
  })

  it('should return false for undefined', () => {
    const result = isObjectLike(undefined)
    expect(result).toBe(false)
  })

  it('should return false for a string', () => {
    const result = isObjectLike('string')
    expect(result).toBe(false)
  })

  it('should return false for a number', () => {
    const result = isObjectLike(123)
    expect(result).toBe(false)
  })

  it('should return false for a boolean', () => {
    const result = isObjectLike(true)
    expect(result).toBe(false)
  })

  it('should return false for an array', () => {
    const result = isObjectLike([])
    expect(result).toBe(false)
  })

  it('should return false for a function', () => {
    const result = isObjectLike(() => {})
    expect(result).toBe(false)
  })

  it('should infer a `Record<string, unknown>` type', () => {
    const value = {} as unknown
    const result = isObjectLike(value)
    if (result) expectTypeOf(value).toEqualTypeOf<Record<string, unknown>>()
  })
})
