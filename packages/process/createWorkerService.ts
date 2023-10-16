/* eslint-disable sonarjs/no-duplicate-string */
import { Worker, WorkerOptions } from 'node:worker_threads'
import { Function } from '@unshared/types/Function'
import { WORKER_SERVICE_FUNCTION_NAME, WORKER_SERVICE_URL } from './createWorkerService.constants'
import { workerRequest } from './workerRequest'

/** A workerized function or value. */
export type WorkerizedExport<T> =
  T extends (...args: infer P) => infer R
    ? (...args: P) => Promise<Awaited<R>>
    : () => Promise<T>

/**
 * `Proxy` of a module that will execute its named functions in a separate
 * `Worker` thread.
 *
 * @template T The type of the module to workerize.
 * @returns A `Proxy` of the module that will execute its named functions in a separate `Worker` thread.
 */
export type Workerized<T extends object> = { [K in keyof T]: WorkerizedExport<T[K]> }

/** The options for the `WorkerService`. */
export interface WorkerServiceOptions extends WorkerOptions {
  /**
   * The path to the worker to use. This worker will be responsible for importing
   * and executing the functions in the worker thread. Internally, this script will
   * use `workerRegister` to register a single function that will be called by the
   * `WorkerService` instances.
   *
   * @deprecated This should be lest as-is unless you know what you are doing.
   */
  workerUrl?: URL
  // TODO: Add support for the following options.
  // /**
  //  * The maximum number of concurrent tasks that can be executed in a single worker thread.
  //  * This is useful to prevent the worker thread from being overloaded with too many tasks.
  //  * If the maximum number of concurrent tasks is reached, the worker thread will wait until
  //  * a task is finished before executing the next task.
  //  *
  //  * @default 8
  //  */
  // maxConcurrentTasks?: number
  // /**
  //  * The maximum number of tasks that can be queued in a single worker thread. If the maximum
  //  * number of queued tasks is reached, the oldest task will be removed from the queue and
  //  * replaced with the new task.
  //  *
  //  * @default 128
  //  */
  // maxQueuedTasks?: number
}

export interface WorkerServiceRequest {
  /** The path or URL to the module to import. */
  id: URL | string
  /** The name of the export to get from the module. */
  name: string
  /** The parameters to pass to the target function. */
  parameters: unknown[]
}

/**
 * A service that can be used to workerize functions and modules in a `Worker` thread
 * from anywhere in the application. Allowing you to dynamically import functions and
 * execute functions in another thread without having to worry about the implementation.
 *
 * The main goal is to create a transparent API that allows you to parallelize your
 * business logic without having to worry about the implementation details of the
 * worker thread.
 */
export class WorkerService {
  /**
   * Create a `Worker` instance with the specified options and return a `WorkerService`
   * instance that can be used to call functions in the worker thread.
   *
   * @param workerOptions The options to pass to the worker service.
   * @returns A promise that resolves with the result of the function.
   * @example
   * const service = new WorkerService()
   * const result = await service.spawn('node:crypto', 'randomBytes', 128) // Uint8Array { ... }
   */
  constructor(private workerOptions: WorkerServiceOptions = {}) {}

  /**
   * The `Worker` instance that is used to execute the functions. This property can
   * be used to communicate with the worker thread directly.
   */
  public worker: Worker | undefined

  /**
   * The number of currently running tasks. This is useful to know if the worker thread
   * is busy or not. Allowing you to better orchestrate and balance the load on the
   * worker thread.
   */
  public running = 0

  /**
   * Create the worker instance and initialize it. This method is called automatically
   * when the first function is called or if the `coldStart` option is set to `true`.
   *
   * @returns A promise that resolves with the result of the function.
   * @example
   * // Create a worker service.
   * const workerService = await createWorkerService()
   *
   * // Cold start the worker thread.
   * await workerService.createWorker()
   *
   * // Wrap the node:crypo module.
   * const { randomBytes } = workerService.wrap<typeof import('node:crypto')>('node:crypto')
   *
   * // Call the hash function in a worker thread.
   * const result = await randomBytes(128) // Uint8Array { ... }
   *
   * // Terminate the worker thread.
   * await workerService.terminate()
   */
  public async initialize(): Promise<this> {
    if (this.worker) return this

    // --- Destructure and default options.
    const {
      execArgv = [],
      workerUrl = WORKER_SERVICE_URL,
      ...workerOptions
    } = this.workerOptions

    // --- Create the worker thread.
    this.worker = new Worker(workerUrl, {
      execArgv: ['--no-warnings', ...process.execArgv, ...execArgv],
      env: process.env,
      ...workerOptions,
    })

    // --- Await for the worker to be online.
    await new Promise((resolve, reject) => {
      this.worker!.on('online', resolve)
      this.worker!.on('error', reject)
      this.worker!.on('messageerror', reject)
    })

    // --- Finally, return this instance.
    return this
  }

