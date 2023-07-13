import { ipcPublish } from './ipcPublish'
import { ipcRespond } from './ipcRespond'
import { ipcSubscribe } from './ipcSubscribe'
import { IPCChannelId } from './types'

export interface IPCRequestOptions {
  /**
   * The timeout until the promise is rejected in milliseconds.
   *
   * @default 0
   */
  timeout?: number
  /**
   * Only listen for the response and do not send the request. Allows to listen for
   * responses from other processes without sending a request.
   *
   * @default false
   */
  stealthy?: boolean
}

/**
 * Request a message from an IPC and wait for a response.
 *
 * @param channelId The channel to send the payload to.
 * @param payload The payload to send.
 * @param options The timeout until the promise is rejected.
 * @returns A promise that resolves with the response.
 * @example
 * // Communication between workers
 * ipcRespond('HELLO_WHO', message => `Hello ${message}`);
 * ipcRequest('HELLO_WHO', 'John').then(console.log); // 'Hello John'
 *
 * // Handle errors
 * ipcRespond('ERROR', () => { throw new Error('Error!'); });
 * ipcRequest('ERROR').catch(console.error); // 'Error: Error!'
 */
export async function ipcRequest<T>(channelId: IPCChannelId, payload?: unknown, options: IPCRequestOptions = {}): Promise<T> {
  const { timeout = 0, stealthy = false } = options
  if (timeout < 0) throw new RangeError('Timeout must be a positive number')

  // --- Subscribe to the response channel and unsubscribe when the response is received.
  return await new Promise<T>((resolve, reject) => {
    const unsubscribe = ipcSubscribe<{ error: any; result: T }>(
      channelId,
      ({ error, result }) => {
        unsubscribe()
        if (error) reject(error)
        else resolve(result)
      },
    )

    // --- Publish a request event.
    if (!stealthy) ipcPublish(`${channelId}.request`, payload)

    // --- Reject the promise if the timeout is reached.
    if (timeout > 0) setTimeout(reject, timeout, `Request with channel ID "${channelId}" timed out`)
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should request a message from an IPC and wait for a response', async() => {
    const unsubscribe = ipcRespond('HELLO_WHO', message => `Hello ${message}`)
    const result = await ipcRequest('HELLO_WHO', 'John')
    expect(result).toEqual('Hello John')
    unsubscribe()
  })

  it('should only listen to the response channel', async() => {
    const unsubscribe = ipcRespond('HELLO_WHO', message => `Hello ${message}`)
    const result = ipcRequest('HELLO_WHO', 'John', { stealthy: true })
    ipcPublish('HELLO_WHO', { result: false })
    await expect(result).resolves.toEqual(false)
    unsubscribe()
  })

  it('should reject the promise if an error is thrown', async() => {
    const unsubscribe = ipcRespond('ERROR', () => { throw new TypeError('Error!') })
    const shouldReject = ipcRequest('ERROR')
    expect(shouldReject).rejects.toThrow(TypeError).then(unsubscribe)
  })

  it('should reject the promise if the timeout is reached', async() => {
    const shouldReject = ipcRequest('TIMEOUT', undefined, { timeout: 100 })
    expect(shouldReject).rejects.toThrow(Error)
  })

  it('should reject the promise if the channel ID is not a string', async() => {
    // @ts-expect-error: invalid argument type
    const shouldReject = ipcRequest(123)
    await expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should reject the promise if the timeout is not a number', async() => {
    // @ts-expect-error: invalid argument type
    const shouldReject = ipcRequest('TIMEOUT', undefined, { timeout: '100' })
    await expect(shouldReject).rejects.toThrow(TypeError)
  })

  it('should reject the promise if the timeout is negative', async() => {
    const shouldReject = ipcRequest('TIMEOUT', undefined, { timeout: -100 })
    await expect(shouldReject).rejects.toThrow(RangeError)
  })

  it('should infer the response type', async() => {
    const result = ipcRequest<string>('INFER', undefined, { timeout: 1 }).catch(() => {})
    expectTypeOf(result).toEqualTypeOf<Promise<string | void>>()
  })
}
