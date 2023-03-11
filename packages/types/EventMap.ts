import { ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { EventEmitter } from 'node:events'
import { TuplePop } from './TuplePop'
import { FunctionOverloads } from './FunctionOverloads'
import { UnionMerge } from './UnionMerge'

/**
 * Infer the event map from an EventEmitter. This is useful for creating a
 * type-safe event map for the `onEvents` function.
 *
 * @template T The type of the EventEmitter.
 * @returns The event map for the EventEmitter.
 * @example
 * EventMap<Readable> // { onData: (chunk: any) => void, onError: (error: Error) => void, onEnd: () => void, ... }
 */
export type EventMap<T extends EventEmitter = EventEmitter> =
  EventEmitter extends T
    ? Record<string, Function>
    : UnionMerge<Parameters<TuplePop<FunctionOverloads<T['on']>>[number]> extends infer V
      ? V extends [string | symbol, Function]
        ? { [P in V[0] as `on${Capitalize<string & V[0]>}`]: V[1] }
        : never : never>

/* c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event map of Readable', () => {
    type result = EventMap<Readable>
    expectTypeOf<result>().toMatchTypeOf<{
      onData: (chunk: any) => void
      onError: (error: Error) => void
      onEnd: () => void
      onClose: () => void
      onPause: () => void
      onReadable: () => void
      onResume: () => void
    }>()
  })

  it('should infer the event map of ReadStream', () => {
    type result = EventMap<ReadStream>
    expectTypeOf<result>().toMatchTypeOf<{
      onEnd: () => void
      onError: (error: Error) => void
      onOpen: (fd: number) => void
      onPause: () => void
      onReadable: () => void
      onReady: () => void
      onResume: () => void
    }>()
  })

  it('should return an empty object if no type is passed', () => {
    type result = EventMap<EventEmitter>
    expectTypeOf<result>().toEqualTypeOf<Record<string, Function>>()
  })
}