  /**
   * Destroy the worker instance and terminate the worker thread. This method is called
   * automatically when the garbage collector runs on the `WorkerService` instance.
   * You can call this method manually to terminate the worker thread.
   *
   * @returns A promise that resolves to the exit code of the worker thread.
   * @example await workerService.terminate()
   */
  public async terminate(): Promise<number> {
    if (!this.worker) return -1
    const exitCode = await this.worker.terminate()
    this.worker = undefined
    return exitCode
  }

  /**
   * Call a function from a module in a separate thread and retrieve the result through IPC.
   * You have to pass the module ID and the name of the export to spawn. The function will
   * be called with the given arguments and the result will be returned.
   *
   * @param id The module ID to call the function from.
   * @param name The name of the exported function to call.
   * @param parameters The parameters to pass to the function.
   * @returns A promise that resolves with the result of the function.
   * @example
   * // Create a worker service.
   * const workerService = await createWorkerService()
   *
   * // Spawn the randomBytes function from the crypto module.
   * const result = await workerService.spawn('node:crypto', 'randomBytes', 128) // Uint8Array { ... }
   */
  public async spawn<T extends Function>(id: URL | string, name: string, ...parameters: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    if (!this.worker) await this.initialize()

    // --- Send the message to the worker thread and wait for the response.
    this.running++
    const path = typeof id === 'string' ? id : id.pathname
    const payload: WorkerServiceRequest = { id: path, name, parameters }
    const result = await workerRequest(this.worker!, WORKER_SERVICE_FUNCTION_NAME, payload)
    this.running--

    // --- Finally, if all went well, return the value.
    return result as Awaited<ReturnType<T>>
  }

  /**
   * Wraps all exports of a module to be executed in a separate thread. When called, the
   * function will be executed in a separate thread and the result will be returned.
   *
   * @param id The module ID to wrap.
   * @returns A proxy object that will execute the named function in a separate thread.
   * @example
   * // Create a worker service.
   * const workerService = await createWorkerService()
   *
   * // Wrap the node:crypo module.
   * const { randomBytes } = workerService.wrap<typeof import('node:crypto')>('node:crypto')
   *
   * // Call the hash function in a worker thread.
   * const result = await randomBytes(128) // Uint8Array { ... }
   */
  public wrap<T extends object>(id: URL | string): Workerized<T> {
    return new Proxy({}, {
      get: (_, name: string & keyof T) => this.spawn.bind(this, id, name),
    }) as Workerized<T>
  }
}

/**
 * Create a `Worker` instance with the specified options and return a `WorkerService`
 * instance that can be used to call functions in the worker thread.
 *
 * @param options The options to pass to the worker service.
 * @returns A promise that resolves with the result of the function.
 * @example
 * const { call, workerize, workerizeModule } = createWorkerService()
 * const result = await call('lodash', 'add', 1, 2) // 3
 */
export function createWorkerService(options: WorkerServiceOptions = {}): WorkerService {
  return new WorkerService(options)
}

/** c8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Fixture = typeof import('./__fixtures__/module')
  const workerUrl = new URL('__fixtures__/module', import.meta.url).pathname
  const workerOptions = { execArgv: ['--loader', 'tsx'] }

  it('should spawn a function in a worker thread and return the result', async() => {
    const service = createWorkerService(workerOptions)
    const result = await service.spawn<Fixture['factorial']>(workerUrl, 'factorial', 5)
    expect(result).toEqual(120)
    await service.terminate()
  })

  it('should wrap a module in a worker thread', async() => {
    const service = createWorkerService(workerOptions)
    const { factorial } = service.wrap<Fixture>(workerUrl)
    const result = await factorial(5)
    expect(result).toEqual(120)
    await service.terminate()
  })

  it('should not initialize the worker thread', async() => {
    const service = createWorkerService(workerOptions)
    expect(service.worker).toBeUndefined()
    await service.terminate()
  })

  it('should terminate and return -1 when no worker is running', async() => {
    const service = createWorkerService(workerOptions)
    const result = await service.terminate()
    expect(service.worker).toBeUndefined()
    expect(result).toEqual(-1)
    await service.terminate()
  })

  it('should terminate and return the exit code when a worker is running', async() => {
    const service = createWorkerService(workerOptions)
    await service.spawn(workerUrl, 'factorial', 5)
    const result = await service.terminate()
    expect(service.worker).toBeUndefined()
    expect(result).toEqual(1)
    await service.terminate()
  })

  it('should create the worker manually', async() => {
    const service = createWorkerService(workerOptions)
    await service.initialize()
    expect(service.worker).toBeDefined()
    await service.terminate()
  })
}
