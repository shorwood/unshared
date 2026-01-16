/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { retry, Retry } from './retry'

describe('retry', () => {
  describe('retry', () => {
    beforeAll(() => {
      vi.useFakeTimers()
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    it('should call the function and return the result on success', async() => {
      const fn = vi.fn<() => Promise<string>>().mockResolvedValue('success')
      const retried = retry(fn)
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass parameters to the function', async() => {
      const fn = vi.fn<(...args: string[]) => Promise<string>>().mockResolvedValue('success')
      const retried = retry(fn)
      const promise = retried('arg1', 'arg2')
      await vi.runAllTimersAsync()
      await promise
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should retry the function on failure', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100 })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw after exhausting all retries', async() => {
      const error = new Error('always fails')
      const fn = vi.fn<() => Promise<unknown>>().mockImplementation(async() => { throw error })
      const retried = retry(fn, { retries: 2, delay: 100 })
      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught).toBe(error)
      expect(fn).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
    })

    it('should use exponential backoff by default', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100 })
      const promise = retried()

      // First attempt fails immediately
      await vi.advanceTimersByTimeAsync(0)
      expect(fn).toHaveBeenCalledTimes(1)

      // After 200ms (100 * 2^1), second attempt
      await vi.advanceTimersByTimeAsync(200)
      expect(fn).toHaveBeenCalledTimes(2)

      // After 400ms (100 * 2^2), third attempt
      await vi.advanceTimersByTimeAsync(400)
      expect(fn).toHaveBeenCalledTimes(3)

      await promise
    })

    it('should use linear backoff when specified', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, backoff: 'linear' })
      const promise = retried()

      await vi.advanceTimersByTimeAsync(0)
      expect(fn).toHaveBeenCalledTimes(1)

      // After 100ms (100 * 1), second attempt
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(2)

      // After 200ms (100 * 2), third attempt
      await vi.advanceTimersByTimeAsync(200)
      expect(fn).toHaveBeenCalledTimes(3)

      await promise
    })

    it('should use constant delay when specified', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, backoff: 'constant' })
      const promise = retried()

      // First attempt
      await vi.advanceTimersByTimeAsync(0)
      expect(fn).toHaveBeenCalledTimes(1)

      // After 100ms, second attempt
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(2)

      // After another 100ms, third attempt
      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(3)

      await promise
    })

    it('should use custom backoff function', async() => {
      const backoff = vi.fn((attempt: number) => attempt * 50)
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, backoff })
      const promise = retried()

      await vi.advanceTimersByTimeAsync(0)
      await vi.advanceTimersByTimeAsync(50) // 1 * 50
      await vi.advanceTimersByTimeAsync(100) // 2 * 50

      await promise
      expect(backoff).toHaveBeenCalledWith(1, 100)
      expect(backoff).toHaveBeenCalledWith(2, 100)
    })

    it('should respect maxDelay option', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 1000, backoff: 'exponential', maxDelay: 500 })
      const promise = retried()

      await vi.advanceTimersByTimeAsync(0)
      // Would be 2000ms but capped at 500ms
      await vi.advanceTimersByTimeAsync(500)
      expect(fn).toHaveBeenCalledTimes(2)

      await vi.advanceTimersByTimeAsync(500)
      expect(fn).toHaveBeenCalledTimes(3)

      await promise
    })

    it('should call onRetry callback before each retry', async() => {
      const onRetry = vi.fn<(context: Retry.Context) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail1'))
        .mockRejectedValueOnce(new Error('fail2'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, onRetry })
      const promise = retried()

      await vi.runAllTimersAsync()
      await promise

      expect(onRetry).toHaveBeenCalledTimes(2)
      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 1,
        attemptsLeft: 3,
        error: expect.objectContaining({ message: 'fail1' }),
      }))
      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 2,
        attemptsLeft: 2,
        error: expect.objectContaining({ message: 'fail2' }),
      }))
    })

    it('should stop retrying when shouldRetry returns false', async() => {
      const error = new Error('fail')
      const fn = vi.fn<() => Promise<unknown>>().mockImplementation(async() => { throw error })
      const shouldRetry = vi.fn<(context: Retry.Context) => boolean>().mockReturnValueOnce(true).mockReturnValue(false)
      const retried = retry(fn, { retries: 5, delay: 100, shouldRetry })
      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })

      await vi.runAllTimersAsync()
      await promise
      expect(caught).toBe(error)

      expect(fn).toHaveBeenCalledTimes(2) // 1 initial + 1 retry (stopped on second)
    })

    it('should timeout and retry when timeout is exceeded', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 10000)))
        .mockResolvedValue('success')
      const retried = retry(fn, { timeout: 100, delay: 50 })
      const promise = retried()
      await vi.advanceTimersByTimeAsync(100) // Trigger timeout
      await vi.advanceTimersByTimeAsync(50) // Wait for retry delay
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should preserve the `this` context of the function', async() => {
      const context = { value: 42 }
      const fn = vi.fn(function(this: typeof context) { return Promise.resolve(this.value) })
      const retried = retry(fn)
      const promise = retried.call(context)
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe(42)
    })

    it('should convert non-Error throws to Error instances', async() => {
      const onRetry = vi.fn<(context: Retry.Context) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce('string error')
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, onRetry })
      const promise = retried()

      await vi.runAllTimersAsync()
      await promise

      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ message: 'string error' }),
      }))
    })

    it('should work with zero retries', async() => {
      const error = new Error('fail')
      const fn = vi.fn<() => Promise<unknown>>().mockImplementation(async() => { throw error })
      const retried = retry(fn, { retries: 0 })
      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught).toBe(error)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call onSuccess callback when function succeeds', async() => {
      const onSuccess = vi.fn<(context: { attempt: number; elapsed: number }) => void>()
      const fn = vi.fn<() => Promise<string>>().mockResolvedValue('success')
      const retried = retry(fn, { onSuccess })
      const promise = retried()
      await vi.runAllTimersAsync()
      await promise
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 1,
        elapsed: expect.any(Number),
      }))
    })

    it('should call onSuccess with correct attempt after retries', async() => {
      const onSuccess = vi.fn<(context: { attempt: number; elapsed: number }) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, onSuccess })
      const promise = retried()
      await vi.runAllTimersAsync()
      await promise
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 3,
      }))
    })

    it('should call onFailure callback when all retries exhausted', async() => {
      const onFailure = vi.fn<(context: Retry.Context) => void>()
      const error = new Error('always fails')
      const fn = vi.fn<() => Promise<unknown>>().mockImplementation(async() => { throw error })
      const retried = retry(fn, { retries: 2, delay: 100, onFailure })
      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught).toBe(error)
      expect(onFailure).toHaveBeenCalledTimes(1)
      expect(onFailure).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 3,
        attemptsLeft: 0,
        error,
      }))
    })

    it('should only retry on errors matching retryOn string', async() => {
      const fn = vi.fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, retryOn: 'network' })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not retry on errors not matching retryOn string', async() => {
      const error = new Error('auth error')
      const fn = vi.fn<() => Promise<unknown>>().mockImplementation(async() => { throw error })
      const retried = retry(fn, { delay: 100, retryOn: 'network' })
      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught).toBe(error)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should only retry on errors matching retryOn regex', async() => {
      const fn = vi.fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new Error('Error 500: Server Error'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, retryOn: /5\d{2}/ })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should only retry on errors matching retryOn error class', async() => {
      const fn = vi.fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new TypeError('type error'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, retryOn: TypeError })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should only retry on errors matching retryOn predicate', async() => {
      const fn = vi.fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new Error('retryable'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, retryOn: error => error.message.includes('retryable') })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should retry on any errors matching retryOn array', async() => {
      const fn = vi.fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new TypeError('type error'))
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, retryOn: [TypeError, 'network'] })
      const promise = retried()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should respect minDelay option', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 50, minDelay: 200 })
      const promise = retried()

      await vi.advanceTimersByTimeAsync(0)
      expect(fn).toHaveBeenCalledTimes(1)

      // Should wait minDelay (200ms) not the calculated delay
      await vi.advanceTimersByTimeAsync(150)
      expect(fn).toHaveBeenCalledTimes(1) // Still waiting

      await vi.advanceTimersByTimeAsync(50)
      expect(fn).toHaveBeenCalledTimes(2) // Now called

      await promise
    })

    it('should provide elapsed time in context', async() => {
      const onRetry = vi.fn<(context: Retry.Context) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, onRetry })
      const promise = retried()
      await vi.runAllTimersAsync()
      await promise
      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        elapsed: expect.any(Number),
      }))
    })

    it('should provide nextDelay in context', async() => {
      const onRetry = vi.fn<(context: Retry.Context) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { delay: 100, onRetry })
      const promise = retried()
      await vi.runAllTimersAsync()
      await promise
      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        nextDelay: 200, // 100 * 2^1
      }))
    })

    it('should abort when signal is aborted', async() => {
      const controller = new AbortController()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      const retried = retry(fn, { signal: controller.signal, delay: 100 })

      // Abort before the retry delay completes
      controller.abort()

      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught?.name).toBe('AbortError')
    })

    it('should not retry when signal is pre-aborted', async() => {
      const controller = new AbortController()
      controller.abort() // Pre-abort
      const fn = vi.fn<() => Promise<string>>().mockResolvedValue('success')
      const retried = retry(fn, { signal: controller.signal })

      let caught: Error | undefined
      const promise = retried().catch((error: Error) => { caught = error })
      await vi.runAllTimersAsync()
      await promise
      expect(caught?.name).toBe('AbortError')
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('Retry', () => {
    beforeAll(() => {
      vi.useFakeTimers()
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    it('should retry the method on failure', async() => {
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')

      class ApiClient {
        @Retry({ delay: 100 })
        async fetch() { return fn() }
      }

      const client = new ApiClient()
      const promise = client.fetch()
      await vi.runAllTimersAsync()
      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should preserve method context', async() => {
      class ApiClient {
        baseUrl = 'https://api.example.com'

        @Retry()
        async getUrl() { return this.baseUrl }
      }

      const client = new ApiClient()
      const promise = client.getUrl()
      await vi.runAllTimersAsync()
      const result = await promise

      expect(result).toBe('https://api.example.com')
    })

    it('should pass method arguments', async() => {
      const fn = vi.fn<(url: string, options: { method: string }) => Promise<string>>().mockResolvedValue('success')

      class ApiClient {
        @Retry()
        async fetch(url: string, options: { method: string }) { return fn(url, options) }
      }

      const client = new ApiClient()
      const promise = client.fetch('/users', { method: 'GET' })
      await vi.runAllTimersAsync()
      await promise

      expect(fn).toHaveBeenCalledWith('/users', { method: 'GET' })
    })

    it('should create separate retry instances per class instance', async() => {
      const fn1 = vi.fn<() => Promise<string>>().mockResolvedValue('result1')
      const fn2 = vi.fn<() => Promise<string>>().mockResolvedValue('result2')

      class ApiClient {
        constructor(private readonly fn: () => Promise<string>) {}

        @Retry()
        async fetch() { return this.fn() }
      }

      const client1 = new ApiClient(fn1)
      const client2 = new ApiClient(fn2)

      const promise1 = client1.fetch()
      const promise2 = client2.fetch()
      await vi.runAllTimersAsync()

      expect(await promise1).toBe('result1')
      expect(await promise2).toBe('result2')
    })

    it('should throw TypeError when applied to non-method', () => {
      const shouldThrow = () => {
        // @ts-expect-error: Testing invalid decorator usage
        class ApiClient { @Retry() url = 'https://api.example.com' }
        return new ApiClient()
      }
      expect(shouldThrow).toThrow(TypeError)
    })

    it('should use custom retry options', async() => {
      const onRetry = vi.fn<(context: Retry.Context) => void>()
      const fn = vi.fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')

      class ApiClient {
        @Retry({ retries: 5, delay: 50, onRetry })
        async fetch() { return fn() }
      }

      const client = new ApiClient()
      const promise = client.fetch()
      await vi.runAllTimersAsync()
      await promise

      expect(onRetry).toHaveBeenCalledTimes(1)
    })
  })
})
