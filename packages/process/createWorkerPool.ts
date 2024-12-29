import type { Function, MaybeArray } from '@unshared/types'
import type { Workerized, WorkerServiceOptions, WorkerServiceResult, WorkerServiceSpawnOptions } from './createWorkerService'
import { toArray } from '@unshared/collection/toArray'
import { Once } from '@unshared/decorators/Once'
import { cpus } from 'node:os'
import { WorkerService } from './createWorkerService'

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
  constructor(private options: WorkerPoolOptions = {}) {
    if (options.eager) this.initialize()
  }

  /** The `WorkerService` instances that are used to execute the functions. */
  public workers: WorkerService[] = []

  /** @returns The number of currently running tasks. */
  get running() {
    return this.workers.reduce((sum, worker) => sum + worker.running, 0)
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
   * @param moduleId The module ID to spawn the function from.
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
  public async spawn<T extends Function>(moduleId: string | URL, payload: WorkerServiceSpawnOptions<T>): Promise<Awaited<WorkerServiceResult<T>>> {
    const worker = this.getWorker()
    return worker.spawn<T>(moduleId, payload)
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
  public wrap<T extends object>(moduleId: string | URL, paths?: MaybeArray<string>): Workerized<T> {
    return new Proxy({}, {
      get: (_, name: keyof T & string) =>
        (...parameters: unknown[]) =>
          this.spawn(moduleId, { name, parameters, paths: toArray(paths) }),
    }) as Workerized<T>
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
  public async destroy() {
    const promises = this.workers.map(worker => worker.destroy())
    await Promise.all(promises)
    this.workers = []
  }

  /**
   * Dispose of the allocated resources. This method is called automatically when the
   * automatically when the garbage collector runs on the `WorkerPool` instance.
   */
  [Symbol.dispose]() {
    void this.destroy()
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
