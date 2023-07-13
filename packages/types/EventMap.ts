import { EventEmitter } from 'node:events'
import { ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { EventEmitterLike } from './EventEmitterLike'
import { Function } from './Function'
import { FunctionOverloads } from './FunctionOverloads'
import { TuplePop } from './TuplePop'
import { UnionMerge } from './UnionMerge'

/**
 * Infer the event map from an EventEmitter. This is useful for creating a
 * type-safe event map for the `eventMap` function.
 *
 * @template T The type of the EventEmitter.
 * @returns The event map for the EventEmitter.
 * @example EventMap<Readable> // { onData: (chunk: any) => void, onError: (error: Error) => void, onEnd: () => void, ... }
 */
export type EventMap<T extends EventEmitterLike = EventEmitterLike> =
  UnionMerge<Parameters<TuplePop<FunctionOverloads<T['on']>>[0][number]> extends infer V
    ? V extends [string | symbol, Function]
      ? { [P in V[0] as `on${Capitalize<string & V[0]>}`]: V[1] }
      : never : never>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the event map of Readable', () => {
    type Result = EventMap<Readable>
    interface expected {
      onData: (chunk: any) => void
      onError: (error: Error) => void
      onEnd: () => void
      onClose: () => void
      onPause: () => void
      onReadable: () => void
      onResume: () => void
    }
    expectTypeOf<Result>().toMatchTypeOf<expected>()
  })

  it('should infer the event map of ReadStream', () => {
    type Result = EventMap<ReadStream>
    interface expected {
      onEnd: () => void
      onError: (error: Error) => void
      onOpen: (fd: number) => void
      onPause: () => void
      onReadable: () => void
      onReady: () => void
      onResume: () => void
    }
    expectTypeOf<Result>().toMatchTypeOf<expected>()
  })

  it('should infer the event map of EventEmitter', () => {
    type Result = EventMap<EventEmitter>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })
}
