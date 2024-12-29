import type * as Module from './__fixtures__/module'
import { cpus } from 'node:os'
import { createWorkerPool, WorkerPool } from './createWorkerPool'

describe('createWorkerPool', () => {
  const moduleId = new URL('__fixtures__/module', import.meta.url)

  test('should create a worker pool', () => {
    const pool = createWorkerPool()
    expect(pool).toBeInstanceOf(WorkerPool)
  })

  describe('spawn', () => {
    it('should spawn a function in a worker thread', async() => {
      const pool = createWorkerPool()
      const result = await pool.spawn<typeof Module['factorial']>(moduleId, { name: 'factorial', parameters: [5] })
      expect(result).toBe(120)
    })
  })

  describe('wrap', () => {
    it('should wrap a module to be executed in a separate thread', async() => {
      const pool = createWorkerPool()
      const module = pool.wrap<typeof Module>(moduleId)
      const result = await module.factorial(5)
      expect(result).toBe(120)
    })
  })

  describe('lifecycle', () => {
    it('should instantiate with empty worker list', () => {
      const pool = createWorkerPool()
      expect(pool.workers).toHaveLength(0)
    })

    it('should have a size of cpus().length - 1 by default', () => {
      const pool = createWorkerPool()
      pool.initialize()
      expect(pool.workers).toHaveLength(cpus().length - 1)
    })

    it('should create workers on the first function call', async() => {
      const pool = createWorkerPool({ size: 4 })
      const module = pool.wrap<typeof Module>(moduleId)
      await module.factorial(5)
      expect(pool.workers).toHaveLength(4)
    })

    it('should create workers eagerly', async() => {
      const pool = createWorkerPool({ eager: true, size: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(pool.workers).toHaveLength(4)
    })

    it('should terminate all workers', async() => {
      const pool = createWorkerPool({ size: 4 })
      pool.initialize()
      await pool.destroy()
      expect(pool.workers).toHaveLength(0)
    })

    it('should terminate all workers when the pool is disposed', async() => {
      const pool = createWorkerPool({ size: 4 })
      pool.initialize()
      pool[Symbol.dispose]()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(pool.workers).toHaveLength(0)
    })

    it('should dispatch tasks between 4 workers', async() => {
      const pool = createWorkerPool({ size: 4 })
      const module = pool.wrap<typeof Module>(moduleId)
      const promises = Array.from({ length: 8 }, () => module.getThreadId())
      const results = Promise.all(promises)
      await expect(results).resolves.toStrictEqual([
        pool.workers[0].worker!.threadId,
        pool.workers[1].worker!.threadId,
        pool.workers[2].worker!.threadId,
        pool.workers[3].worker!.threadId,
        pool.workers[0].worker!.threadId,
        pool.workers[1].worker!.threadId,
        pool.workers[2].worker!.threadId,
        pool.workers[3].worker!.threadId,
      ])
    })

    it('should keep track of the number of running tasks', async() => {
      const pool = createWorkerPool({ size: 4 })
      const module = pool.wrap<typeof Module>(moduleId)
      const promises = Array.from({ length: 8 }, () => module.getThreadId())
      const results = Promise.all(promises)
      await expect(results).resolves.toHaveLength(8)
      expect(pool.running).toBe(0)
    })
  })
})
