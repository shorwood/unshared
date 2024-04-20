/* eslint-disable @typescript-eslint/unbound-method */
import { MaybeFunction } from '@unshared/types'
import { Function } from '@unshared/types/Function'
import { PromiseWrap } from '@unshared/types/PromiseWrap'
import { Awaitable, awaitable } from './awaitable'

export interface QueueTask<T = unknown> {
  /**
   * The queued function.
   */
  fn: Function<Promise<T> | T>
  /**
   * Is the task running?
   */
  isRunning: boolean
  /**
   * Abort the task.
   */
  cancel(): void
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
  concurency?: MaybeFunction<number>

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
    if (options.concurency) this.internalConcurency = options.concurency
    if (options.cooldown) this.internalCooldown = options.cooldown
    this.addEventListener('complete', () => {
      if (this.cooldown <= 0) return this.startNextTask()
      setTimeout(() => this.startNextTask(), this.cooldown)
    })
  }

  /** The maximum number of functions that can run concurrently. */
  protected internalConcurency: MaybeFunction<number> = 1

  /** The time in milliseconds to wait before starting the next function. */
  protected internalCooldown: MaybeFunction<number> = 0

  /**
   * An array of the queued functions.
   */
  protected tasks: QueueTask[] = []

  /**
   * The number of tasks that are currently running.
   */
  protected running = 0

  /**
   * The number of tasks that are currently waiting for their turn to run.
   */
  protected waiting = 0

  /**
   * Get the maximum number of functions that can run concurrently. If the
   * concurrency is a function, it will be evaluated each time a function is
   * added to the queue.
   *
   * @returns The current concurrency value.
   */
  get concurency() {
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
      fn,
      isRunning: false,
      cancel: () => this.dispatchTaskCancel(task),
      promise: new Promise<T>((resolve, reject) => {
        this.addEventListener('complete', (event) => {
          const { detail } = event as CustomEvent<{ task: QueueTask; value: T }>
          if (detail.task === task) resolve(detail.value)
        })
        this.addEventListener('error', (event) => {
          const { detail } = event as CustomEvent<{ task: QueueTask; error: Error }>
          if (detail.task === task) reject(detail.error)
        })
      }),
    }

    // --- Listen for the task to complete and resolve the promise with the result.
    this.tasks.push(task)
    this.startNextTask()
    return awaitable(task, task.promise)
  }

  /**
   * Check if the next task can be started and start it.
   *
   * @returns The result of the next task.
   */
  private startNextTask() {
    if (this.running >= this.concurency) return
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
    const event = new CustomEvent('error', { detail: { task, error } })
    this.running--
    this.tasks.shift()
    this.dispatchEvent(event)
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

/* v8 ignore start */
if (import.meta.vitest) {
  const { sleep } = await import('./sleep')
  const { nextTick } = await import('node:process')

  describe('run', () => {
    it('should queue a function and run it', async() => {
      const queue = createQueue()
      const task = vi.fn()
      await queue.call(task)
      expect(task).toHaveBeenCalled()
    })

    it('should queue a function and return the task object', () => {
      const queue = createQueue()
      const task = queue.call(Math.random)
      expect(task.isRunning).toEqual(true)
      expect(task.fn).toBeTypeOf('function')
      expectTypeOf(task).toEqualTypeOf<Awaitable<QueueTask<number>, number>>()
    })

    it('should queue a function and resolve the result', async() => {
      const queue = createQueue()
      const result = await queue.call(() => 'Hello World!')
      expect(result).toEqual('Hello World!')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should queue a function and reject with an error', async() => {
      const queue = createQueue()
      const shouldReject = queue.call(() => { throw new Error('Oops!') })
      await expect(shouldReject).rejects.toThrow('Oops!')
    })

    it('should free the queue after a task is complete', async() => {
      const queue = createQueue()
      const task = vi.fn()
      await queue.call(task)
      expect(queue.length).toEqual(0)
    })

    it('should free the queue after a task is rejected', async() => {
      const queue = createQueue()
      const task = vi.fn(() => { throw new Error('Oops!') })
      await queue.call(task).catch(() => {})
      expect(queue.length).toEqual(0)
    })

    it('should abort a task that is not running and reject with an error', async() => {
      const queue = createQueue({ concurency: -1 })
      const task = queue.call(Math.random)
      task.cancel()
      await expect(task).rejects.toThrow('Task canceled')
    })
  })

  describe('wrap', () => {
    it('should wrap a function and queue it', () => {
      const queue = createQueue()
      const task = vi.fn()
      const wrapped = queue.wrap(task)
      expect(task).not.toHaveBeenCalled()
      wrapped()
      expect(task).toHaveBeenCalled()
    })

    it('should pass the arguments to the wrapped function', () => {
      const queue = createQueue()
      const task = vi.fn()
      const wrapped = queue.wrap(task)
      wrapped('Alice', 'Bob')
      expect(task).toHaveBeenCalledWith('Alice', 'Bob')
    })

    it('should preserve the `this` context', async() => {
      const queue = createQueue()
      const task = vi.fn(function(this: { value: number }) { return this.value })
      const wrapped = queue.wrap(task)
      const result = await wrapped.call({ value: 42 })
      expect(result).toEqual(42)
    })

    it('should infer the type of a wrapped syncronous function', () => {
      const fn = (a: number, b: string) => a + b.length
      const wrapped = createQueue().wrap(fn)
      expectTypeOf<typeof wrapped>().toEqualTypeOf<(a: number, b: string) => Promise<number>>()
    })

    it('should infer the type of a wrapped asyncronous function', () => {
      const fn = (a: number, b: string) => Promise.resolve(a + b.length)
      const wrapped = createQueue().wrap(fn)
      expectTypeOf<typeof wrapped>().toEqualTypeOf<(a: number, b: string) => Promise<number>>()
    })
  })

  describe('options', () => {
    it('should set the concurrency option with a number', () => {
      const queue = createQueue({ concurency: 4 })
      expect(queue.concurency).toEqual(4)
    })

    it('should set the concurrency option with a function', () => {
      const queue = createQueue({ concurency: () => 4 })
      expect(queue.concurency).toEqual(4)
    })

    it('should set the cooldown option with a number', () => {
      const queue = createQueue({ cooldown: 100 })
      expect(queue.cooldown).toEqual(100)
    })

    it('should set the cooldown option with a function', () => {
      const queue = createQueue({ cooldown: () => 100 })
      expect(queue.cooldown).toEqual(100)
    })
  })

  describe('concurrency', () => {
    it('should queue a function and run it after the previous one', async() => {
      vi.useFakeTimers()
      const queue = createQueue()
      const task1 = vi.fn(() => sleep(10))
      const task2 = vi.fn(() => sleep(10))
      void queue.call(task1)
      void queue.call(task2)
      expect(task1).toHaveBeenCalled()
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(25)
      await new Promise(nextTick)
      expect(task2).toHaveBeenCalled()
    })

    it('should run multiple functions concurrently', async() => {
      vi.useFakeTimers()
      const queue = createQueue({ concurency: 2 })
      const task1 = vi.fn(() => sleep(10))
      const task2 = vi.fn(() => sleep(10))
      const task3 = vi.fn(() => sleep(10))
      void queue.call(task1)
      void queue.call(task2)
      void queue.call(task3)
      expect(task1).toHaveBeenCalled()
      expect(task2).toHaveBeenCalled()
      expect(task3).not.toHaveBeenCalled()
      vi.advanceTimersByTime(25)
      await new Promise(nextTick)
      expect(task3).toHaveBeenCalled()
    })
  })

  describe('cooldown', () => {
    it('should wait before starting the next task', async() => {
      vi.useFakeTimers()
      const queue = createQueue({ cooldown: 10 })
      const task1 = vi.fn(() => sleep(10))
      const task2 = vi.fn(() => sleep(10))
      void queue.call(task1)
      void queue.call(task2)
      expect(task1).toHaveBeenCalled()
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(15)
      await new Promise(nextTick)
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(10)
      expect(task2).toHaveBeenCalled()
    })
  })
}