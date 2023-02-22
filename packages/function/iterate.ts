import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'

export interface IterateOptions<T extends EventEmitter = EventEmitter> {
  /**
   * The event to listen for.
   *
   * @default 'data'
   */
  eventName?: Parameters<T['emit']>[0]
  /**
   * The event to listen for to stop listening.
   *
   * @default 'end'
   */
  eventNameStop?: Parameters<T['emit']>[0]
  /**
   * The event to listen to for errors.
   *
   * @default 'error'
   */
  eventNameError?: Parameters<T['emit']>[0]
  /**
   * The maximum number of events to listen for.
   *
   * @example 128
   */
  limit?: number
}

/** A symbol used to mark the end of an event stream. */
const eventEndSymbol = Symbol('EventEndSymbol')

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
 * const chunks = streamIterate(readStream, 'data')
 * for await (const chunk of chunks) { ... }
 */
export function iterate<T extends EventEmitter>(emitter: T, options: IterateOptions<T> = {}): AsyncIterableIterator<T> {
  // --- Destructure and default the options.
  const {
    eventName = 'data',
    eventNameStop = 'end',
    eventNameError = 'error',
    limit = Number.POSITIVE_INFINITY,
  } = options

  const iterator = async function*() {
    let iterationCount = 0

    // --- Iterate until the limit is reached or the emitter emits the stop event.
    while (iterationCount++ < limit) {
      const event = await new Promise<T | typeof eventEndSymbol>((resolve, reject) => {
        emitter.once(eventNameError, reject)
        emitter.once(eventNameStop, () => resolve(eventEndSymbol))
        emitter.once(eventName, resolve)
      })

      // --- If the event is the end symbol, stop iterating.
      // --- Otherwise, yield the event.
      if (event === eventEndSymbol) break
      yield event
    }
  }

  return iterator()
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should iterate over an event emitter', async() => {
    const emitter = new EventEmitter() as Readable

    const emit = () => {
      emitter.emit('data', 'a')
      emitter.emit('data', 'b')
      emitter.emit('data', 'c')
      emitter.emit('end')
    }

    const chunks: string[] = []
    const iterator = iterate(emitter, { eventName: '' })
    for await (const chunk of iterate(emitter))
      chunks.push(chunk)

    expect(chunks).toEqual([])
  })
}
