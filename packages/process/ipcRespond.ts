import { ipcPublish } from './ipcPublish'
import { ipcRequest } from './ipcRequest'
import { ipcSubscribe } from './ipcSubscribe'
import { IPCChannelId, IPCRequestHandler, IPCUnsubscribe } from './types'

/**
 * Responds to a request on a channel.
 *
 * @param channelId The channel to respond to.
 * @param handler The function to evaluate when a request is received.
 * @returns A function to unsubscribe from the channel.
 * @example
 * // Communication between workers
 * ipcRespond('HELLO_WHO', message => `Hello ${message}`);
 * ipcRequest('HELLO_WHO', 'John').then(console.log); // 'Hello John'
 *
 * // Handle errors
 * ipcRespond('ERROR', () => { throw new Error('Error!'); });
 * ipcRequest('ERROR').catch(console.error); // 'Error: Error!'
 */
export function ipcRespond<T, R>(channelId: IPCChannelId, handler?: IPCRequestHandler<T, R>): IPCUnsubscribe {
  return ipcSubscribe(`${channelId}.request`,
    async(data: T) => {
      try { ipcPublish(channelId, { result: await handler(data) }) }
      catch (error) { ipcPublish(channelId, { error }) }
    },
  )
}

/** c8 ignore start */
if (import.meta.vitest) {
  it('should respond to a request on a channel', async() => {
    const unsubscribe = ipcRespond('HELLO_WHO', message => `Hello ${message}`)
    const result = await ipcRequest('HELLO_WHO', 'John')
    expect(result).toEqual('Hello John')
    unsubscribe()
  })

  it('should reject the promise if an error is thrown', async() => {
    const unsubscribe = ipcRespond('ERROR', () => { throw new TypeError('Error!') })
    const shouldReject = () => ipcRequest('ERROR')
    expect(shouldReject).rejects.toThrow('Error!')
    unsubscribe()
  })

  it('should throw an error if the channel ID is not a string', () => {
    // @ts-expect-error: Invalid channel ID.
    const shouldThrow = () => ipcRespond(123, () => {})
    expect(shouldThrow).toThrow('Channel ID must be a string')
  })

  it('should throw an error if the handler is not a function', () => {
    // @ts-expect-error: Invalid handler.
    const shouldThrow = () => ipcRespond('HELLO', 123)
    expect(shouldThrow).toThrow('Handler must be a function')
  })
}
