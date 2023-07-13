import { EventEmitter } from 'node:events'
import { ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { EventEmitterLike } from './EventEmitterLike'
import { EventNames } from './EventNames'
import { Function } from './Function'
import { FunctionOverloads } from './FunctionOverloads'

/** Find the listener that matches the event name and return it. */
type FindListenerByEventName<T extends Function[], E> =
  T extends [infer U, ...infer Rest extends Function[]]
    ? U extends (eventName: E, listener: infer L) => void ? L : FindListenerByEventName<Rest, E>
    : never

/**
 * The listener that matches the event name and event listener.
 *
 * @template T The type of the EventEmitter.
 * @template E The event name.
 * @returns The listener that matches the event name and event listener.
 * @example EventListener<Readable, 'data'> // (chunk: any) => void
 */
export type EventListener<T extends EventEmitterLike, E extends EventNames<T>> =
  FindListenerByEventName<FunctionOverloads<T['on']>, E>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extract the listener of Readable', () => {
    type Result = EventListener<Readable, 'data'>
    type Expected = (chunk: string | Buffer) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should extract the listener of ReadStream', () => {
    type Result = EventListener<ReadStream, 'data'>
    type Expected = (chunk: string | Buffer) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should extract the listener of EventEmitter', () => {
    type Result = EventListener<EventEmitter, 'data'>
    type Expected = (...args: any[]) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should extract the listener of EventEmitterLike', () => {
    type Result = EventListener<EventEmitterLike, 'data'>
    type Expected = (...args: any[]) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should extract the listener of NodeJS.EventEmitter', () => {
    type Result = EventListener<NodeJS.EventEmitter, 'data'>
    type Expected = (...args: any[]) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
