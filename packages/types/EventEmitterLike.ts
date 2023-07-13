import { EventEmitter } from 'node:events'

/** Matches both the constructor and the instance of the `EventEmitter` class. */
export type EventEmitterLike = EventEmitter | NodeJS.EventEmitter

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match the constructor of EventEmitter', () => {
    expectTypeOf<EventEmitterLike>().toEqualTypeOf<EventEmitter>()
  })

  it('should match the instance of EventEmitter', () => {
    expectTypeOf<EventEmitterLike>().toEqualTypeOf<NodeJS.EventEmitter>()
  })
}
