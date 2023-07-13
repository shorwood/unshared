/* eslint-disable sonarjs/cognitive-complexity */
import { createReadStream } from 'node:fs'
import { EventEmitter } from 'node:stream'
import { EventEmitterLike } from '@unshared/types/EventEmitterLike'
import { EventListener } from '@unshared/types/EventListener'
import { EventNames } from '@unshared/types/EventNames'
import { vol } from 'memfs'

export interface EventIterateOptions<T extends EventEmitterLike = EventEmitterLike, E extends EventNames<T> = EventNames<T>> {
  /**
   * The event to listen for to get the data. Each event will be yielded
   * back to the returned async iterable.
   *
   * @default 'data'
   */
  event?: E
  /**
   * The event to listen for to stop listening. Once this event is emitted,
   * the async iterable will stop listening for events and will complete.
   *
   * @default 'end'
   */
  eventStop?: EventNames<T>
  /**
   * The event to listen to for errors. If this event is emitted, the async
   * iterable will stop listening for events and will throw an error.
   *
   * @default 'error'
   */
  eventError?: EventNames<T>
  /**
   * The maximum number of events to listen for.
   *
   * @default Number.POSITIVE_INFINITY
   */
  limit?: number
}

export type EventIterateIterator<T extends EventEmitterLike, E extends EventNames<T>> =
  AsyncGenerator<Parameters<EventListener<T, E>>[0]>

/**
 * Listen to an event on an `EventEmitter` and yield the payload of the event
 * to the returned async iterable. The iterable will stop when the emitter
 * emits the event specified in the options. If the emitter emits the error
 * event, the iterable will throw an error.
 *
 * This is useful to iterate over a stream, a socket, or any other type of
 * object that emits events and inherits from `EventEmitter`.
 *
 * @param emitter The EventEmitter to wrap.
 * @param event The event to listen for.
 * @returns An async iterable that yields the events emitted by the emitter.
 * @example
 * const readStream = fs.createReadStream('file.txt')
 * const chunks = streamIterate(readStream, 'data')
 * for await (const chunk of chunks) { ... }
 */
export function eventIterate<T extends EventEmitterLike, E extends EventNames<T> = 'data'>(emitter: T, event?: E): EventIterateIterator<T, E>
/**
 * Listen to an event on an `EventEmitter` and yield the payload of the event
 * to the returned async iterable. The iterable will stop when the emitter
 * emits the event specified in the options. If the emitter emits the error
 * event, the iterable will throw an error.
 *
 * This is useful to iterate over a stream, a socket, or any other type of
 * object that emits events and inherits from `EventEmitter`.
 *
 * @param emitter The EventEmitter to wrap.
 * @param options The options to use.
 * @returns An async iterable that yields the events emitted by the emitter.
 * @example
 * const readStream = fs.createReadStream('file.txt')
 * const chunks = streamIterate(readStream, { event: 'data', limit: 128 })
 * for await (const chunk of chunks) { ... }
 */
