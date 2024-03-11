/* eslint-disable sonarjs/no-duplicate-string */
import { ReadStream, createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { Function, Overloads, TuplePop, UnionMerge } from '@unshared/types'
import { vol } from 'memfs'
import { EventEmitter, EventEmitterLike } from './createEventEmitter.js'

/**
 * Removes all event listeners that were added.
 *
 * @example
 * const readStream = createReadStream('file.txt')
 * const removeListeners = hook(readStream, { ... })
 * // ...
 * removeListeners()
 */
type RemoveListeners = () => void

/**
 * Infer the event map from an EventEmitter. This is useful for creating a
 * type-safe event map for the `eventMap` function.
 *
 * @template T The type of the EventEmitter.
 * @returns The event map for the EventEmitter.
 * @example EventMap<Readable> // { onData: (chunk: any) => void, onError: (error: Error) => void, onEnd: () => void, ... }
 */
export type EventMap<T extends EventEmitterLike = EventEmitterLike> =
  UnionMerge<Parameters<TuplePop<Overloads<T['on']>>[0][number]> extends infer V
    ? V extends [string | symbol, Function]
      ? { [P in V[0] as `on${Capitalize<V[0] & string>}`]: V[1] }
      : never : never>

/**
 * Hook onto the events emitted by an event emitter declaratively and returns
 * a function that removes all event listeners that were added. This allows you
 * to add multiple event listeners declaratively and remove them all at once
 * you're done.
 *
 * @param emitter The event emitter to add event listeners to.
 * @param events The map of event names to event handlers.
 * @returns A function that removes all event listeners that were added.
 * @example
 * // Create a stream.
 * const readStream = createReadStream('file.txt')
 *
 * // Add event listeners.
 * const removeListeners = hook(stream, {
 *   onEnd: () => console.log('end'),
 *   onData: (chunk) => console.log(chunk),
 *   onError: (error) => console.error(error),
 * })
 *
 * // Remove all event listeners when you're done.
 * removeListeners()
 */
export function hook<T extends EventEmitterLike>(emitter: T, events: Partial<EventMap<T>>): RemoveListeners {
  const listeners: Array<[string, Function]> = []

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
    const removeListeners = hook(emitter, { onEvent: callback })
    emitter.emit('event')
    expect(callback).toHaveBeenCalled()
    removeListeners()
  })

  it('should remove event listeners from an event emitter', async() => {
    const emitter = new EventEmitter()
    const callback = vi.fn()
    const removeListeners = hook(emitter, { onEvent: callback })
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
      removeListeners = hook(readStream, {
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
    hook(readStream, { onFoo: () => {} })
  })

  it('should infer the event map of Readable', () => {
    type Result = EventMap<Readable>
    interface expected {
      onData: (chunk: any) => void
      onError: (error: Error) => void
      onEnd: () => void
      onClose: () => void
      onPause: () => void
      onReadable: () => void
      onResume: () => void
    }
    expectTypeOf<Result>().toMatchTypeOf<expected>()
  })

  it('should infer the event map of ReadStream', () => {
    type Result = EventMap<ReadStream>
    interface expected {
      onEnd: () => void
      onError: (error: Error) => void
      onOpen: (fd: number) => void
      onPause: () => void
      onReadable: () => void
      onReady: () => void
      onResume: () => void
    }
    expectTypeOf<Result>().toMatchTypeOf<expected>()
  })

  it('should infer the event map of EventEmitter', () => {
    type Result = EventMap<EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })
}
