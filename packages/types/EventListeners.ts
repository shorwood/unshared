import { ReadStream } from 'node:fs'
import { EventEmitter, Readable } from 'node:stream'
import { EventEmitterLike } from './EventEmitterLike'
import { Fallback } from './Fallback'
import { Function } from './Function'
import { FunctionOverloads } from './FunctionOverloads'
import { MaybePromise } from './MaybePromise'
import { TuplePop } from './TuplePop'

/**
 * The event listeners that can be registered on an EventEmitter.
 *
 * @template T The type of the EventEmitter.
 * @returns The event listeners that can be registered on the EventEmitter.
 * @example EventEmitterListeners<Readable> // (chunk: any) => void | (error: Error) => void | () => void
 */
export type EventListeners<T extends EventEmitterLike = EventEmitterLike> =
  Fallback<Parameters<TuplePop<FunctionOverloads<T['on' | 'addListener']>>[0][number]>[1], Function<MaybePromise>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event listeners of Readable', () => {
    type Result = EventListeners<Readable>
    type Expected = (() => void) | ((chunk: string | Buffer) => void) | ((error: Error) => void) | ((fd: number) => void)
    expectTypeOf<Result>().toMatchTypeOf<Expected>()
  })

  it('should infer the event listeners of ReadStream', () => {
    type Result = EventListeners<ReadStream>
    type Expected = (() => void) | ((chunk: string | Buffer) => void) | ((error: Error) => void) | ((fd: number) => void)
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the event listeners of EventEmitter', () => {
    type Result = EventListeners<EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<Function<unknown>>()
  })

  it('should infer the event listeners of EventEmitterLike', () => {
    type Result = EventListeners<EventEmitterLike>
    expectTypeOf<Result>().toEqualTypeOf<Function<unknown>>()
  })

  it('should infer the event listeners of NodeJS.EventEmitter', () => {
    type Result = EventListeners<NodeJS.EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<Function<unknown>>()
  })
}
