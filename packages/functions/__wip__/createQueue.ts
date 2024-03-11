import { Function } from '@unshared/types/Function'
import { PromiseWrap } from '@unshared/types/PromiseWrap'

export interface QueueOptions {
  /**
   * The maximum number of functions that can run concurrently. You can also provide a function that returns the maximum
   * functions to run concurrently; The result will be evaluated each time a function is added to the queue.
   *
   * @default 1
   * @example
   * // Scale concurrency with the number of CPUs.
   * const queue = new Queue({ concurrency: () => os.cpus().length })
   */
  concurency?: number | (() => number)
  /**
   * The time in milliseconds to wait before starting the next function. You can also provide a function that returns the
   * time to wait; The result will be evaluated each time a function is added to the queue.
   *
   * @default 0
   * @example
   * // Scale cooldown with the RAM usage.
   * const queue = new Queue({ cooldown: () => os.freemem() / os.totalmem() * 1000 })
   */
  cooldown?: number | (() => number)
  /**
   * A function that is called when a task is queued.
   *
   * @param task The queued task.
   * @example
   * const sayHello = (name: string) => `Hello ${name}!`
   * const queue = new Queue({ onQueued: ({ queued }) => console.log(`Queued ${queued.name}.`) })
   * queue.call(sayHello, 'World')
   * // Queued sayHello.
   */
  onQueued?: (task: QueueTask) => void
  /**
   * A function that is called when a task is started.
   *
   * @param task The queued task.
   * @example
   * const sayHello = (name: string) => `Hello ${name}!`
   * const queue = new Queue({ onStarted: ({ queued }) => console.log(`Started ${queued.name}.`) })
   * queue.call(sayHello, 'World')
   * // Started sayHello.
   */
  onStarted?: (task: QueueTask) => void
  /**
   * A function that is called when a task has completed.
   *
   * @param task The queued task.
   * @example
   * const sayHello = (name: string) => `Hello ${name}!`
   * const queue = new Queue({ onCompleted: ({ queued }) => console.log(`Completed ${queued.name}.`) })
   * queue.call(sayHello, 'World')
   * // Completed sayHello.
   */
  onCompleted?: (task: QueueTask) => void
  /**
   * A function that is called when a task has failed.
   *
   * @param task The queued task.
   * @example
   * const sayHello = (name: string) => `Hello ${name}!`
   * const queue = new Queue({ onFailed: ({ queued }) => console.log(`Failed ${queued.name}.`) })
   * queue.call(sayHello, 'World')
   * // Failed sayHello.
   */
  onFailed?: (task: QueueTask) => void
}

export interface QueueTask {
  /**
   * The queue that the task belongs to.
   */
  readonly queue: Queue
  /**
   * The queued function.
   */
  readonly call: Function
  /**
   * The parameters to pass to the queued function.
   */
  readonly parameters: unknown[]
  /**
   * The promise that resolves when the queued function is done.
   */
  readonly promise: Promise<unknown>
  /**
   * The resolve function of the promise.
   */
  readonly resolve: (value: unknown) => void
  /**
   * The reject function of the promise.
   */
  readonly reject: (reason: unknown) => void
  /**
   * Is the task running?
   */
  readonly isRunning: boolean
  /**
   * Is the task cooling down?
   */
  readonly isCooling: boolean
  /**
   * Is the task waiting for its turn to run?
   */
  readonly isWaiting: boolean
  /**
   * Has the task completed?
   */
  readonly isCompleted: boolean
  /**
   * Has the task failed?
   */
  readonly isFailed: boolean
}

export interface Queue extends Readonly<QueueOptions> {
  /**
   * The number of queued tasks.
   */
  readonly length: number
  /**
   * The number of running tasks.
   */
  readonly running: number
  /**
   * The number of completed tasks.
   */
  readonly completed: number
  /**
   * The number of failed tasks.
   */
  readonly failed: number
  /**
   * The number of tasks that are awaiting cooldown.
   */
  readonly cooling: number
  /**
   * The number of tasks that are awaiting their turn to run.
   */
  readonly concurencing: number
  /**
   * An array of the queued functions.
   */
  readonly tasks: QueueTask[]
  /**
   * Wrap a function so that it is queued when called.
   *
   * @param queued The function to wrap.
   * @returns The wrapped function.
   * @example
   * const queue = createQueue()
   * const task = (name: string) => `Hello ${name}!`
   * const taskQueued = queue.wrap(task)
   * await taskQueued('World') // Hello World!
   */
  wrap<T extends Function>(queued: T): PromiseWrap<T>
  /**
   * Queue a function.
   *
   * @param queued The function to be queued.
   * @returns The queued function.
   * @example
   * const queue = createQueue()
   * const task = (name: string) => `Hello ${name}!`
   * await queue.call(task, 'World') // Hello World!
   */
  call<T extends Function>(queued: T, ...parameters: Parameters<T>): ReturnType<PromiseWrap<T>>
  /**
   * Clear the queue. This will not stop the running tasks.
   */
  clear(): void
  /**
   * Wait for the queue to be empty. This promise might never resolve if one of
   * tasks never completes, or if the queue keeps getting new tasks.
   */
  done(): Promise<void>
  /**
   * Wait for the queue to be empty and then clear the queue.
   */
  flush(): Promise<void>
  /**
   * Abort the queue. This will not stop the running functions.
   *
   * @param error The error to reject the pending functions with.
   * @example
   * const queue = createQueue()
   * const task = () => new Promise()
   * const taskQueued = await queue.call(task)
   * queue.abort("Aborted!")
   */
  abort(error?: Error): void
}

/**
 * Instantiates a queue object that can be used to queue asynchronous functions.
 *
 * @param options The queue options
 * @returns The queue object
 */
// export function createQueue(options: QueueOptions = {}): Queue {
//   // --- Initialize options
//   const {
//     concurency = 1,
//     cooldown = 0,
//     onQueued,
//     onStarted,
//     onCompleted,
//     onFailed,
//   } = options

//   const tasks: QueueTask[] = []

//   const queue: Queue = {
//     ...options,
//     get length() { return this.tasks.length },
//     get running() { return this.tasks.filter(task => task.isRunning).length },
//     get completed() { return this.tasks.filter(task => task.isCompleted).length },
//     get failed() { return this.tasks.filter(task => task.isFailed).length },
//     get cooling() { return this.tasks.filter(task => task.isCooling).length },
//     get concurencing() { return this.tasks.filter(task => task.isConcurencing).length },
//   }

//   const run = async() => {
//     if (queue.running >= concurency) return
//     if (queue.length === 0) return
//     return queue
//   }
// }
