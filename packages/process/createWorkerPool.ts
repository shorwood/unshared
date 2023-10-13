import { EventEmitter } from 'node:events'
import { cpus } from 'node:os'
import { Function } from '@unshared/types'
import { WorkerService, WorkerServiceOptions, Workerized } from './createWorkerService'

export interface WorkerPoolOptions extends WorkerServiceOptions {
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
  /**
   * Instantiate the worker pool immediately. If set to `false`, the worker pool will
   * only be instantiated when the first function is called.
   *
   * @default false
   */
  coldStart?: boolean
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
export class WorkerPool extends EventEmitter {
  constructor(private options: WorkerPoolOptions = {}) {
    super()
    if (options.coldStart) this.createWorkers()
  }

  /** The `WorkerService` instances that are used to execute the functions. */
  public workers: WorkerService[] = []

  /** @returns The number of currently running threads. */
  get length() {
    return this.workers.length
  }

  /** @returns The number of currently running tasks. */
  get running() {
    return this.workers.reduce((sum, worker) => sum + worker.running, 0)
  }

  /** @returns The number of currently available threads. */
  get available() {
    return this.workers.length - this.running
  }

  /**
   * Instantiate the worker pool. This method is called automatically when the first
   * function is called or if the `coldStart` option is set to `true`. Be aware that
   * this method is synchronous and will block the main thread until all workers have
   * been created.
   *
   * @returns This worker pool instance.
   * @example workerPool.createWorkers()
   */
  public createWorkers(): this {
    const { size = cpus().length - 1 } = this.options
    for (let index = 0; index < size; index++) {
      const worker = new WorkerService(this.options)
      this.workers.push(worker)
    }
    return this
  }

  /**
   * Terminate all workers in the pool. This will free up all resources used by the
   * worker threads. It is recommended to call this method when you are done using
   * the worker pool to avoid unnecessary resource usage.
   *
   * @returns A promise that resolves when all workers have been terminated.
   * @example await workerPool.destroy()
   */
  public async terminate() {
    const promises = this.workers.map(worker => worker.terminate())
    await Promise.all(promises)
    this.workers = []
  }

  /**
   * Get the worker with the least amount of running tasks. If no workers exist, the
   * {@link createWorkers} method will be called to create the workers.
   *
   * @returns The worker with the least amount of running tasks.
   * @example const worker = new WorkerPool().getWorker()
   */
  public getWorker(): WorkerService {
    // --- Create the workers if they don't exist.
    if (this.workers.length === 0) this.createWorkers()

    // --- Find the worker with the least amount of running tasks.
    return [...this.workers].sort((a, b) => a.running - b.running).shift()!
  }

  /**
   * Spawn a function in a worker thread. This method will find the worker with the
   * least amount of running tasks and spawn the function on that worker.
   *
   * @param id The path or URL to the worker thread.
   * @param name The named export to run in the worker thread.
   * @param parameters The parameters to pass to the function.
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
  public async spawn<T extends Function>(id: URL | string, name: string, ...parameters: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    const worker = this.getWorker()
    return worker.spawn<T>(id, name, ...parameters)
  }

  /**
   * Wraps all exports of a module to be executed in a separate thread. When called, the
   * function will be executed in a separate thread and the result will be returned.
   *
   * @param id The module ID to wrap.
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
  public wrap<T extends object>(id: URL | string): Workerized<T> {
    const worker = this.getWorker()
    return worker.wrap<T>(id)
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
