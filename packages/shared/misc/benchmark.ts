/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Benchmark a function
 * @param {function} fn The function to benchmark
 * @param {number} iterations The number of times to run the function
 * @returns {number} The average amount of time, in milliseconds, it took to run the function
 */
export const benchmark = (fn: () => void, iterations = 1000): number => {
  // --- First, run the function once to avoid cold start issues
  fn()

  // --- Now, run the function `iterations` times, and get the start and end timestamps
  const start = performance.now()
  for (let index = 0; index < iterations; index++) fn()
  const end = performance.now()

  // --- Return the average amount of time it took to run the function
  return (end - start) / iterations
}
