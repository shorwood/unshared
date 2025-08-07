/* eslint-disable sonarjs/pseudo-random */
import type { RandomIntegerOptions } from './randomInteger'
import { mean } from '../mean'
import { randomInteger } from './randomInteger'

function randomIntegerSamples(this: number | void, options: RandomIntegerOptions = {}): number[] {
  const samples: number[] = []
  let seed = this ?? Math.random()
  for (let i = 0; i < 10000; i++) {
    const result = randomInteger.call(seed, { ...options, onNextSeed: value => seed = value })
    samples.push(result)
  }
  return samples
}

describe('randomInteger', () => {
  describe('randomInteger', () => {
    it('should generate an integer in the default range', () => {
      const result = randomInteger.call(12345)
      expect(Number.isInteger(result)).toStrictEqual(true)
      expect(result).toEqual(870244319780334)
    })

    it('should generate deterministic results with same seed', () => {
      const result1 = randomInteger.call(12345, { min: 0, max: 10 })
      const result2 = randomInteger.call(12345, { min: 0, max: 10 })
      expect(result1).toStrictEqual(result2)
    })

    it('should generate different results with different seeds', () => {
      const result1 = randomInteger.call(12345, { min: 0, max: 10 })
      const result2 = randomInteger.call(54321, { min: 0, max: 10 })
      expect(result1).not.toStrictEqual(result2)
    })
  })

  describe('seed', () => {
    it('should call onNextSeed callback during random generation', () => {
      const onNextSeed = vi.fn()
      randomInteger.call(12345, { min: 0, max: 10, onNextSeed })
      expect(onNextSeed).toHaveBeenCalledTimes(1)
      expect(onNextSeed).toHaveBeenNthCalledWith(1, 207482415)
    })

    it('should produce consistent sequence with seed advancement', () => {
      const samples = randomIntegerSamples.call(12345, { min: 0, max: 10 }).slice(0, 3)
      expect(samples).toEqual([1, 9, 10])
    })
  })

  describe('distribution', () => {
    it('should have appropriate mean for given range', () => {
      const samples = randomIntegerSamples({ min: 10, max: 20 })
      const samplesMean = mean(...samples)
      const samplesMin = Math.min(...samples)
      const samplesMax = Math.max(...samples)
      expect(samplesMean).toBeCloseTo(15, 0)
      expect(samplesMin).toBeGreaterThanOrEqual(10)
      expect(samplesMax).toBeLessThanOrEqual(20)
    })

    it('should cover the full range eventually', () => {
      const samples = randomIntegerSamples({ min: 0, max: 5 })
      const uniqueValues = new Set(samples)
      expect(uniqueValues.size).toStrictEqual(6) // Should see all values 0-5
    })

  })

  describe('edge cases', () => {
    it('should throw TypeError when not called with a number context', () => {
      // @ts-expect-error: ignore type error for testing
      const shouldThrow = () => randomInteger.call('12345')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a number as the context (this) value.')
    })

    it('should throw TypeError when called with non-finite number', () => {
      const shouldThrow = () => randomInteger.call(Number.NaN)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('You must call randomLcgNext with a finite number as the context (this) value.')
    })

    it('should throw TypeError when min is not an integer', () => {
      const shouldThrow = () => randomInteger.call(12345, { min: 1.5, max: 10 })
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('min must be an integer')
    })

    it('should throw TypeError when max is not an integer', () => {
      const shouldThrow = () => randomInteger.call(12345, { min: 0, max: 10.5 })
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('max must be an integer')
    })
  })
})
