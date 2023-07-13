import { ReadStream } from 'node:fs'
import { EventEmitter, Readable } from 'node:stream'
import { EventEmitterLike } from './EventEmitterLike'
import { Fallback } from './Fallback'
import { Overloads } from './Overloads'
import { TuplePop } from './TuplePop'

/**
 * The event names that can be emitted by an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event names that can be emitted by the EventEmitter.
 * @example EventEmitterEvents<Readable> // 'data' | 'end' | 'error'
 */
export type EventNames<T extends EventEmitterLike = EventEmitterLike> =
  Fallback<Parameters<TuplePop<Overloads<T['on']>>[0][number]>[0], string | symbol>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event names of Readable', () => {
    type Result = EventNames<Readable>
    type Expected = 'close' | 'data' | 'end' | 'error' | 'pause' | 'readable' | 'resume'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the event names of ReadStream', () => {
    type Result = EventNames<ReadStream>
    type Expected = 'close' | 'data' | 'end' | 'error' | 'pause' | 'readable' | 'resume' | 'open' | 'ready'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the event names of EventEmitter', () => {
    type Result = EventNames<EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<string | symbol>()
  })

  it('should infer the event names of EventEmitterLike', () => {
    type Result = EventNames<EventEmitterLike>
    expectTypeOf<Result>().toEqualTypeOf<string | symbol>()
  })

  it('should infer the event names of NodeJS.EventEmitter', () => {
    type Result = EventNames<NodeJS.EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<string | symbol>()
  })
}
