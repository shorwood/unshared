import { toArray } from '@unshared/collection/toArray'
import { Once } from '@unshared/decorators/Once'
import { MaybeArray, UnionMerge } from '@unshared/types'
import { Function } from '@unshared/types/Function'
import { createRequire } from 'node:module'
import { Worker, WorkerOptions } from 'node:worker_threads'
import { workerRequest } from './workerRequest'

/** The result of a function when called from a `WorkerService`. */
export type WorkerServiceResult<T> =
  T extends (...args: any[]) => infer R
    ? Awaited<R> extends Buffer ? Uint8Array : Awaited<R>
    : Awaited<T> extends Buffer ? Uint8Array : Awaited<T>

/** A workerized function or value. */
export type WorkerizedExport<T> =
  T extends (...args: infer P) => any
    ? (...args: P) => Promise<WorkerServiceResult<T>>
    : () => Promise<WorkerServiceResult<T>>

/**
 * `Proxy` of a module that will execute its named functions in a separate
 * `Worker` thread.
 *
 * @template T The type of the module to workerize.
 * @returns A `Proxy` of the module that will execute its named functions in a separate `Worker` thread.
 */
export type Workerized<T extends object> =
  UnionMerge<
    | { -readonly [K in keyof T]: WorkerizedExport<T[K]> }
    | { getOwnPropertyNames: () => Promise<string[]> }
  >

/** The options for the `WorkerService`. */
export interface WorkerServiceOptions extends WorkerOptions {

  /**
   * If `true`, the worker thread will be created when the `WorkerService` is
   * instantiated. If `false`, the worker thread will be created when the first
   * function is called.
   *
   * @default false
   */
  eager?: boolean

  /**
   * The path to the worker to use. This worker will be responsible for importing
   * and executing the functions in the worker thread. Internally, this script will
   * use the `workerRegister` function to register the `WORKER_SERVICE` handler
   * that will be used to import and execute the functions. Do not change this
   * script unless you know what you are doing.
   *
   * @default new URL('createWorkerService.worker', import.meta.url)
   */
  workerUrl?: URL
}

export interface WorkerServicePayload<T extends Function = Function<unknown, unknown[]>> {

  /**
   * The path or URL to the module to import. Be aware that this path
   * will be resolved using the `createRequire().resolve()` function.
   * This means that you can use the `node:` protocol to import built-in
   * modules or the `file:` protocol to import local modules.
   *
   * @example 'node:crypto'
   */
  moduleId: string | URL

  /**
   * The name of the export to get from the module. If the named
   * export is a constant, it will be returned as is. If it is a
   * function, it will be called with the given parameters.
   *
   * @default 'default'
   * @example 'randomBytes'
   */
  name?: string

  /**
   * The parameters to pass to the target function as an array.
   *
   * @example [128]
   */
  parameters?: Parameters<T>

  /**
   * Additionally, you can provide the `paths` property to specify the
   * search paths for the module. This is useful when you cannot garantee
   * the context of the calling module.
   *
   * @example ['/path/to/module']
   */
  paths?: string[]

  /**
   * Additional transferable objects to pass to the worker thread. This can be used
   * to pass `ArrayBuffer` or `MessagePort` objects to the worker thread. By default,
   * the parameters are checked for `ArrayBuffer` and `MessagePort` objects and added
   * to the transfer list automatically.
   *
   * @example [new Buffer('Hello, World!').buffer]
   */
  transferList?: Transferable[]
}

/**
 * Dynamically resolve the path of the worker service script used by the `WorkerService`
 * to dynamically wrap modules and functions in a worker thread.
 *
 * @returns The path to the worker service script.
 */
