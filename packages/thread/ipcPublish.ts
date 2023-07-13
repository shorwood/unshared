import { randomUUID } from 'node:crypto'
import { ipcSubscribe } from './ipcSubscribe'
import { IPCChannelId } from './types'

/**
 * Broadcasts a payload to all workers listening on the given channel.
 *
 * @param channelId The channel to send the payload to.
 * @param payload The payload to send.
 * @example
 * ipcSubscribe("foo", data => console.log(data)); // { hello: "world" }
 * ipcPublish("foo", { hello: "world" });
 */
export function ipcPublish(channelId: IPCChannelId, payload?: unknown): void {
  const channel = new BroadcastChannel(channelId)
  channel.postMessage(payload)
  channel.close()
}

/** c8 ignore next */
if (import.meta.vitest) {
  const channelId = randomUUID()

  it('should publish a message to a channel', async() => {
    const payload = new Promise(resolve => ipcSubscribe(channelId, resolve))
    ipcPublish(channelId, 'Hello World')
    expect(payload).resolves.toEqual('Hello World')
  })

  it('should publish undefined to a channel when no payload is provided', async() => {
    const payload = new Promise(resolve => ipcSubscribe(channelId, resolve))
    ipcPublish(channelId)
    expect(payload).resolves.toEqual(undefined)
  })

  it('should throw an error when the channel ID is not a string', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => ipcPublish(123)
    expect(shouldThrow).toThrowError('Channel ID must be a string')
  })
}
