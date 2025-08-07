/* eslint-disable sonarjs/pseudo-random */
import { mean } from '../mean'
import { randomLcgNext } from './randomLcgNext'

function randomLcgNextSamples(this: number | void): number[] {
  const samples: number[] = []
  let seed = this ?? Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomLcgNext.call(seed, { onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

describe('randomLcgNext', () => {
  describe('randomLcgNext', () => {
    it('should generate a number between 0 and 1 with no seed', () => {
      const result = randomLcgNext()
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should generate a number between 0 and 1 with given seed', () => {
      const result = randomLcgNext.call(12345)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomLcgNext.call(12345)
      const result2 = randomLcgNext.call(12345)
      expect(result1).toStrictEqual(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomLcgNext.call(12345)
      const result2 = randomLcgNext.call(54321)
      expect(result1).not.toStrictEqual(result2)
    })

    it('should work with negative seed values', () => {
      const result = randomLcgNext.call(-12345)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should work with Number.MAX_SAFE_INTEGER', () => {
      const result = randomLcgNext.call(Number.MAX_SAFE_INTEGER)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should work with Number.MIN_SAFE_INTEGER', () => {
      const result = randomLcgNext.call(Number.MIN_SAFE_INTEGER)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should work with zero seed', () => {
      const result = randomLcgNext.call(0)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback with the next seed value', () => {
      const onNextSeed = vi.fn()
      randomLcgNext.call(12345, { onNextSeed })
      expect(onNextSeed).toHaveBeenCalledTimes(1)
      expect(onNextSeed).toHaveBeenNthCalledWith(1, 207482415)
    })

    it('should produce consistent sequence with seed advancement', () => {
      const samples = randomLcgNextSamples.call(12345).slice(0, 3)
      expect(samples).toStrictEqual([0.09661652808693845, 0.8339946273099581, 0.9477024976608367])
    })
  })

  describe('distribution', () => {
    it('should produce approximately uniform distribution', () => {
      const samples = randomLcgNextSamples()
      const samplesMean = mean(...samples)
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)
      expect(samplesMean).toBeCloseTo(0.5, 1)
      expect(samplesMax).toBeLessThan(1)
      expect(samplesMin).toBeGreaterThanOrEqual(0)
    })
  })

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomLcgNext.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomLcgNext.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })
  })
})
