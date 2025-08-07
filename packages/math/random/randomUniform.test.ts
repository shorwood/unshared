/* eslint-disable sonarjs/pseudo-random */
import type { RandomUniformOptions } from './randomUniform'
import { mean } from '../mean'
import { randomUniform } from './randomUniform'

function randomUniformSamples(this: number | void, options: RandomUniformOptions = {}): number[] {
  const samples: number[] = []
  let seed = this ?? Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomUniform.call(seed, { ...options, onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

describe('randomUniform', () => {
  describe('randomUniform', () => {
    it('should generate a number in the default range', () => {
      const result = randomUniform.call(12345)
      expect(result).toEqual(0.09661652808693845)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomUniform.call(12345, { min: 0, max: 10 })
      const result2 = randomUniform.call(12345, { min: 0, max: 10 })
      expect(result1).toBe(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomUniform.call(12345, { min: 0, max: 10 })
      const result2 = randomUniform.call(54321, { min: 0, max: 10 })
      expect(result1).not.toBe(result2)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback during random generation', () => {
      const onNextSeed = vi.fn()
      randomUniform.call(12345, { min: 0, max: 10, onNextSeed })
      expect(onNextSeed).toHaveBeenCalledTimes(1)
      expect(onNextSeed).toHaveBeenNthCalledWith(1, 207482415)
    })

    it('should produce consistent sequence with seed advancement', () => {
      const samples = randomUniformSamples.call(12345, { min: 0, max: 1 }).slice(0, 3)
      expect(samples).toEqual([0.09661652808693845, 0.8339946273099581, 0.9477024976608367])
    })
  })

  describe('distribution', () => {
    it('should have appropriate mean for given range', () => {
      const samples = randomUniformSamples({ min: 10, max: 20 })
      const samplesMean = mean(...samples)
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)
      expect(samplesMean).toBeCloseTo(15, 0)
      expect(samplesMin).toBeGreaterThanOrEqual(10)
      expect(samplesMax).toBeLessThanOrEqual(20)
    })

    it('should work with fractional ranges', () => {
      const samples = randomUniformSamples({ min: 0.5, max: 1.5 })
      const samplesMean = mean(...samples)
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)
      expect(samplesMean).toBeCloseTo(1, 1)
      expect(samplesMin).toBeGreaterThanOrEqual(0.5)
      expect(samplesMax).toBeLessThanOrEqual(1.5)
    })

    it('should with with mixed negative and positive ranges', () => {
      const samples = randomUniformSamples({ min: -10, max: 10 })
      const samplesMean = mean(...samples)
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)
      expect(samplesMean).toBeCloseTo(0, 0)
      expect(samplesMin).toBeGreaterThanOrEqual(-10)
      expect(samplesMax).toBeLessThanOrEqual(10)
    })

    it('should work with zero-width ranges', () => {
      const samples = randomUniformSamples({ min: 42, max: 42 })
      expect(samples.every(sample => sample === 42)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomUniform.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomUniform.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })

    it('should handle very small ranges', () => {
      const result = randomUniform.call(12345, { min: 0, max: Number.MIN_VALUE })
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(Number.MIN_VALUE)
    })

    it('should handle reversed min/max gracefully', () => {
      const result = randomUniform.call(12345, { min: 10, max: 5 })
      // With min > max, the result should be between max and min
      expect(result).toBeGreaterThanOrEqual(5)
      expect(result).toBeLessThan(10)
    })
  })
})
