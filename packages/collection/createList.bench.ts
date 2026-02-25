/* eslint-disable unicorn/consistent-function-scoping */

/* eslint-disable n/no-extraneous-import */
import { bench } from 'vitest'
import { createList, List } from './createList'

const ITERATIONS = 10000

describe('createList', () => {
  function createBenchmark(name: string, fn: (array: List<number> | number[], i: number) => void) {
    describe(name, () => {
      const array: number[] = []
      const list1 = createList<number>()
      const list2 = new List<number>()
      bench('Array', () => {
        for (let i = 0; i < ITERATIONS; i++) fn(array, i)
      })
      bench('createList', () => {
        for (let i = 0; i < ITERATIONS; i++) fn(list1, i)
      })
      bench('List', () => {
        for (let i = 0; i < ITERATIONS; i++) fn(list2, i)
      })
    })
  }

  createBenchmark('unshift', (x, i) => x.unshift(i))
  createBenchmark('splice-start', (x, i) => x.splice(0, 0, i))
  createBenchmark('push', (x, i) => x.push(i))
  createBenchmark('shift', (x, i) => { x.push(i); x.shift() })
  createBenchmark('queue', (x, i) => { x.push(i); if (x.length > 100) x.shift() })
  createBenchmark('deque', (x, i) => {
    if (i % 2 === 0) x.unshift(i)
    else x.pop()
  })
})
