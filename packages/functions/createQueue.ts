import type { MaybeFunction } from '@unshared/types'
import type { Function } from '@unshared/types/Function'
import type { PromiseWrap } from '@unshared/types/PromiseWrap'
import type { Awaitable } from './awaitable'
import { awaitable } from './awaitable'

export interface QueueTask<T = unknown> {

  /**
   * Abort the task.
   */
  cancel(): void

  /**
   * The queued function.
   */
  fn: Function<Promise<T> | T>

  /**
   * Is the task running?
   */
  isRunning: boolean

  /**
   * The promise that resolves when the task is complete.
   */
  promise: Promise<T>
}

export interface QueueOptions {

  /**
   * The maximum number of functions that can run concurrently. You can also provide a
   * function that returns the concurrency; The result will be evaluated each time a task
   * is added to the queue.
   *
   * @default 1
   * @example
   * // Scale concurrency with the RAM usage.
   * const queue = new Queue({ concurrency: () => os.freemem() / os.totalmem() * 10 })
   */
  concurrency?: MaybeFunction<number>

  /**
   * The time in milliseconds to wait before starting the next function. You can also provide
   * a function that returns the time to wait; The result will be evaluated each time a task
   * has completed and the next task is about to start.
   *
   * @default 0
   * @example
   * // Scale cooldown with the RAM usage.
   * const queue = new Queue({ cooldown: () => os.freemem() / os.totalmem() * 1000 })
   */
  cooldown?: MaybeFunction<number>
}

export class Queue extends EventTarget {

  /** The maximum number of functions that can run concurrently. */
  protected internalConcurency: MaybeFunction<number> = 1

  /** The time in milliseconds to wait before starting the next function. */
  protected internalCooldown: MaybeFunction<number> = 0

  /**
   * The number of tasks that are currently running.
   */
  protected running = 0

  /**
   * An array of the queued functions.
   */
  protected tasks: QueueTask[] = []

  /**
   * The number of tasks that are currently waiting for their turn to run.
   */
  protected waiting = 0

  /**
   * Create a new queue to manage the execution of functions. This
   * allows you to control the concurrency of the executions and the
   * cooldown between them.
   *
   * @param options The queue options
   * @example
   * // Create a queue with a concurrency of 4.
   * const queue = new Queue({ concurrency: 4 })
   * const app = express()
   *
   * // Wrap the listener of an express route to queue the execution.
   * app.get('/route', queue.wrap(async (req, res) => { ... }))
   */
  constructor(options: QueueOptions = {}) {
    super()
    if (options.concurrency) this.internalConcurency = options.concurrency
    if (options.cooldown) this.internalCooldown = options.cooldown
    this.addEventListener('complete', () => {
      if (this.cooldown <= 0) return this.startNextTask()
      setTimeout(() => this.startNextTask(), this.cooldown)
    })
  }

  /**
   * Dispatch an event to abort a task and remove it from the queue.
   * Do nothing if the task is already running.
   *
   * @param task The task to abort.
   */
  private dispatchTaskCancel(task: QueueTask): void {
    if (task.isRunning) return
    const error = new Error('Task canceled')
    this.dispatchTaskError(task, error)
  }

  /**
   * Dispatch an event for a task that has completed and remove it from the queue.
   *
   * @param task The task that completed.
   * @param value The result of the task.
   */
  private dispatchTaskComplete(task: QueueTask, value: unknown): void {
    const event = new CustomEvent('complete', { detail: { task, value } })
    this.running--
    this.tasks.shift()
    this.dispatchEvent(event)
  }

  /**
   * Dispatch an error event for a task and remove it from the queue.
   *
   * @param task The task that failed.
   * @param error The error that caused the task to fail.
   */
  private dispatchTaskError(task: QueueTask, error: Error): void {
    const event = new CustomEvent('error', { detail: { error, task } })
    this.running--
    this.tasks.shift()
    this.dispatchEvent(event)
  }

