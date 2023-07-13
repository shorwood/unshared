/* eslint-disable sonarjs/no-duplicate-string */
import { createReadStream } from 'node:fs'
import { EventEmitter } from 'node:stream'
import { EventEmitterLike } from '@unshared/types/EventEmitterLike'
import { EventMap } from '@unshared/types/EventMap'
import { Function } from '@unshared/types/Function'
import { vol } from 'memfs'

/**
 * Removes all event listeners that were added.
 *
 * @example
 * const readStream = createReadStream('file.txt')
 * const removeListeners = eventListen(readStream, { ... })
 * // ...
 * removeListeners()
 */
type RemoveListeners = () => void

/**
 * Wraps a map of event names to event handlers and returns a function that
 * removes all event listeners that were added. This function provides an
 * altnative interface to `EventEmitter#on` and `EventEmitter#off`.
 *
 * @param emitter The event emitter to add event listeners to.
 * @param events The map of event names to event handlers.
 * @returns A function that removes all event listeners that were added.
 * @example
 * const readStream = createReadStream('file.txt')
 * const removeListeners = eventListen(readStream, {
 *   onEnd: () => console.log('end'),
 *   onData: (chunk) => console.log(chunk),
 *   onError: (error) => console.error(error),
 * })
 */
export function eventListen<T extends EventEmitterLike>(emitter: T, events: Partial<EventMap<T>>): RemoveListeners {
  const listeners: [string, Function][] = []

  // --- Add the event listeners.
  for (const key in events) {
    const eventName = key.replace(/^on([A-Z])/, (_, letter) => letter.toLowerCase())
    const listener = events[key] as Function
    emitter.on(eventName, listener)
    listeners.push([eventName, listener])
  }

  // --- Return a function that removes all event listeners.
  return () => {
    for (const [eventName, listener] of listeners)
      emitter.removeListener(eventName, listener)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should add event listeners to an event emitter', async() => {
    const emitter = new EventEmitter()
    const callback = vi.fn() as () => void
    const removeListeners = eventListen(emitter, { onEvent: callback })
    emitter.emit('event')
    expect(callback).toHaveBeenCalled()
    removeListeners()
  })

  it('should remove event listeners from an event emitter', async() => {
    const emitter = new EventEmitter()
    const callback = vi.fn()
    const removeListeners = eventListen(emitter, { onEvent: callback })
    removeListeners()
    emitter.emit('event')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add event listener to a ReadStream', async() => {
    vol.fromJSON({ '/file.txt': 'Hello World' })
    const readStream = createReadStream('/file.txt', 'utf8')
    let removeListeners: RemoveListeners | undefined
    const result = await new Promise<string>((resolve) => {
      let content = ''
      removeListeners = eventListen(readStream, {
        onEnd: () => resolve(content),
        onData: chunk => content += chunk,
      })
    })
    expect(result).toEqual('Hello World')
    removeListeners?.()
  })

  it('should match unknown event names', () => {
    vol.fromJSON({ '/file.txt': 'Hello World' })
    const readStream = createReadStream('/file.txt', 'utf8')
    // @ts-expect-error: should detect that the event name is invalid.
    eventListen(readStream, { onFoo: () => {} })
  })
}
