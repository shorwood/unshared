/* eslint-disable sonarjs/pseudo-random */
import type { RandomGammaOptions } from './randomGamma'
import { mean } from '../mean'
import { variance } from '../variance'
import { randomGamma } from './randomGamma'

function randomGammaSamples(this: number | void, options: RandomGammaOptions = {}): number[] {
  const samples: number[] = []
  let seed = this ?? Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomGamma.call(seed, { ...options, onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

describe('randomGamma', () => {
  describe('randomGamma', () => {
    it('should generate a number following gamma distribution with default parameters', () => {
      const result = randomGamma.call(12345)
      expect(result).toEqual(2.009283029730199)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomGamma.call(12345, { shape: 2, scale: 3 })
      const result2 = randomGamma.call(12345, { shape: 2, scale: 3 })
      expect(result1).toStrictEqual(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomGamma.call(12345, { shape: 2, scale: 3 })
      const result2 = randomGamma.call(54321, { shape: 2, scale: 3 })
      expect(result1).not.toStrictEqual(result2)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback during random generation', () => {
      const onNextSeed = vi.fn()
      randomGamma.call(12345, { shape: 2, scale: 1, onNextSeed })
      expect(onNextSeed).toHaveBeenCalled()
    })

    it('should produce consistent sequence with seed advancement', () => {
      const samples = randomGammaSamples.call(12345, { shape: 2, scale: 1 }).slice(0, 2)
      expect(samples[0]).toEqual(3.504373014388453)
      expect(samples[1]).toEqual(7.683815076037107)
    })
  })

  describe('shape', () => {
    it('should handle shape < 1 (uses transformation method)', () => {
      const result = randomGamma.call(12345, { shape: 0.5, scale: 1 })
      expect(result).toEqual(0.0035812167343146507)
    })

    it('should handle shape = 1 (exponential distribution)', () => {
      const result = randomGamma.call(12345, { shape: 1, scale: 1 })
      expect(result).toEqual(2.009283029730199)
    })

    it('should handle shape > 1 (uses Marsaglia-Tsang method)', () => {
      const result = randomGamma.call(12345, { shape: 2, scale: 1 })
      expect(result).toEqual(3.504373014388453)
    })

    it('should handle large shape values', () => {
      const result = randomGamma.call(12345, { shape: 10, scale: 1 })
      expect(result).toEqual(13.462200827366585)
    })
  })

  describe('scale', () => {
    it('should scale the result appropriately', () => {
      const result1 = randomGamma.call(12345, { shape: 2, scale: 1 })
      const result2 = randomGamma.call(12345, { shape: 2, scale: 2 })
      expect(result2).toBeCloseTo(result1 * 2, 10)
    })

    it('should work with fractional scale values', () => {
      const result = randomGamma.call(12345, { shape: 2, scale: 0.5 })
      expect(typeof result).toStrictEqual('number')
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('distribution', () => {
    it('should have appropriate mean and variance for shape=2, scale=1.5', () => {
      const samples = randomGammaSamples({ shape: 2, scale: 1.5 })
      const samplesMean = mean(...samples)
      const samplesVariance = variance(...samples)
      // For gamma distribution: mean = shape * scale, variance = shape * scale^2
      expect(samplesMean).toBeCloseTo(2 * 1.5, 0)
      expect(samplesVariance).toBeCloseTo(2 * 1.5 * 1.5, 0)
    })

    it('should have appropriate mean and variance for shape=0.5, scale=2', () => {
      const samples = randomGammaSamples({ shape: 0.5, scale: 2 })
      const samplesMean = mean(...samples)
      const samplesVariance = variance(...samples)
      // For gamma distribution: mean = shape * scale, variance = shape * scale^2
      expect(samplesMean).toBeCloseTo(0.5 * 2, 0)
      expect(samplesVariance).toBeCloseTo(0.5 * 2 * 2, 0)
    })

    it('should have appropriate mean and variance for shape=5, scale=0.5', () => {
      const samples = randomGammaSamples({ shape: 5, scale: 0.5 })
      const samplesMean = mean(...samples)
      const samplesVariance = variance(...samples)
      // For gamma distribution: mean = shape * scale, variance = shape * scale^2
      expect(samplesMean).toBeCloseTo(5 * 0.5, 0)
      expect(samplesVariance).toBeCloseTo(5 * 0.5 * 0.5, 0)
    })

    it('should produce positive values only', () => {
      const samples = randomGammaSamples({ shape: 1, scale: 1 }).slice(0, 100)
      expect(samples.every(sample => sample > 0)).toBe(true)
    })

    it('should have appropriate shape characteristics', () => {
      const samples = randomGammaSamples({ shape: 1, scale: 1 })
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)

      // Gamma distribution should have a long right tail
      expect(samplesMin).toBeGreaterThan(0)
      expect(samplesMax).toBeGreaterThan(5) // Should have some large values in the tail
    })
  })

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomGamma.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomGamma.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })

    it('should throw Error when shape <= 0', () => {
      const shouldThrow = () => randomGamma.call(12345, { shape: 0 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Shape and scale parameters must be greater than 0')
    })

    it('should throw Error when shape < 0', () => {
      const shouldThrow = () => randomGamma.call(12345, { shape: -1 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Shape and scale parameters must be greater than 0')
    })

    it('should throw Error when scale <= 0', () => {
      const shouldThrow = () => randomGamma.call(12345, { scale: 0 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Shape and scale parameters must be greater than 0')
    })

    it('should throw Error when scale < 0', () => {
      const shouldThrow = () => randomGamma.call(12345, { scale: -1 })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Shape and scale parameters must be greater than 0')
    })

    it('should handle very small shape values', () => {
      const result = randomGamma.call(12345, { shape: 0.1, scale: 1 })
      expect(typeof result).toStrictEqual('number')
      expect(result).toBeGreaterThan(0)
      expect(Number.isFinite(result)).toStrictEqual(true)
    })

    it('should handle very small scale values', () => {
      const result = randomGamma.call(12345, { shape: 2, scale: 0.001 })
      expect(typeof result).toStrictEqual('number')
      expect(result).toBeGreaterThan(0)
      expect(Number.isFinite(result)).toStrictEqual(true)
    })

    it('should handle edge cases in Marsaglia-Tsang algorithm', () => {
      // Test with various seeds to potentially trigger edge cases in the algorithm
      const seeds = [1, 2, 3, 100, 1000, 10000]
      for (const seed of seeds) {
        const result = randomGamma.call(seed, { shape: 2, scale: 1 })
        expect(typeof result).toStrictEqual('number')
        expect(result).toBeGreaterThan(0)
        expect(Number.isFinite(result)).toStrictEqual(true)
      }
    })
  })
})
