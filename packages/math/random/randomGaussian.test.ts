/* eslint-disable sonarjs/pseudo-random */
import type { RandomGaussianOptions } from './randomGaussian'
import { mean } from '../mean'
import { variance } from '../variance'
import { randomGaussian } from './randomGaussian'

function randomGaussianSimpleSamples(options: RandomGaussianOptions = {}): number[] {
  const samples: number[] = []
  let seed = Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomGaussian.call(seed, { ...options, onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

function randomGaussianBoxMullerSamples(options: RandomGaussianOptions = {}): number[] {
  const samples: number[] = []
  let seed = Math.random()
  let gaussianSpare: number | void = undefined
  for (let i = 0; i < 10000; i++) {
    const result = randomGaussian.call(seed, {
      ...options,
      gaussianSpare,
      onNextSeed: value => seed = value,
      onGaussianSpare: value => gaussianSpare = value,
    })
    samples.push(result)
  }
  return samples
}

const ALGORITHMS = [
  { name: 'Simple', randomSamples: randomGaussianSimpleSamples },
  { name: 'Box-Muller', randomSamples: randomGaussianBoxMullerSamples },
]

describe('randomGaussian', () => {
  describe('randomGaussian', () => {
    it('should generate a number following normal distribution', () => {
      const result = randomGaussian.call(12345)
      expect(result).toEqual(1.0887431614553482)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomGaussian.call(12345)
      const result2 = randomGaussian.call(12345)
      expect(result1).toStrictEqual(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomGaussian.call(12345)
      const result2 = randomGaussian.call(54321)
      expect(result1).not.toStrictEqual(result2)
    })

    it('should work with negative seed values', () => {
      const result = randomGaussian.call(-12345)
      expect(result).toEqual(0.440283855857016)
    })

    it('should work with zero seed', () => {
      const result = randomGaussian.call(0)
      expect(result).toEqual(0.0026803237025014334)
    })

    it('should work with Number.MAX_SAFE_INTEGER', () => {
      const result = randomGaussian.call(Number.MAX_SAFE_INTEGER)
      expect(result).toEqual(-0.3292445116519049)
    })

    it('should work with Number.MIN_SAFE_INTEGER', () => {
      const result = randomGaussian.call(Number.MIN_SAFE_INTEGER)
      expect(result).toEqual(-1.8396084948423201)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback during random generation', () => {
      const onNextSeed = vi.fn()
      randomGaussian.call(12345, { onNextSeed })
      expect(onNextSeed).toHaveBeenCalledTimes(1)
      expect(onNextSeed).toHaveBeenNthCalledWith(1, 1790989824)
    })

    it('should not call onNextSeed when using gaussianSpare', () => {
      const onNextSeed = vi.fn()
      randomGaussian.call(12345, { gaussianSpare: 1, onNextSeed })
      expect(onNextSeed).not.toHaveBeenCalled()
    })
  })

  describe('gaussianSpare', () => {
    it('should use spare value when provided', () => {
      const spareValue = 1.5
      const result = randomGaussian.call(12345, { gaussianSpare: spareValue })
      expect(result).toEqual(1.5)
    })

    it('should use spare value when provided with mean and standard deviation', () => {
      const spareValue = 1.5
      const result = randomGaussian.call(12345, { gaussianSpare: spareValue, mean: 5, standardDeviation: 2 })
      expect(result).toEqual(8)
    })

    it('should generate new value when no spare is provided', () => {
      const onGaussianSpare = vi.fn()
      randomGaussian.call(12345, { onGaussianSpare })
      expect(onGaussianSpare).toHaveBeenCalledTimes(1)
      expect(onGaussianSpare).toHaveBeenNthCalledWith(1, -1.8677926107482747)
    })

    it('should reset spare value after use', () => {
      const spareValue = 1.5
      const onGaussianSpare = vi.fn()
      randomGaussian.call(12345, { gaussianSpare: spareValue, onGaussianSpare })
      expect(onGaussianSpare).toHaveBeenCalledTimes(1)
      expect(onGaussianSpare).toHaveBeenNthCalledWith(1)
    })
  })

  for (const { name, randomSamples } of ALGORITHMS) {
    describe(`distribution using ${name} algorithm`, () => {
      it('should use default mean of 0 and standard deviation of 1', () => {
        const samples = randomSamples()
        const samplesMean = mean(...samples)
        expect(samplesMean).toBeCloseTo(0, 0)
      })

      it('should respect mean parameter of 5', () => {
        const samples = randomSamples({ mean: 5 })
        const samplesMean = mean(...samples)
        expect(samplesMean).toBeCloseTo(5, 0)
      })

      it('should respect standard deviation parameter of 10', () => {
        const samples = randomSamples({ standardDeviation: 10 })
        const samplesStandardDeviation = Math.sqrt(variance(...samples))
        expect(samplesStandardDeviation).toBeCloseTo(10, 0)
      })

      it('should work with mean of 10 and standard deviation of 5', () => {
        const samples = randomSamples({ mean: 10, standardDeviation: 5 })
        const samplesMean = mean(...samples)
        const samplesStandardDeviation = Math.sqrt(variance(...samples))
        expect(samplesMean).toBeCloseTo(10, 0)
        expect(samplesStandardDeviation).toBeCloseTo(5, 0)
      })

      it('should produce approximately normal distribution', () => {
        const samples = randomSamples()
        const samplesMean = mean(...samples)
        const samplesVariance = variance(...samples)
        const samplesStandardDeviation = Math.sqrt(samplesVariance)
        const samplesMin = Math.min(...samples)
        const samplesMax = Math.max(...samples)
        expect(samplesMin).toBeLessThan(-2)
        expect(samplesMax).toBeGreaterThan(2)
        expect(samplesMean).toBeCloseTo(0, 0)
        expect(samplesStandardDeviation).toBeCloseTo(1, 0)
      })

      /** @see https://en.wikipedia.org/wiki/68-95-99.7_rule */
      it('should approximately follow 68-95-99.7 rule', () => {
        const samples = randomSamples()
        const within1Sigma = samples.filter(x => Math.abs(x) <= 1).length / samples.length
        const within2Sigma = samples.filter(x => Math.abs(x) <= 2).length / samples.length
        const within3Sigma = samples.filter(x => Math.abs(x) <= 3).length / samples.length
        expect(within1Sigma).toBeCloseTo(0.68, 0.01)
        expect(within2Sigma).toBeCloseTo(0.95, 0.01)
        expect(within3Sigma).toBeCloseTo(0.997, 0.001)
      })
    })
  }

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomGaussian.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomGaussian.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })

    it('should handle edge case with very small uniform values', () => {
      // Test with a seed that might produce edge case values
      const result = randomGaussian.call(1)
      expect(typeof result).toStrictEqual('number')
      expect(Number.isFinite(result)).toStrictEqual(true)
    })

    it('should work with zero mean and standard deviation', () => {
      const result = randomGaussian.call(12345, { mean: 0, standardDeviation: 0 })
      expect(result).toStrictEqual(0) // Should be exactly 0 when stdDev is 0
    })

    it('should work with negative standard deviation', () => {
      const result = randomGaussian.call(12345, { standardDeviation: -1 })
      expect(result).toEqual(-1.0887431614553482)
    })
  })
})
