/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { Awaitable } from './awaitable'
import type { QueueTask } from './createQueue'
import { createQueue } from './createQueue'
import { sleep } from './sleep'

describe('createQueue', () => {
  describe('run', () => {
    it('should queue a function and run it', async() => {
      const queue = createQueue()
      const task = vi.fn()
      await queue.call(task)
      expect(task).toHaveBeenCalledWith()
    })

    it('should queue a function and return the task object', () => {
      const queue = createQueue()
      const task = queue.call(Math.random)
      expect(task.isRunning).toBe(true)
      expect(task.fn).toBeTypeOf('function')
      expectTypeOf(task).toEqualTypeOf<Awaitable<QueueTask<number>, number>>()
    })

    it('should queue a function and resolve the result', async() => {
      const queue = createQueue()
      const result = await queue.call(() => 'Hello World!')
      expect(result).toBe('Hello World!')
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
      expect(queue).toHaveLength(0)
    })

    it('should free the queue after a task is rejected', async() => {
      const queue = createQueue()
      const task = vi.fn(() => { throw new Error('Oops!') })
      await queue.call(task).catch(() => {})
      expect(queue).toHaveLength(0)
    })

    it('should abort a task that is not running and reject with an error', async() => {
      const queue = createQueue({ concurrency: -1 })
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
      expect(task).toHaveBeenCalledWith()
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
      expect(result).toBe(42)
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
      const queue = createQueue({ concurrency: 4 })
      expect(queue.concurrency).toBe(4)
    })

    it('should set the concurrency option with a function', () => {
      const queue = createQueue({ concurrency: () => 4 })
      expect(queue.concurrency).toBe(4)
    })

    it('should set the cooldown option with a number', () => {
      const queue = createQueue({ cooldown: 100 })
      expect(queue.cooldown).toBe(100)
    })

    it('should set the cooldown option with a function', () => {
      const queue = createQueue({ cooldown: () => 100 })
      expect(queue.cooldown).toBe(100)
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
      expect(task1).toHaveBeenCalledWith()
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(25)
      await new Promise(resolve => process.nextTick(resolve))
      expect(task2).toHaveBeenCalledWith()
    })

    it('should run multiple functions concurrently', async() => {
      vi.useFakeTimers()
      const queue = createQueue({ concurrency: 2 })
      const task1 = vi.fn(() => sleep(10))
      const task2 = vi.fn(() => sleep(10))
      const task3 = vi.fn(() => sleep(10))
      void queue.call(task1)
      void queue.call(task2)
      void queue.call(task3)
      expect(task1).toHaveBeenCalledWith()
      expect(task2).toHaveBeenCalledWith()
      expect(task3).not.toHaveBeenCalled()
      vi.advanceTimersByTime(25)
      await new Promise(resolve => process.nextTick(resolve))
      expect(task3).toHaveBeenCalledWith()
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
      expect(task1).toHaveBeenCalledWith()
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(15)
      await new Promise(resolve => process.nextTick(resolve))
      expect(task2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(10)
      expect(task2).toHaveBeenCalledWith()
    })
  })

  describe('done', () => {
    it('should resolve when all tasks are complete', async() => {
      vi.useFakeTimers()
      const queue = createQueue({ concurrency: 2 })
      const task1 = vi.fn(() => sleep(10))
      const task2 = vi.fn(() => sleep(10))
      void queue.call(task1)
      void queue.call(task2)
      const result = queue.done
      vi.advanceTimersByTime(15)
      await new Promise(resolve => process.nextTick(resolve))
      expect(task1).toHaveBeenCalledWith()
      expect(task2).toHaveBeenCalledWith()
      await expect(result).resolves.toBeUndefined()
    })

    it('should resolve immediately if the queue is empty', async() => {
      const queue = createQueue()
      const result = queue.done
      await expect(result).resolves.toBeUndefined()
    })
  })
})
