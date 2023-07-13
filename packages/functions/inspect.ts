import { EventEmitterLike } from '@unshared/types/EventEmitterLike'
import { EventEmitter } from './createEventEmitter'
import { toCamelCase } from '@unshared/string/toCamelCase'

/** The event types that can be emitted by the {@linkcode inspect} function. */
export type InspectEventTypes = 'accessed' | 'set' | 'deleted' | 'called' | 'returned' | 'thrown' | 'resolved' | 'rejected'

/** The options to use when wrapping an object with the {@linkcode inspect} function. */
export interface InspectOptions {
  /**
   * The event emitter to use. Defaults to a new `EventEmitter` instance.
   *
   * @default new EventEmitter()
   * @example
   * const emitter = new EventEmitter()
   * const object = { foo: 'bar' }
   * const wrapped = inspect(object, { emitter })
   */
  emitter?: EventEmitterLike
  /**
   * A function to generate the event name given the property name
   * and the event type.
   *
   * @default (property, type) => toCamelCase(property, type)
   * @example
   * const object = { foo: 'bar' }
   * const wrapped = inspect(object, { prefix: (property, type) => `_${type}_property` })
   * wrapped.on('_read_property', (value) => console.log(value)) // logs 'bar'
   */
  eventName?: (property: string, type: InspectEventTypes) => string
}

/**
 * Monitor every interaction with an object and emit events when they occur. This
 * function will emit events when a property is accessed, set, or deleted.
 * 
 * If the property is a function, then it will emit events when the function is
 * called, returned, or thrown.
 * 
 * If the property is a promise, then it will emit events when the promise is
 * resolved or rejected.
 * 
 * The event names are composed of the property name and the event type. The
 * event type. For example, if the property name is `foo` and the event type is
 * `accessed`, then the event name will be `fooAccessed`.
 *
 * @param object The object to wrap.
 * @param options The options to use.
 * @returns The wrapped object.
 * @example
 * const object = { foo: 'bar', baz: () => 'qux' }
 * const wrapped = inspect(object)
 * wrapped.on('fooRead', (value) => console.log(value)) // logs 'bar'
 * wrapped.on('bazCalled', (...args) => console.log(args)) // logs []
 * wrapped.on('bazReturned', (value) => console.log(value)) // logs 'qux'
 */
export function inspect<T extends object>(object: T, options: InspectOptions = {}): T & EventEmitterLike {
  const {
    emitter = new EventEmitter(),
    eventName = (property, type) => toCamelCase(property, type),
  } = options