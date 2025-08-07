import { createRandom, Random } from './createRandom'

describe('createRandom', () => {
  const SEED = 12345

  describe('createRandom function', () => {
    it('should create a Random instance with specified seed', () => {
      const random = createRandom(SEED)
      expect(random).toBeInstanceOf(Random)
      expect(random.seed).toStrictEqual(SEED)
    })
  })

  describe('Random class methods', () => {
    let random: Random

    beforeEach(() => {
      random = createRandom(SEED)
    })

    it('should generate consistent next() values', () => {
      const result = random.next()
      expect(result).toBeCloseTo(0.8339946273099581, 10)
    })

    it('should generate consistent integer() values', () => {
      const result = random.integer({ min: 0, max: 10 })
      expect(result).toStrictEqual(9)
    })

    it('should generate consistent uniform() values', () => {
      const result = random.uniform({ min: 0, max: 1 })
      expect(result).toBeCloseTo(0.8339946273099581, 10)
    })

    it('should generate consistent gaussian() values', () => {
      const result = random.gaussian({ mean: 0, standardDeviation: 1 })
      expect(result).toBeCloseTo(0.5703038522176481, 10)
    })

    it('should generate consistent exponential() values', () => {
      const result = random.exponential({ lambda: 1 })
      expect(result).toBeCloseTo(1.7957351255466865, 10)
    })

    it('should generate consistent gamma() values', () => {
      const result = random.gamma({ shape: 1, scale: 1 })
      expect(result).toBeCloseTo(1.249147273252184, 10)
    })

    it('should generate consistent beta() values', () => {
      const result = random.beta({ alpha: 1, beta: 1 })
      expect(result).toBeCloseTo(0.4254221230454038, 10)
    })

    it('should generate consistent chiSquared() values', () => {
      const result = random.chiSquared({ degreesOfFreedom: 1 })
      expect(result).toBeCloseTo(0.0005058832806602803, 10)
    })

    it('should generate consistent studentT() values', () => {
      const result = random.studentT({ degreesOfFreedom: 1 })
      expect(result).toBeCloseTo(0.2028902597490924, 10)
    })

    it('should generate consistent fDistribution() values', () => {
      const result = random.fDistribution({ d1: 1, d2: 1 })
      expect(result).toBeCloseTo(0.00020912803659934193, 10)
    })

    it('should generate consistent poisson() values', () => {
      const result = random.poisson({ lambda: 1 })
      expect(result).toStrictEqual(2)
    })

    it('should generate consistent binomial() values', () => {
      const result = random.binomial({ n: 10, p: 0.5 })
      expect(result).toStrictEqual(5)
    })

    it('should generate consistent geometric() values', () => {
      const result = random.geometric({ p: 0.5 })
      expect(result).toStrictEqual(3)
    })

    it('should generate consistent negativeBinomial() values', () => {
      const result = random.negativeBinomial({ r: 1, p: 0.5 })
      expect(result).toStrictEqual(0)
    })

    it('should generate consistent logNormal() values', () => {
      const result = random.logNormal({ mu: 0, sigma: 1 })
      expect(result).toBeCloseTo(1.768804424935638, 10)
    })

    it('should generate consistent weibull() values', () => {
      const result = random.weibull({ shape: 1, scale: 1 })
      expect(result).toBeCloseTo(1.7957351255466865, 10)
    })

    it('should generate consistent pareto() values', () => {
      const result = random.pareto({ scale: 1, shape: 1 })
      expect(result).toBeCloseTo(6.023901418342388, 10)
    })

    it('should generate consistent laplace() values', () => {
      const result = random.laplace({ location: 0, scale: 1 })
      expect(result).toBeCloseTo(1.1025879449867413, 10)
    })

    it('should generate consistent cauchy() values', () => {
      const result = random.cauchy({ location: 0, scale: 1 })
      expect(result).toBeCloseTo(1.7403908954331213, 10)
    })

    it('should generate consistent hypergeometric() values', () => {
      const result = random.hypergeometric({ populationSize: 50, successStates: 20, draws: 10 })
      expect(result).toStrictEqual(5)
    })

    it('should generate consistent gumbel() values', () => {
      const result = random.gumbel({ location: 0, scale: 1 })
      expect(result).toBeCloseTo(1.7063436114506039, 10)
    })

    it('should generate consistent rayleigh() values', () => {
      const result = random.rayleigh({ scale: 1 })
      expect(result).toBeCloseTo(0.6025418138495142, 10)
    })

    it('should generate consistent vonMises() values', () => {
      const result = random.vonMises({ mean: 0, concentration: 1 })
      expect(result).toBeCloseTo(-0.054809424300877894, 10)
    })

    it('should generate consistent zipf() values', () => {
      const result = random.zipf({ exponent: 2, maxValue: 100 })
      expect(result).toStrictEqual(4)
    })

    it('should generate consistent multinomial() values', () => {
      const result = random.multinomial({ trials: 10, probabilities: [0.3, 0.4, 0.3] })
      expect(result).toStrictEqual([3, 5, 2])
    })
  })

  describe('reproducibility', () => {
    it('should produce identical sequences with same seed', () => {
      const random1 = createRandom(SEED)
      const random2 = createRandom(SEED)
      const sequence1 = [
        random1.next(),
        random1.integer({ min: 0, max: 100 }),
        random1.uniform({ min: 0, max: 1 }),
        random1.gaussian({ mean: 0, standardDeviation: 1 }),
      ]
      const sequence2 = [
        random2.next(),
        random2.integer({ min: 0, max: 100 }),
        random2.uniform({ min: 0, max: 1 }),
        random2.gaussian({ mean: 0, standardDeviation: 1 }),
      ]
      expect(sequence1).toStrictEqual(sequence2)
    })

    it('should produce different sequences with different seeds', () => {
      const random1 = createRandom(SEED)
      const random2 = createRandom(SEED + 1)
      const value1 = random1.next()
      const value2 = random2.next()
      expect(value1).not.toEqual(value2)
    })
  })
})
