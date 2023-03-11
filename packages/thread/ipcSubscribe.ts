import { randomUUID } from 'node:crypto'
import { ipcPublish } from './ipcPublish'
import { IPCChannelId, IPCUnsubscribe } from './types'

/**
 * Subscribes to a channel and evaluates the callback function when a message is received.
 *
 * @param channelId The channel to subscribe to.
 * @param callback The callback function to evaluate when a message is received.
 * @returns A function to unsubscribe from the channel.
 */
export function ipcSubscribe<T>(channelId: IPCChannelId, callback: (data: T) => void): IPCUnsubscribe {
  if (typeof channelId !== 'string')
    throw new TypeError('Expected channel ID to be a string.')
  if (typeof callback !== 'function')
    throw new TypeError('Expected callback to be a function.')

  // --- Create a new channel and subscribe to it.
  const channel = new BroadcastChannel(channelId)
  channel.addEventListener('message', (event: MessageEvent) => callback(event.data ?? undefined))

  // --- Return an unsubscribe function.
  return () => channel.close()
}

/** c8 ignore next */
if (import.meta.vitest) {
  const channelId = randomUUID()

  it('should subscribe to a channel and receive a message', async() => {
    const payload = new Promise(resolve => ipcSubscribe(channelId, (...payload) => resolve(payload)))
    ipcPublish(channelId, 'Hello World')
    expect(payload).resolves.toEqual(['Hello World'])
  })

  it('should subscribe to a channel and receive undefined when no payload is provided', async() => {
    const payload = new Promise(resolve => ipcSubscribe(channelId, (...payload) => resolve(payload)))
    ipcPublish(channelId)
    expect(payload).resolves.toEqual([undefined])
  })

  it('should subscribe to a channel and receive multiple messages', async() => {
    let count = 0
    ipcSubscribe(channelId, () => count++)
    ipcPublish(channelId)
    ipcPublish(channelId)
    ipcPublish(channelId)
    await new Promise(resolve => setTimeout(resolve, 2))
    expect(count).toEqual(3)
  })

  it('should unsubscribe from a channel and stop receiving messages', async() => {
    let count = 0
    const unsubscribe = ipcSubscribe(channelId, () => count++)
    ipcPublish(channelId)
    ipcPublish(channelId)
    ipcPublish(channelId)
    await new Promise(resolve => setTimeout(resolve, 2))

    unsubscribe()
    ipcPublish(channelId)
    ipcPublish(channelId)
    ipcPublish(channelId)
    await new Promise(resolve => setTimeout(resolve, 2))
    expect(count).toEqual(3)
  })

  it('should throw an error when the channel ID is not a string', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => ipcSubscribe(123, () => {})
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error when the callback is not a function', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => ipcSubscribe(channelId, 123)
    expect(shouldThrow).toThrow(TypeError)
  })

  /** c8 ignore next */
  // it('should infer the payload type', async() => {
  //   ipcSubscribe<string>(channelId, (payload) => {
  //     expectTypeOf(payload).toEqualTypeOf<string>()
  //   })
  // })
}