export function eventIterate<T extends EventEmitterLike, E extends EventNames<T>>(emitter: T, options: EventIterateOptions<T, E>): EventIterateIterator<T, E>
export function eventIterate(emitter: EventEmitterLike, options: string | symbol | EventIterateOptions = 'data'): AsyncIterableIterator<unknown> {
  if (typeof options === 'string' || typeof options === 'symbol') options = { event: options }
  const {
    event = 'data',
    eventStop = 'end',
    eventError = 'error',
    limit = Number.POSITIVE_INFINITY,
  } = options as EventIterateOptions

  // --- Validate the options.
  if (limit < 0) throw new RangeError('The limit must be a positive number.')

  // --- Create the async iterator.
  const createIterator = async function*() {
    let index = 0
    let ended = false

    // --- Listen for the stop event.
    emitter.once(eventStop, () => ended = true)

    // --- Iterate until the limit is reached or the emitter emits the stop event.
    while (index++ < limit) {
      const result = await new Promise((resolve, reject) => {
        emitter.once(eventStop, resolve)
        emitter.once(eventError, reject)
        emitter.once(event, resolve)
      })

      // --- If the event is the end symbol, stop iterating.
      // --- Otherwise, yield the event.
      if (ended) return
      yield result
    }
  }

  // --- Return the iterator.
  return createIterator()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should iterate over the events of a ReadStream', async() => {
    vol.fromJSON({ '/file.txt': 'abc' })
    const readStream = createReadStream('/file.txt', { highWaterMark: 1 })
    const iterator = eventIterate(readStream, { event: 'data', eventStop: 'end' })
    const chunks: string[] = []
    for await (const chunk of iterator) chunks.push(<string>chunk)
    expect(chunks).toEqual(['a', 'b', 'c'])
    expectTypeOf(iterator).toEqualTypeOf<AsyncGenerator<string | Buffer>>()
  })

  it('should iterate over the events of a ReadStream with a limit', async() => {
    vol.fromJSON({ '/file.txt': 'abc' })
    const readStream = createReadStream('/file.txt', { highWaterMark: 1, autoClose: false })
    const iterator = eventIterate(readStream, { event: 'data', eventStop: 'end', limit: 2 })
    const chunks: string[] = []
    for await (const chunk of iterator) chunks.push(<string>chunk)
    expect(chunks).toEqual(['a', 'b'])
    expectTypeOf(iterator).toEqualTypeOf<AsyncGenerator<string | Buffer>>()
  })

  it('should used `end` as the default stop event', async() => {
    vol.fromJSON({ '/file.txt': 'abc' })
    const readStream = createReadStream('/file.txt', { highWaterMark: 1 })
    const iterator = eventIterate(readStream, 'data')
    const chunks: string[] = []
    for await (const chunk of iterator) chunks.push(<string>chunk)
    expect(chunks).toEqual(['a', 'b', 'c'])
    expectTypeOf(iterator).toEqualTypeOf<AsyncGenerator<Buffer>>()
  })

  it('should used `data` as the default event', async() => {
    vol.fromJSON({ '/file.txt': 'abc' })
    const readStream = createReadStream('/file.txt', { highWaterMark: 1 })
    const iterator = eventIterate(readStream)
    const chunks: string[] = []
    for await (const chunk of iterator) chunks.push(<string>chunk)
    expect(chunks).toEqual(['a', 'b', 'c'])
    expectTypeOf(iterator).toEqualTypeOf<AsyncGenerator<Buffer>>()
  })

  it('should listen to custom event names', async() => {
    const emitter = new EventEmitter()
    const iterator = eventIterate(emitter, { event: 'foo', eventStop: 'bar' })
    setTimeout(() => emitter.emit('foo', 'a'))
    setTimeout(() => emitter.emit('foo', 'b'))
    setTimeout(() => emitter.emit('bar'))
    const chunks: string[] = []
    for await (const chunk of iterator) chunks.push(chunk)
    expect(chunks).toEqual(['a', 'b'])
    expectTypeOf(iterator).toEqualTypeOf<AsyncGenerator>()
  })

  it('should reject an error when an error event is emitted', async() => {
    const emitter = new EventEmitter()
    const iterator = eventIterate(emitter)
    const error = new Error('foo')
    setTimeout(() => emitter.emit('error', error))
    const shouldReject = iterator.next()
    expect(shouldReject).rejects.toThrowError(error)
  })

  it('should reject an error when a custom error event is emitted', async() => {
    const emitter = new EventEmitter()
    const iterator = eventIterate(emitter, { eventError: 'foo' })
    const error = new Error('foo')
    setTimeout(() => emitter.emit('foo', error))
    const shouldReject = iterator.next()
    expect(shouldReject).rejects.toThrowError(error)
  })

  it('should throw an error if the limit is negative', () => {
    const shouldThrow = () => eventIterate(new EventEmitter(), { limit: -1 })
    expect(shouldThrow).toThrowError(RangeError)
  })
}
