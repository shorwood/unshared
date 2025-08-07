/* eslint-disable sonarjs/pseudo-random */
import type { RandomExponentialOptions } from './randomExponential'
import { mean } from '../mean'
import { variance } from '../variance'
import { randomExponential } from './randomExponential'

function randomExponentialSamples(this: number | void, options: RandomExponentialOptions = {}): number[] {
  const samples: number[] = []
  let seed = this ?? Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomExponential.call(seed, { ...options, onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

describe('randomExponential', () => {
  describe('randomExponential', () => {
    it('should generate a number following exponential distribution', () => {
      const result = randomExponential.call(12345)
      expect(result).toEqual(0.10160815135398933)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomExponential.call(12345, { lambda: 2 })
      const result2 = randomExponential.call(12345, { lambda: 2 })
      expect(result1).toStrictEqual(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomExponential.call(12345, { lambda: 1 })
      const result2 = randomExponential.call(54321, { lambda: 1 })
      expect(result1).not.toStrictEqual(result2)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback during random generation', () => {
      const onNextSeed = vi.fn()
      randomExponential.call(12345, { lambda: 1, onNextSeed })
      expect(onNextSeed).toHaveBeenCalledTimes(1)
      expect(onNextSeed).toHaveBeenNthCalledWith(1, 207482415)
    })

    it('should produce consistent sequence with seed advancement', () => {
      const samples = randomExponentialSamples.call(12345, { lambda: 1 }).slice(0, 3)
      expect(samples).toEqual([0.10160815135398933, 1.7957351255466865, 2.9508066654729856])
    })
  })

  describe('distribution', () => {
    it('should have appropriate mean for lambda = 1', () => {
      const samples = randomExponentialSamples({ lambda: 1 })
      const samplesMean = mean(...samples)
      // For exponential distribution, mean = 1/lambda
      expect(samplesMean).toBeCloseTo(1, 0)
    })

    it('should have appropriate mean for lambda = 2', () => {
      const samples = randomExponentialSamples({ lambda: 2 })
      const samplesMean = mean(...samples)
      // For exponential distribution, mean = 1/lambda
      expect(samplesMean).toBeCloseTo(0.5, 0)
    })

    it('should have appropriate variance for lambda = 1', () => {
      const samples = randomExponentialSamples({ lambda: 1 })
      const samplesVariance = variance(...samples)
      // For exponential distribution, variance = 1/lambda^2
      expect(samplesVariance).toBeCloseTo(1, 0)
    })

    it('should have appropriate variance for lambda = 2', () => {
      const samples = randomExponentialSamples({ lambda: 2 })
      const samplesVariance = variance(...samples)
      // For exponential distribution, variance = 1/lambda^2
      expect(samplesVariance).toBeCloseTo(0.25, 0)
    })

    it('should produce only positive values', () => {
      const samples = randomExponentialSamples({ lambda: 1 })
      expect(samples.every(sample => sample > 0)).toBe(true)
    })

    it('should have decreasing probability density', () => {
      const samples = randomExponentialSamples({ lambda: 1 })
      // Count values in different ranges to verify decreasing density
      const range1 = samples.filter(x => x >= 0 && x < 1).length
      const range2 = samples.filter(x => x >= 1 && x < 2).length
      const range3 = samples.filter(x => x >= 2 && x < 3).length
      // Each subsequent range should have fewer samples due to exponential decay
      expect(range1).toBeGreaterThan(range2)
      expect(range2).toBeGreaterThan(range3)
    })
  })

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomExponential.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomExponential.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })

    it('should throw Error when lambda is zero', () => {
      const shouldThrow = () => randomExponential.call(12345, { lambda: 0 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Lambda must be greater than 0')
    })

    it('should throw Error when lambda is negative', () => {
      const shouldThrow = () => randomExponential.call(12345, { lambda: -1 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Lambda must be greater than 0')
    })

    it('should work with very small lambda values', () => {
      const result = randomExponential.call(12345, { lambda: 0.001 })
      expect(result).toBeGreaterThan(0)
      expect(Number.isFinite(result)).toBe(true)
    })

    it('should work with very large lambda values', () => {
      const result = randomExponential.call(12345, { lambda: 1000 })
      expect(result).toBeGreaterThan(0)
      expect(Number.isFinite(result)).toBe(true)
    })
  })
})
