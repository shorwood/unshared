import { nextTick } from 'node:process'

export interface BenchmarkOptions {
  /** Number of times to run the benchmark. */
  iterations?: number
  /** Cold-start the benchmark. */
  coldStart?: boolean
}

export interface BenchmarkResult {
  /** The average time (in milliseconds) per run. */
  average: number
  /** The total time (in milliseconds) of the benchmark. */
  total: number
  /** The average memory usage per run. */
  memory: number
  /** The number of iterations per run. */
  iterations: number
}

/**
 * Benchmark a function and return statistics about the run(s).
 *
 * @param fn The function to benchmark.
 * @param options The benchmark options.
 * @returns The average amount of milliseconds it took to run the function.
 * @example benchmark(hash, { iterations: 1000 })
 */
export const benchmark = async(fn: Function, options: BenchmarkOptions = {}): Promise<BenchmarkResult> => {
  const { memoryUsage } = await import('node:process')
  const { performance } = await import('node:perf_hooks')

  if (typeof fn !== 'function')
    throw new TypeError('The function to benchmark must be a function.')

  // --- Get options and initialize result.
  const { iterations = 1000, coldStart = true } = options
  const result = {
    average: 0,
    total: 0,
    memory: 0,
    iterations: 0,
  }

  try {
    // --- Run the function once to avoid cold start issues
    if (coldStart) await fn()

    // --- Now, run the function `iterations` times, and record the results.
    for (let index = 0; index < iterations; index++) {
      const startTime = performance.now()
      const startHeap = memoryUsage().external
      await fn()
      const endTime = performance.now()
      const endHeap = memoryUsage().external
      const time = endTime - startTime
      const memory = endHeap - startHeap
      result.iterations++
      result.total += time
      result.memory = (result.memory + memory) / 2
    }
  }
  catch { /* Ignore errors */ }

  // --- Calculate the average time and return the result.
  result.average = result.total / result.iterations
  return result
}

/** c8 ignore next */
if (import.meta.vitest) {
  function toBenchmarkSync() {}
  function toBenchmarkAsync() { return new Promise(nextTick) }
  function toBenchmarkWithErrorSync() { throw new Error('Error') }
  function toBenchmarkWithErrorAsyc() { return new Promise((resolve, reject) => nextTick(reject)) }

  it('should benchmark a synchronous function', async() => {
    const result = await benchmark(toBenchmarkSync)
    expect(result).toEqual({
      average: expect.any(Number),
      total: expect.any(Number),
      memory: expect.any(Number),
      iterations: expect.any(Number),
    })
  })

  it('should benchmark an asynchronous function', async() => {
    const result = await benchmark(toBenchmarkAsync)
    expect(result).toEqual({
      average: expect.any(Number),
      total: expect.any(Number),
      memory: expect.any(Number),
      iterations: expect.any(Number),
    })
  })

  it('should benchmark a synchronous function with an error', async() => {
    const result = await benchmark(toBenchmarkWithErrorSync)
    expect(result).toEqual({
      average: expect.any(Number),
      total: expect.any(Number),
      memory: expect.any(Number),
      iterations: expect.any(Number),
    })
  })

  it('should benchmark an asynchronous function with an error', async() => {
    const result = await benchmark(toBenchmarkWithErrorAsyc)
    expect(result).toEqual({
      average: expect.any(Number),
      total: expect.any(Number),
      memory: expect.any(Number),
      iterations: expect.any(Number),
    })
  })
}
