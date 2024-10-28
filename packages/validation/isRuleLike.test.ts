import { isRuleLike } from './isRuleLike'

describe('isRuleLike', () => {
  test('should return true if value is a rule', () => {
    const rule = (value: any) => value > 0
    const result = isRuleLike(rule)
    expect(result).toBe(true)
  })

  test('should return false if value is not a rule', () => {
    const result = isRuleLike(5)
    expect(result).toBe(false)
  })
})