function getWorkerServicePath(): URL {
  const require = createRequire(import.meta.url)
  const unsharedModulePath = require.resolve('@unshared/process/createWorkerService.worker')
  return new URL(unsharedModulePath, import.meta.url)
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
export class WorkerService implements AsyncDisposable {

  /**
   * The number of currently running tasks. This is useful to know if the worker thread
   * is busy or not. Allowing you to better orchestrate and balance the load on the
   * worker thread.
   */
  public running = 0

  /**
   * The `Worker` instance that is used to execute the functions. This property can
   * be used to communicate with the worker thread directly.
   */
  public worker: undefined | Worker

  /**
   * Create a `Worker` instance with the specified options and return a `WorkerService`
   * instance that can be used to call functions in the worker thread.
   *
   * @param options The options to pass to the worker service.
   * @returns A promise that resolves with the result of the function.
   * @example
   * const service = new WorkerService()
   * const result = await service.spawn('node:crypto', 'randomBytes', 128) // Uint8Array { ... }
   */
  constructor(private options: WorkerServiceOptions = {}) {
    // eslint-disable-next-line sonarjs/no-async-constructor
    if (options.eager) void this.initialize()
  }

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
  @Once()
  public async initialize(): Promise<void> {
    if (this.worker) return

    // --- Create the worker thread.
    const { workerUrl = getWorkerServicePath(), ...workerOptions } = this.options
    this.worker = new Worker(workerUrl, workerOptions)

    // --- Await for the worker to be online.
    await new Promise((resolve, reject) => {
      this.worker!.on('online', resolve)

      // this.worker!.on('error', reject)
      this.worker!.on('messageerror', reject)
    })
  }

  /**
   * Call a function from a module in a separate thread and retrieve the result through IPC.
   * You have to pass the module ID and the name of the export to spawn. The function will
   * be called with the given arguments and the result will be returned.
   *
   * @param payload The request object that contains the module ID and the function to spawn.
   * @returns A promise that resolves with the result of the function.
   * @example
   * // Create a worker service.
   * const workerService = await createWorkerService()
   *
   * // Spawn the randomBytes function from the crypto module.
   * const result = await workerService.spawn('node:crypto', 'randomBytes', 128) // Uint8Array { ... }
   */
  public async spawn<T extends Function<unknown>>(payload: WorkerServicePayload<T>): Promise<Awaited<WorkerServiceResult<T>>> {
    this.running++
    if (!this.worker) await this.initialize()
    if (payload.moduleId instanceof URL) payload.moduleId = payload.moduleId.pathname
    const request = workerRequest(this.worker!, 'WORKER_SERVICE', payload)
    return request.finally(() => this.running--) as Awaited<WorkerServiceResult<T>>
  }

  /**
   * Destroy the worker instance and terminate the worker thread. This method is called
   * automatically when the garbage collector runs on the `WorkerService` instance.
   * You can call this method manually to terminate the worker thread.
   *
   * @returns A promise that resolves to the exit code of the worker thread.
   * @example await workerService.terminate()
   */
  @Once()
  public async destroy(): Promise<number> {
    if (!this.worker) return -1
    const exitCode = await this.worker.terminate()
    this.worker = undefined
    return exitCode
  }

  /**
   * Dispose of the worker thread and clean up any resources. This method is called
   * automatically when the garbage collector runs on the `WorkerService` instance.
   */
  async [Symbol.asyncDispose]() {
    await this.destroy()
  }

  /**
   * Wraps all exports of a module to be executed in a separate thread. When called, the
   * function will be executed in a separate thread and the result will be returned.
   *
   * @param moduleId The module ID to wrap.
   * @param paths An array of paths to use when resolving the module ID.
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
  public wrap<T extends object>(moduleId: string | URL, paths?: MaybeArray<string>): Workerized<T> {
    return new Proxy({}, {
      get: (_, name: keyof T & string) =>
        (...parameters: unknown[]) => this.spawn({ moduleId, name, parameters, paths: toArray(paths) }),
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
export function createWorkerService(options: WorkerServiceOptions = {}) {
  return new WorkerService(options)
}
