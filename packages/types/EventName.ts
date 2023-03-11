import EventEmitter from 'node:events'
import { Readable } from 'node:stream'
import { ReadStream } from 'node:fs'
import { TuplePop } from './TuplePop'
import { FunctionOverloads } from './FunctionOverloads'
import { Fallback } from './Fallback'

/**
 * The event names that can be emitted by an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event names that can be emitted by the EventEmitter.
 * @example EventEmitterEvents<Readable> // 'data' | 'end' | 'error'
 */
export type EventName<T extends EventEmitter = EventEmitter> =
  Fallback<Parameters<TuplePop<FunctionOverloads<T['on']>>[number]>[0], string | symbol>

/* c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event names of Readable', () => {
    type result = EventName<Readable>
    type expected = 'close' | 'data' | 'end' | 'error' | 'pause' | 'readable' | 'resume'
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should infer the event names of ReadStream', () => {
    type result = EventName<ReadStream>
    type expected = 'close' | 'data' | 'end' | 'error' | 'open' | 'pause' | 'readable' | 'ready' | 'resume'
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return the events of EventEmitter if no type is passed', () => {
    type result = EventName<EventEmitter>
    expectTypeOf<result>().toEqualTypeOf<string | symbol>()
  })
}
