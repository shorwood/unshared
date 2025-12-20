import { lerp } from './lerp'

describe('lerp', () => {
  it('should return the starting value when factor is 0', () => {
    const result = lerp(0, 10, 0)
    expect(result).toBe(0)
  })

  it('should return the starting value when factor is 0 with negative start', () => {
    const result = lerp(-5, 5, 0)
    expect(result).toBe(-5)
  })

  it('should return the ending value when factor is 1', () => {
    const result = lerp(0, 10, 1)
    expect(result).toBe(10)
  })

  it('should return the ending value when factor is 1 with negative start', () => {
    const result = lerp(-5, 5, 1)
    expect(result).toBe(5)
  })

  it('should return the midpoint when factor is 0.5', () => {
    const result = lerp(0, 10, 0.5)
    expect(result).toBe(5)
  })

  it('should return zero as midpoint between -5 and 5', () => {
    const result = lerp(-5, 5, 0.5)
    expect(result).toBe(0)
  })

  it('should interpolate correctly with factor 0.2', () => {
    const result = lerp(0, 10, 0.2)
    expect(result).toBe(2)
  })

  it('should interpolate correctly with factor 0.8', () => {
    const result = lerp(0, 10, 0.8)
    expect(result).toBe(8)
  })

  it('should interpolate correctly with negative range and factor 0.2', () => {
    const result = lerp(-5, 5, 0.2)
    expect(result).toBe(-3)
  })

  it('should handle reversed range (from > to)', () => {
    const result = lerp(10, 0, 0.5)
    expect(result).toBe(5)
  })

  it('should handle interpolation to negative values', () => {
    const result = lerp(0, -10, 0.2)
    expect(result).toBe(-2)
  })

  it('should extrapolate when factor is greater than 1', () => {
    const result = lerp(0, 10, 1.5)
    expect(result).toBe(15)
  })

  it('should extrapolate when factor is negative', () => {
    const result = lerp(0, 10, -0.5)
    expect(result).toBe(-5)
  })

  it('should return the same value when from equals to', () => {
    const result = lerp(5, 5, 0.5)
    expect(result).toBe(5)
  })

  it('should handle decimal input values', () => {
    const result = lerp(0.5, 1.5, 0.5)
    expect(result).toBe(1)
  })

  it('should handle small decimal values with precision', () => {
    const result = lerp(0.1, 0.9, 0.5)
    expect(result).toBeCloseTo(0.5)
  })

  it('should interpolate decimal values correctly', () => {
    const result = lerp(1.25, 3.75, 0.4)
    expect(result).toBeCloseTo(2.25)
  })
})