  /**
   * Check if the next task can be started and start it.
   *
   * @returns The result of the next task.
   */
  private startNextTask() {
    if (this.running >= this.concurrency) return
    const task = this.tasks.find(task => !task.isRunning)
    if (!task) return

    try {
      this.running++
      task.isRunning = true
      const value = task.fn()
      if (value instanceof Promise)
        void value.then(value => this.dispatchTaskComplete(task, value))
      else this.dispatchTaskComplete(task, value)
    }
    catch (error) {
      return this.dispatchTaskError(task, error as Error)
    }
  }

  /**
   * Queue a function and return a promise that resolves to the result of the function.
   *
   * @param fn The function to queue.
   * @returns A promise that resolves to the result of the function.
   * @example
   * const queue = createQueue()
   * const task = (name: string) => `Hello ${name}!`
   * await queue.call(task, 'World') // Hello World!
   */
  public call<T>(fn: Function<Promise<T> | T>): Awaitable<QueueTask<T>, T> {
    const task: QueueTask<T> = {
      cancel: () => this.dispatchTaskCancel(task),
      fn,
      isRunning: false,
      promise: new Promise<T>((resolve, reject) => {
        const onComplete = (event: Event) => {
          const { detail } = event as CustomEvent<{ task: QueueTask; value: T }>
          if (detail.task !== task) return
          resolve(detail.value)
          this.removeEventListener('complete', onComplete)
        }
        const onError = (event: Event) => {
          const { detail } = event as CustomEvent<{ error: Error; task: QueueTask }>
          if (detail.task !== task) return
          reject(detail.error)
          this.removeEventListener('error', onError)
        }
        this.addEventListener('complete', onComplete)
        this.addEventListener('error', onError)
      }),
    }

    // --- Listen for the task to complete and resolve the promise with the result.
    this.tasks.push(task)
    this.startNextTask()
    return awaitable(task, task.promise)
  }

  /**
   * Wrap a function so that it is queued when called.
   *
   * @param fn The function to wrap.
   * @returns The wrapped function.
   * @example
   * const queue = createQueue()
   * const sayHello = (name: string) => `Hello ${name}!`
   * const sayHelloAsync = queue.wrap(task)
   * await sayHelloAsync('World') // Hello World!
   */
  public wrap<T extends Function>(fn: T): PromiseWrap<T> {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const queue = this
    return function(this: unknown, ...args: unknown[]) {
      return queue.call(() => fn.call(this, ...args) as Promise<unknown>)
    } as PromiseWrap<T>
  }

  /**
   * Get the maximum number of functions that can run concurrently. If the
   * concurrency is a function, it will be evaluated each time a function is
   * added to the queue.
   *
   * @returns The current concurrency value.
   */
  get concurrency() {
    return typeof this.internalConcurency === 'function'
      ? this.internalConcurency()
      : this.internalConcurency
  }

  /**
   * The time in milliseconds to wait before starting the next function once
   * a function has completed.
   *
   * @returns The current cooldown value.
   */
  get cooldown() {
    return typeof this.internalCooldown === 'function'
      ? this.internalCooldown()
      : this.internalCooldown
  }

  /**
   * @returns
   * The number of tasks currently in the queue. This includes tasks that are
   * running, cooling down, and waiting for their turn to run.
   */
  get length() {
    return this.tasks.length
  }

  /**
   * @returns
   * A promise that resolves when all tasks in the queue have completed.
   * Be aware that if this queue is busy, the promise may never resolve.
   */
  get done() {
    return new Promise<void>((resolve) => {
      if (this.tasks.length === 0) return resolve()
      const onComplete = () => {
        if (this.tasks.length > 0) return
        resolve()
        this.removeEventListener('complete', onComplete)
      }
      this.addEventListener('complete', onComplete)
    })
  }
}

/**
 * Instantiates a queue object that can be used to queue functions
 * and run them at a later time. This allows you to control the
 * concurrency of the executions and the cooldown between them.
 *
 * @param options The queue options
 * @returns The queue object
 */
export function createQueue(options: QueueOptions = {}): Queue {
  return new Queue(options)
}
