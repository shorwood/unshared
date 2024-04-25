import { cpus } from 'node:os'
import { Function, MaybeArray } from '@unshared/types'
import { Once } from '@unshared/decorators/Once'
import { toArray } from '@unshared/collection/toArray'
import {
  WorkerService,
  WorkerServiceOptions,
  WorkerServicePayload,
  WorkerServiceResult,
  Workerized,
} from './createWorkerService'

export interface WorkerPoolOptions extends WorkerServiceOptions {
  /**
   * If `true`, the worker pool will be created immediately when the worker pool is
   * created. By default, the worker pool will be created when when they are needed
   * for the first time but this may cause a delay each time a worker is created.
   *
   * To avoid this delay, you can set this option to `true` to create the workers
   * immediately when the worker pool is created. Like at the start of the program.
   *
   * @default false
   */
  eager?: boolean
  /**
   * The number of workers to create. Defaults to the number of threads available
   * on the system. It is not recommended to create more workers than the number
   * of threads available on the system.
   *
   * Generally, you only need to reduce the number of workers if you want to prioritize
   * certain tasks over others. For example, if you have a task that is very CPU intensive.
   *
   * Be aware that once the pool is created, the number of workers cannot be changed.
   *
   * @default os.cpus().length - 1
   */
  size?: number
}

/**
 * Create a pool of workers that can be used to execute tasks in parallel.
 *
 * @param options Options for the worker pool.
 * @returns A worker pool instance.
 * @example
 * const pool = createWorkerPool({
 *   threads: 4,
 *   createWorker: () => new Worker('./worker.js')
 * });
 *
 * const mathUrl = new URL('./math.js', import.meta.url);
 * const math = await pool.wrapModule(moduleUrl)
 */
export class WorkerPool {
  /** The `WorkerService` instances that are used to execute the functions. */
  public workers: WorkerService[] = []

  constructor(private options: WorkerPoolOptions = {}) {
    if (options.eager) this.initialize()
  }

  /**
   * Get the worker with the least amount of running tasks. If no workers exist,
   * the `createWorkers` method will be called to create the workers.
   *
   * @returns The worker with the least amount of running tasks.
   * @example const worker = new WorkerPool().getWorker()
   */
  private getWorker(): WorkerService {
    if (this.workers.length === 0) this.initialize()
    return [...this.workers].sort((a, b) => a.running - b.running)[0]
  }

  /**
   * Dispose of the allocated resources. This method is called automatically when the
   * automatically when the garbage collector runs on the `WorkerPool` instance.
   */
  [Symbol.dispose]() {
    void this.terminate()
  }

  /**
   * Instantiate the worker pool. This method is called automatically when the first
   * function is called or if the `coldStart` option is set to `true`. Be aware that
   * this method is synchronous and will block the main thread until all workers have
   * been created.
   *
   * @example workerPool.createWorkers()
   */
  @Once()
  public initialize(): void {
    const { size = cpus().length - 1 } = this.options
    for (let index = 0; index < size; index++) {
      const worker = new WorkerService(this.options)
      this.workers.push(worker)
    }
  }

  /**
   * Spawn a function in a worker thread. This method will find the worker with the
   * least amount of running tasks and spawn the function on that worker.
   *
   * @param payload The payload to send to the worker.
   * @returns An awaitable promise that resolves with the result of the function.
   * @example
   *
   * // math.ts
   * export function add(a: number, b: number) { return a + b }
   *
   * // main.ts
   * const workerPool = createWorkerPool()
   * const mathUrl = new URL('./math.ts', import.meta.url)
   * const result = await workerPool.spawn(mathUrl, 'add', 1, 2) // 3
   */
  public async spawn<T extends Function>(payload: WorkerServicePayload<T>): Promise<Awaited<WorkerServiceResult<T>>> {
    const worker = this.getWorker()
    return worker.spawn<T>(payload)
  }

  /**
   * Terminate all workers in the pool. This will free up all resources used by the
   * worker threads. It is recommended to call this method when you are done using
   * the worker pool to avoid unnecessary resource usage.
   *
   * @returns A promise that resolves when all workers have been terminated.
   * @example await workerPool.destroy()
   */
  @Once()
  public async terminate() {
    const promises = this.workers.map(worker => worker.terminate())
    await Promise.all(promises)
    this.workers = []
  }

  /**
   * Wraps all exports of a module to be executed in a separate thread. When called, the
   * function will be executed in a separate thread and the result will be returned.
   *
   * @param moduleId The module ID to wrap.
   * @param paths An array of paths to use when resolving the module ID.
   * @returns A proxy object that will execute the named function in a separate thread.
   * @example
   *
   * // Create a pool with 4 workers.
   * const workerPool = createWorkerPool({ workers: 4 })
   *
   * // Wrap the lodash module.
   * const lodash = workerPool.wrapModule<typeof import('lodash')>('lodash')
   *
   * // Call the add function in a worker thread.
   * const result = await lodash.add(1, 2) // 3
   */
  public wrap<T extends object>(moduleId: URL | string, paths?: MaybeArray<string>): Workerized<T> {
    return new Proxy({}, {
      get: (_, name: keyof T & string) =>
        (...parameters: unknown[]) =>
          this.spawn.call(this, { moduleId, name, parameters, paths: toArray(paths) }),
    }) as Workerized<T>
  }

  /** @returns The number of currently running tasks. */
  get running() {
    return this.workers.reduce((sum, worker) => sum + worker.running, 0)
  }
}

/**
 * Create a pool of workers that can be used to execute tasks in parallel.
 * This is a convenience function that creates a `WorkerPool` instance and
 * returns the `spawn` and `wrap` methods.
 *
 * @param options Options for the worker pool.
 * @returns A worker pool instance.
 * @example
 * const workerPool = createWorkerPool()
 * const result = await workerPool.spawn('lodash', 'add', 1, 2) // 3
 */
export function createWorkerPool(options?: WorkerPoolOptions): WorkerPool {
  return new WorkerPool(options)
}

/* v8 ignore start */
if (import.meta.vitest) {
  type Module = typeof import('./__fixtures__/module')
  const moduleId = new URL('__fixtures__/module', import.meta.url)

  test('should create a worker pool', () => {
    const pool = createWorkerPool()
    expect(pool).toBeInstanceOf(WorkerPool)
  })

  describe('spawn', () => {
    it('should spawn a function in a worker thread', async() => {
      const pool = createWorkerPool()
      const result = await pool.spawn<Module['factorial']>({ moduleId, name: 'factorial', parameters: [5] })
      expect(result).toBe(120)
    })
  })

  describe('wrap', () => {
    it('should wrap a module to be executed in a separate thread', async() => {
      const pool = createWorkerPool()
      const module = pool.wrap<Module>(moduleId)
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
      const module = pool.wrap<Module>(moduleId)
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
      await pool.terminate()
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
      const module = pool.wrap<Module>(moduleId)
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
      const module = pool.wrap<Module>(moduleId)
      const promises = Array.from({ length: 8 }, () => module.getThreadId())
      const results = Promise.all(promises)
      await expect(results).resolves.toHaveLength(8)
      expect(pool.running).toBe(0)
    })
  })
}
