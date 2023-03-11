import EventEmitter from 'node:events'
import { ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { Fallback } from './Fallback'
import { Function } from './Function'
import { FunctionOverloads } from './FunctionOverloads'
import { TuplePop } from './TuplePop'

/**
 * The event listeners that can be registered on an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event listeners that can be registered on the EventEmitter.
 * @example EventEmitterListeners<Readable> // (chunk: any) => void | (error: Error) => void | () => void
 */
export type EventListener<T extends EventEmitter = EventEmitter> =
  Fallback<Parameters<TuplePop<FunctionOverloads<T['on']>>[number]>[1], Function<void>>

/* c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event listeners of Readable', () => {
    type result = EventListener<Readable>
    expectTypeOf<result>().toMatchTypeOf<Function>()
  })

  it('should infer the event listeners of ReadStream', () => {
    type result = EventListener<ReadStream>
    expectTypeOf<result>().toMatchTypeOf<Function>()
  })

  it('should return the events of EventEmitter if no type is passed', () => {
    type result = EventListener<EventEmitter>
    expectTypeOf<result>().toEqualTypeOf<Function<void>>()
  })
}
