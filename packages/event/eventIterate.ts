/* eslint-disable sonarjs/cognitive-complexity */
import { EventEmitter } from 'node:events'
import { EventName } from '@unshared/types/EventName'

export interface IterateOptions<T extends EventEmitter = EventEmitter> {
  /**
   * The event to listen for to get the data. Each event will be yielding
   * back to the returned async iterable.
   *
   * @default 'data'
   * @example
   * const readStream = fs.createReadStream('file.txt')
   * const iterable = eventIterate(readStream, { event: 'data' })
   * for await (const chunk of iterable) { ... }
   */
  event?: EventName<T>
  /**
   * The event to listen for to stop listening. Once this event is emitted,
   * the async iterable will stop listening for events and will complete.
   *
   * @default 'end'
   * @example
   * const readStream = fs.createReadStream('file.txt')
   * const iterable = eventIterate(readStream, { stop: 'end' })
   * for await (const chunk of iterable) { ... }
   */
  eventStop?: EventName<T>
  /**
   * The event to listen to for errors. If this event is emitted, the async
   * iterable will stop listening for events and will throw an error.
   *
   * @default 'error'
   * @example
   * const readStream = fs.createReadStream('file.txt')
   * const iterable = eventIterate(readStream, { error: 'error' })
   * for await (const chunk of iterable) { ... }
   */
  eventError?: EventName<T>
  /**
   * The maximum number of events to listen for.
   *
   * @example
   * const readStream = fs.createReadStream('file.txt')
   * const iterable = eventIterate(readStream, { limit: 128 })
   * for await (const chunk of iterable) { ... }
   */
  limit?: number
}

/** A symbol used to mark the end of an event stream. */
const EventEndSymbol = Symbol('EventEndSymbol')

/**
 * Wraps an `EventEmitter` in an async iterable. The iterable will yield the
 * events emitted by the emitter and stop when the emitter emits the `end`
 *
 * This is useful to iterate over a stream, a socket, or any other type of
 * object that emits events and inherits from `EventEmitter`.
 *
 * @param emitter The EventEmitter to wrap.
 * @param options The options to use.
 * @returns An async iterable that yields the events emitted by the emitter.
 * @example
 * const readStream = fs.createReadStream('file.txt')
 * const chunks = streamIterate(readStream, { yielding: 'data', limit: 128 })
 * for await (const chunk of chunks) { ... }
 */
export function eventIterate<T extends EventEmitter>(emitter: T, options: IterateOptions<T>): AsyncIterableIterator<T>
/**
 * Wraps an `EventEmitter` in an async iterable. The iterable will yield the
 * events emitted by the emitter and stop when the emitter emits the `end`
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
export function eventIterate<T extends EventEmitter>(emitter: T, event: EventName<T>): AsyncIterableIterator<T>
export function eventIterate(emitter: EventEmitter, options: string | symbol | IterateOptions): AsyncIterableIterator<unknown> {
  // --- Destructure and default the options.
  if (emitter instanceof EventEmitter === false)
    throw new TypeError('The emitter must be an EventEmitter.')
  if ((typeof options !== 'object' && typeof options !== 'string') || options === null)
    throw new TypeError('The options must be an object or a string.')

  // --- Destructure and default the options.
  if (typeof options === 'string' || typeof options === 'symbol')
    options = { event: options }

  const {
    event = 'data',
    eventStop = 'end',
    eventError = 'error',
    limit = Number.POSITIVE_INFINITY,
  } = options as IterateOptions

  // --- Validate the options.
  if (typeof event !== 'string')
    throw new TypeError('The event name must be a string.')
  if (typeof eventStop !== 'string')
    throw new TypeError('The stop event name must be a string.')
  if (typeof eventError !== 'string')
    throw new TypeError('The error event name must be a string.')
  if (typeof limit !== 'number')
    throw new TypeError('The limit must be a number.')
  if (limit < 0)
    throw new RangeError('The limit must be a positive number.')

  // --- Create the async iterator.
  const iterator = async function*() {
    let iterationCount = 0

    // --- Iterate until the limit is reached or the emitter emits the stop event.
    while (iterationCount++ < limit) {
      const result = await new Promise((resolve, reject) => {
        emitter.once(<string>eventError, reject)
        emitter.once(<string>eventStop, () => resolve(EventEndSymbol))
        emitter.once(<string>event, resolve)
      })

      // --- If the event is the end symbol, stop iterating.
      // --- Otherwise, yield the event.
      if (result === EventEndSymbol) return
      yield result
    }
  }

  // --- Return the iterator.
  return iterator()
}

/* c8 ignore next */
if (import.meta.vitest) {
  // it('should iterate over an event emitter', async() => {
  //   const emitter = new EventEmitter()

  //   const emit = () => {
  //     emitter.emit('end')
  //   }

  //   const chunks: string[] = []
  //   const iterator = eventIterate(emitter, {})
  //   emit()
  //   for await (const chunk of iterator)
  //     console.log(chunk)

  //   expect(chunks).toEqual(['a', 'b', 'c'])
  // })
}
