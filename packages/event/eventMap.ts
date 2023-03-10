import { EventEmitter } from 'node:events'
import { createReadStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { EventMap } from '@unshared/types/EventMap'
import { Function } from '@unshared/types/Function'

/**
 * Removes all event listeners that were added.
 *
 * @example
 * const readStream = createReadStream('file.txt')
 * const removeListeners = eventMap(readStream, { ... })
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
 * const removeListeners = eventMap(readStream, {
 *   onEnd: () => console.log('end'),
 *   onData: (chunk) => console.log(chunk),
 *   onError: (error) => console.error(error),
 * })
 */
export function eventMap<T extends EventEmitter>(emitter: T, events: Partial<EventMap<T>>): RemoveListeners {
  if (emitter instanceof EventEmitter === false)
    throw new TypeError('Expected the emitter to be an EventEmitter')
  if (typeof events !== 'object' || events === null)
    throw new TypeError('Expected the events to be an object')

  // --- Create an array of event listeners so they can be removed later.
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
      emitter.off(eventName, listener)
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should add event listeners to an event emitter', async() => {
    const emitter = new EventEmitter()
    const callback = vi.fn()
    const removeListeners = eventMap(emitter, { onEvent: callback })
    emitter.emit('event')
    expect(callback).toHaveBeenCalled()
    removeListeners()
  })

  it('should remove event listeners from an event emitter', async() => {
    const emitter = new EventEmitter()
    const callback = vi.fn()
    const removeListeners = eventMap(emitter, { onEvent: callback })
    removeListeners()
    emitter.emit('event')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add event listener to a ReadStream', async() => {
    await writeFile('/file.txt', 'Hello World')
    const readStream = createReadStream('/file.txt', 'utf8')
    let removeListeners: RemoveListeners | undefined
    const result = await new Promise<string>((resolve) => {
      let content = ''
      removeListeners = eventMap(readStream, {
        onEnd: () => resolve(content),
        onData: chunk => content += chunk,
      })
    })
    expect(result).toEqual('Hello World')
    removeListeners?.()
  })

  it('should throw an error when the emitter is not an EventEmitter', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => eventMap({}, {})
    expect(shouldThrow).toThrowError('Expected the emitter to be an EventEmitter')
  })

  it('should throw an error when the events are not an object', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => eventMap(new EventEmitter(), true)
    expect(shouldThrow).toThrowError('Expected the events to be an object')
  })
}
