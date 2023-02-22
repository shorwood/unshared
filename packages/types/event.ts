import EventEmitter from 'node:events'
import { ReadStream } from 'node:fs'
import { Readable } from 'node:stream'

/**
 * The event names that can be emitted by an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event names that can be emitted by the EventEmitter.
 * @example EventEmitterEvents<Readable> // 'data' | 'end' | 'error'
 */
export type EventEmitterEvents<T extends EventEmitter> =
  T extends { emit: (event: Exclude<infer E, string | symbol>, ...args: any[]) => boolean } ? E :
    never

/**
 * The event listeners that can be registered on an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event listeners that can be registered on the EventEmitter.
 * @example EventEmitterListeners<Readable> // (chunk: any) => void | (error: Error) => void | () => void
 */
export type EventEmitterListeners<T extends EventEmitter, E extends EventEmitterEvents<T> = EventEmitterEvents<T>> =
  T extends { on: (event: E, listener: infer L) => void } ? L :
    T extends { off: (event: E, listener: infer L) => void } ? L :
      T extends { once: (event: E, listener: infer L) => void } ? L :
        T extends { addListener: (event: E, listener: infer L) => void } ? L :
          T extends { addEventListener: (event: E, listener: infer L) => void } ? L :
            T extends { removeListener: (event: E, listener: infer L) => void } ? L :
              T extends { removeEventListener: (event: E, listener: infer L) => void } ? L :
                never

/* c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event names of Readable', () => {
    type ReadableEvents = EventEmitterEvents<ReadStream>
    expectTypeOf<ReadableEvents>().toEqualTypeOf<'data' | 'end' | 'error'>()
  })

  it('should infer the event listeners of Readable', () => {
    type ReadableListeners = EventEmitterListeners<Readable>
    const readableListeners: ReadableListeners = (chunk: any) => {}
    expect(readableListeners).toEqual(expect.any(Function))
  })
}
