/* eslint-disable sonarjs/pseudo-random */
import type { RandomBetaOptions } from './randomBeta'
import type { RandomBinomialOptions } from './randomBinomial'
import type { RandomCauchyOptions } from './randomCauchy'
import type { RandomChiSquaredOptions } from './randomChiSquared'
import type { RandomExponentialOptions } from './randomExponential'
import type { RandomFDistributionOptions } from './randomFDistribution'
import type { RandomGammaOptions } from './randomGamma'
import type { RandomGaussianOptions } from './randomGaussian'
import type { RandomGeometricOptions } from './randomGeometric'
import type { RandomGumbelOptions } from './randomGumbel'
import type { RandomHypergeometricOptions } from './randomHypergeometric'
import type { RandomIntegerOptions } from './randomInteger'
import type { RandomLaplaceOptions } from './randomLaplace'
import type { RandomLogNormalOptions } from './randomLogNormal'
import type { RandomMultinomialOptions } from './randomMultinomial'
import type { RandomNegativeBinomialOptions } from './randomNegativeBinomial'
import type { RandomParetoOptions } from './randomPareto'
import type { RandomPoissonOptions } from './randomPoisson'
import type { RandomRayleighOptions } from './randomRayleigh'
import type { RandomStudentTOptions } from './randomStudentT'
import type { RandomUniformOptions } from './randomUniform'
import type { RandomVonMisesOptions } from './randomVonMises'
import type { RandomWeibullOptions } from './randomWeibull'
import type { RandomZipfOptions } from './randomZipf'
import { randomBeta } from './randomBeta'
import { randomBinomial } from './randomBinomial'
import { randomCauchy } from './randomCauchy'
import { randomChiSquared } from './randomChiSquared'
import { randomExponential } from './randomExponential'
import { randomFDistribution } from './randomFDistribution'
import { randomGamma } from './randomGamma'
import { randomGaussian } from './randomGaussian'
import { randomGeometric } from './randomGeometric'
import { randomGumbel } from './randomGumbel'
import { randomHypergeometric } from './randomHypergeometric'
import { randomInteger } from './randomInteger'
import { randomLaplace } from './randomLaplace'
import { randomLcgNext } from './randomLcgNext'
import { randomLogNormal } from './randomLogNormal'
import { randomMultinomial } from './randomMultinomial'
import { randomNegativeBinomial } from './randomNegativeBinomial'
import { randomPareto } from './randomPareto'
import { randomPoisson } from './randomPoisson'
import { randomRayleigh } from './randomRayleigh'
import { randomStudentT } from './randomStudentT'
import { randomUniform } from './randomUniform'
import { randomVonMises } from './randomVonMises'
import { randomWeibull } from './randomWeibull'
import { randomZipf } from './randomZipf'

/**
 * The `Random` class provides methods to generate seeded pseudo-random numbers
 * using various statistical distributions and algorithms. This class is useful for simulations,
 * statistical modeling, and any application requiring reproducible random number generation.
 *
 * Each method generates a random number based on the specified distribution and options.
 * The `onNextSeed` callback can be used to track the internal state of the random number generator,
 * allowing for reproducibility and control over the sequence of generated numbers.
 *
 * @example
 * const random = createRandom(12345);
 *
 * // Generate a random integer between 1 and 10
 * const randomInt = random.integer({ min: 1, max: 10 });
 *
 * // Generate a random number with uniform distribution between 0 and 1
 * const randomUniform = random.uniform();
 *
 * // Generate a random number with Gaussian distribution
 * const randomGaussian = random.gaussian({ mean: 0, standardDeviation: 1 });
 */
export class Random {
  constructor(public seed = Math.random()) {
    this.internalSeed = this.seed
    this.next() // Initialize the internal seed
  }

  /** The internal value of the seed as it is used in calculations. */
  private internalSeed = 0

  /**
   * Generate a pseudo-random number between 0 (inclusive) and 1 (exclusive).
   * This is the fundamental uniform random number generator used by all distribution functions.
   *
   * @returns A pseudo-random number between 0 and 1.
   * @example
   * const random = createRandom(12345);
   * const value = random.next(); // 0.09661652808693845
   */
  next(): number {
    return randomLcgNext.call(this.internalSeed, {
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer within a specified range (both bounds inclusive).
   * Uses the underlying uniform distribution to produce integers with equal probability.
   *
   * @param options Options for the integer generation.
   * @returns A random integer between min and max (both inclusive).
   * @example
   * const random = createRandom(12345);
   * const value = random.integer({ min: 1, max: 6 }); // 1
   * const largeValue = random.integer({ min: 100, max: 999 }); // 206
   */
  integer(options: RandomIntegerOptions = {}): number {
    return randomInteger.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a uniform distribution within a specified range.
   * The uniform distribution assigns equal probability density to all values in the range.
   *
   * @param options Options for the uniform distribution.
   * @returns A random number between min (inclusive) and max (exclusive).
   * @example
   * const random = createRandom(12345);
   * const value = random.uniform({ min: 0, max: 1 }); // 0.09661652808693845
   * const scaled = random.uniform({ min: 10, max: 20 }); // 10.966165280869384
   */
  uniform(options: RandomUniformOptions = {}): number {
    return randomUniform.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /** Spare Gaussian value for Box-Muller transform. */
  private gaussianSpare: number | void = undefined

  /**
   * Generate a random number from a Gaussian (normal) distribution.
   * Uses the Box-Muller transform to produce normally distributed values with specified mean and standard deviation.
   *
   * @param options Options for the Gaussian distribution.
   * @returns A random number from the normal distribution.
   * @example
   * const random = createRandom(12345);
   * const standard = random.gaussian(); // 0.0887431614553482 (mean=0, std=1)
   * const scaled = random.gaussian({ mean: 10, standardDeviation: 2 }); // 10.177486322910696
   */
  gaussian(options: RandomGaussianOptions = {}): number {
    return randomGaussian.call(this.internalSeed, {
      ...options,
      gaussianSpare: this.gaussianSpare,
      onNextSeed: value => this.internalSeed = value,
      onGaussianSpare: value => this.gaussianSpare = value,
    })
  }

  /**
   * Generate a random number from an exponential distribution.
   * Uses inverse transform sampling with the given rate parameter λ (lambda).
   *
   * @param options Options for the exponential distribution.
   * @returns A random number from the exponential distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const value = random.exponential({ lambda: 1 }); // 0.10186721353963925
   * const scaled = random.exponential({ lambda: 0.5 }); // 0.20373442707927851
   */
  exponential(options: RandomExponentialOptions = {}): number {
    return randomExponential.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a gamma distribution.
   * Uses the Marsaglia and Tsang method for shape ≥ 1, and a transformation method for shape < 1.
   *
   * @param options Options for the gamma distribution.
   * @returns A random number from the gamma distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const value = random.gamma({ shape: 1, scale: 1 }); // 0.10186721353963925
   * const shaped = random.gamma({ shape: 2, scale: 3 }); // 4.103797381480551
   */
  gamma(options: RandomGammaOptions = {}): number {
    return randomGamma.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a beta distribution.
   * Uses the ratio-of-gammas method to produce values between 0 and 1 with specified shape parameters.
   *
   * @param options Options for the beta distribution.
   * @returns A random number from the beta distribution (between 0 and 1).
   * @example
   * const random = createRandom(12345);
   * const value = random.beta({ alpha: 1, beta: 1 }); // 0.09661652808693845 (uniform)
   * const skewed = random.beta({ alpha: 2, beta: 5 }); // 0.123... (right-skewed)
   */
  beta(options: RandomBetaOptions = {}): number {
    return randomBeta.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a chi-squared distribution.
   * Implemented as a scaled gamma distribution with shape = degreesOfFreedom/2 and scale = 2.
   *
   * @param options Options for the chi-squared distribution.
   * @returns A random number from the chi-squared distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const value = random.chiSquared({ degreesOfFreedom: 1 }); // 0.203...
   * const higherDf = random.chiSquared({ degreesOfFreedom: 5 }); // 8.207...
   */
  chiSquared(options: RandomChiSquaredOptions = {}): number {
    return randomChiSquared.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from Student's t-distribution.
   * Computed as the ratio of a standard normal to the square root of a scaled chi-squared variable.
   *
   * @param options Options for the t-distribution.
   * @returns A random number from the t-distribution.
   * @example
   * const random = createRandom(12345);
   * const value = random.studentT({ degreesOfFreedom: 1 }); // 0.275... (Cauchy-like)
   * const moreDf = random.studentT({ degreesOfFreedom: 30 }); // 0.088... (normal-like)
   */
  studentT(options: RandomStudentTOptions = {}): number {
    return randomStudentT.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from an F-distribution.
   * Computed as the ratio of two scaled chi-squared random variables.
   *
   * @param options Options for the F-distribution.
   * @returns A random number from the F-distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const value = random.fDistribution({ d1: 1, d2: 1 }); // 0.156...
   * const ratio = random.fDistribution({ d1: 5, d2: 10 }); // 1.234...
   */
  fDistribution(options: RandomFDistributionOptions = {}): number {
    return randomFDistribution.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a Poisson distribution.
   * Uses Knuth's algorithm for small λ values and normal approximation for large λ values.
   *
   * @param options Options for the Poisson distribution.
   * @returns A random integer from the Poisson distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const events = random.poisson({ lambda: 1 }); // 2
   * const moreEvents = random.poisson({ lambda: 5 }); // 4
   */
  poisson(options: RandomPoissonOptions = {}): number {
    return randomPoisson.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a binomial distribution.
   * Uses direct simulation for small n and normal approximation for large n.
   *
   * @param options Options for the binomial distribution.
   * @returns A random integer from the binomial distribution (0 to n).
   * @example
   * const random = createRandom(12345);
   * const successes = random.binomial({ n: 10, p: 0.5 }); // 5
   * const moreTrial = random.binomial({ n: 100, p: 0.3 }); // ~30
   */
  binomial(options: RandomBinomialOptions = {}): number {
    return randomBinomial.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a geometric distribution.
   * Uses inverse transform sampling to model the number of trials until first success.
   *
   * @param options Options for the geometric distribution.
   * @returns A random integer from the geometric distribution (≥ 1).
   * @example
   * const random = createRandom(12345);
   * const trials = random.geometric({ p: 0.5 }); // 1
   * const moreTrial = random.geometric({ p: 0.1 }); // 7
   */
  geometric(options: RandomGeometricOptions = {}): number {
    return randomGeometric.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a negative binomial distribution.
   * Models the number of failures before achieving r successes.
   * Used for overdispersed count data, customer churn modeling, and epidemiology.
   *
   * @param options Options for the negative binomial distribution.
   * @returns A random integer from the negative binomial distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   *
   * // Failures before 3 sales (30% success rate)
   * const failures = random.negativeBinomial({ r: 3, p: 0.3 });
   *
   * // Patients to screen before finding 5 with condition (10% prevalence)
   * const screeningFailures = random.negativeBinomial({ r: 5, p: 0.1 });
   *
   * // Failed login attempts before 2 successes
   * const failedLogins = random.negativeBinomial({ r: 2, p: 0.8 });
   */
  negativeBinomial(options: RandomNegativeBinomialOptions = {}): number {
    return randomNegativeBinomial.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a log-normal distribution.
   * Models variables that are the product of many small factors (e.g., income, stock prices, file sizes).
   * Always positive with a right-skewed distribution - common in finance and biology.
   *
   * @param options Options for the log-normal distribution.
   * @returns A random number from the log-normal distribution (> 0).
   * @example
   * const random = createRandom(12345);
   *
   * // Stock price modeling (μ=0, σ=0.2 for 20% volatility)
   * const stockPrice = random.logNormal({ mu: 0, sigma: 0.2 }) * 100;
   *
   * // Income distribution (μ=10.5, σ=0.5)
   * const income = random.logNormal({ mu: 10.5, sigma: 0.5 });
   *
   * // File size distribution (μ=8, σ=2)
   * const fileSize = random.logNormal({ mu: 8, sigma: 2 }); // bytes
   *
   * // Project duration with uncertainty
   * const duration = random.logNormal({ mu: 2, sigma: 0.3 }); // weeks
   */
  logNormal(options: RandomLogNormalOptions = {}): number {
    return randomLogNormal.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Weibull distribution.
   * Uses inverse transform sampling with specified shape and scale parameters.
   *
   * @param options Options for the Weibull distribution.
   * @returns A random number from the Weibull distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   * const value = random.weibull({ shape: 1, scale: 1 }); // 0.10186721353963925 (exponential)
   * const shaped = random.weibull({ shape: 2, scale: 1000 }); // 319.5... (Rayleigh-like)
   */
  weibull(options: RandomWeibullOptions = {}): number {
    return randomWeibull.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Pareto distribution.
   * Uses inverse transform sampling to produce power-law distributed values.
   *
   * @param options Options for the Pareto distribution.
   * @returns A random number from the Pareto distribution (≥ scale).
   * @example
   * const random = createRandom(12345);
   * const value = random.pareto({ scale: 1, shape: 1 }); // 10.34... (heavy tail)
   * const bounded = random.pareto({ scale: 10, shape: 2 }); // 13.45...
   */
  pareto(options: RandomParetoOptions = {}): number {
    return randomPareto.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Laplace (double exponential) distribution.
   * Models the difference between two independent exponential variables. Has heavier tails than normal.
   * Used for robust statistics, privacy (differential privacy), and signal processing.
   *
   * @param options Options for the Laplace distribution.
   * @returns A random number from the Laplace distribution.
   * @example
   * const random = createRandom(12345);
   *
   * // Measurement error with heavy tails (location=0, scale=1)
   * const error = random.laplace({ location: 0, scale: 1 });
   *
   * // Price change modeling (location=0, scale=0.5)
   * const priceChange = random.laplace({ location: 0, scale: 0.5 });
   *
   * // Privacy noise addition (location=0, scale=sensitivity/ε)
   * const noise = random.laplace({ location: 0, scale: 2.0 });
   */
  laplace(options: RandomLaplaceOptions = {}): number {
    return randomLaplace.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Cauchy distribution.
   * Has no defined mean or variance - represents extreme outliers and heavy-tailed phenomena.
   * Used in physics (Lorentzian distribution), robust statistics, and modeling extreme events.
   *
   * @param options Options for the Cauchy distribution.
   * @returns A random number from the Cauchy distribution.
   * @example
   * const random = createRandom(12345);
   *
   * // Spectral line modeling in physics (location=0, scale=1)
   * const spectralLine = random.cauchy({ location: 0, scale: 1 });
   *
   * // Robust error modeling with extreme outliers
   * const robustError = random.cauchy({ location: 0, scale: 0.1 });
   *
   * // Random walk with heavy tails
   * const stepSize = random.cauchy({ location: 0, scale: 2 });
   */
  cauchy(options: RandomCauchyOptions = {}): number {
    return randomCauchy.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a hypergeometric distribution.
   * Models sampling without replacement from a finite population (e.g., card games, quality control).
   * Unlike binomial, the probability changes with each draw since items aren't replaced.
   *
   * @param options Options for the hypergeometric distribution.
   * @returns A random integer from the hypergeometric distribution.
   * @example
   * const random = createRandom(12345);
   *
   * // Drawing cards: 5 cards from deck with 13 spades
   * const spades = random.hypergeometric({
   *   populationSize: 52, successStates: 13, draws: 5
   * });
   *
   * // Quality control: 10 items from batch of 100 with 5 defective
   * const defectiveFound = random.hypergeometric({
   *   populationSize: 100, successStates: 5, draws: 10
   * });
   *
   * // Survey sampling: 20 people from 1000, where 300 support policy
   * const supporters = random.hypergeometric({
   *   populationSize: 1000, successStates: 300, draws: 20
   * });
   */
  hypergeometric(options: RandomHypergeometricOptions = {}): number {
    return randomHypergeometric.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Gumbel distribution (Type-I Extreme Value).
   * Models the maximum (or minimum) of many samples - used for extreme weather, flood analysis,
   * and reliability engineering. Common in hydrology and materials science.
   *
   * @param options Options for the Gumbel distribution.
   * @returns A random number from the Gumbel distribution.
   * @example
   * const random = createRandom(12345);
   *
   * // Maximum daily temperature in summer (location=30°C, scale=5°C)
   * const maxTemp = random.gumbel({ location: 30, scale: 5 });
   *
   * // Annual maximum flood level (location=5m, scale=1.2m)
   * const floodLevel = random.gumbel({ location: 5, scale: 1.2 });
   *
   * // Extreme wind speed for structural design
   * const extremeWind = random.gumbel({ location: 25, scale: 8 }); // m/s
   */
  gumbel(options: RandomGumbelOptions = {}): number {
    return randomGumbel.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random number from a Rayleigh distribution.
   * Models the magnitude of 2D vectors with normally distributed components.
   * Used for wind speed modeling, wireless communications (Rayleigh fading), and particle physics.
   *
   * @param options Options for the Rayleigh distribution.
   * @returns A random number from the Rayleigh distribution (≥ 0).
   * @example
   * const random = createRandom(12345);
   *
   * // Wind speed modeling (scale=8 m/s)
   * const windSpeed = random.rayleigh({ scale: 8 });
   *
   * // Signal amplitude in wireless communications (scale=1)
   * const signalAmplitude = random.rayleigh({ scale: 1 });
   *
   * // Random walk distance from origin
   * const distance = random.rayleigh({ scale: 5 });
   */
  rayleigh(options: RandomRayleighOptions = {}): number {
    return randomRayleigh.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random angle from a Von Mises distribution (circular normal).
   * Models directional data like wind directions, animal migration paths, and periodic phenomena.
   * The concentration parameter controls how tightly clustered the angles are around the mean direction.
   *
   * @param options Options for the Von Mises distribution.
   * @returns A random angle in radians from the Von Mises distribution (0 to 2π).
   * @example
   * const random = createRandom(12345);
   *
   * // Wind direction (mean=π/2 (90°), concentration=2)
   * const windDirection = random.vonMises({ mean: Math.PI/2, concentration: 2 });
   *
   * // Animal migration bearing (mean=0, concentration=5 - highly concentrated)
   * const migrationBearing = random.vonMises({ mean: 0, concentration: 5 });
   *
   * // Circular error in compass readings (mean=π, concentration=10)
   * const compassError = random.vonMises({ mean: Math.PI, concentration: 10 });
   */
  vonMises(options: RandomVonMisesOptions = {}): number {
    return randomVonMises.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random integer from a Zipf distribution (power law).
   * Models ranked data where frequency is inversely proportional to rank (e.g., word frequencies, city sizes).
   * Follows the "80-20 rule" - a few items are extremely common, most are rare.
   *
   * @param options Options for the Zipf distribution.
   * @returns A random integer from the Zipf distribution (1 to maxValue).
   * @example
   * const random = createRandom(12345);
   *
   * // Word frequency modeling (exponent=1.2, maxValue=10000)
   * const wordRank = random.zipf({ exponent: 1.2, maxValue: 10000 });
   *
   * // Website page popularity (exponent=2, maxValue=1000)
   * const pageRank = random.zipf({ exponent: 2, maxValue: 1000 });
   *
   * // City size distribution (exponent=1.1, maxValue=500)
   * const cityRank = random.zipf({ exponent: 1.1, maxValue: 500 });
   */
  zipf(options: RandomZipfOptions = {}): number {
    return randomZipf.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }

  /**
   * Generate a random vector from a multinomial distribution.
   * Uses sequential binomial sampling to allocate trials across multiple categories.
   *
   * @param options Options for the multinomial distribution.
   * @returns A random vector from the multinomial distribution (entries sum to trials).
   * @example
   * const random = createRandom(12345);
   * const counts = random.multinomial({ trials: 10, probabilities: [0.5, 0.5] }); // [4, 6]
   * const multiCat = random.multinomial({ trials: 20, probabilities: [0.25, 0.25, 0.25, 0.25] }); // [5, 3, 7, 5]
   */
  multinomial(options: RandomMultinomialOptions = {}): number[] {
    return randomMultinomial.call(this.internalSeed, {
      ...options,
      onNextSeed: value => this.internalSeed = value,
    })
  }
}

/**
 * Create a new instance of the {@linkcode Random} class with the given seed.
 *
 * @param seed The seed for the random number generator.
 * @returns A new {@linkcode Random} instance.
 */
export function createRandom(seed?: number): Random {
  return new Random(seed)
}
