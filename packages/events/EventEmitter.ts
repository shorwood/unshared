import { EventEmitter as EventEmitterNodeJS } from 'node:events'
import { EventListeners } from '@unshared/types/EventListeners'
import { EventNames } from '@unshared/types/EventNames'

/** Options for the `EventEmitter` class. */
export type EventEmitterOptions = ConstructorParameters<typeof EventEmitterNodeJS>[0]

/** Internal event listener type. Extended to include a `listener` property that points to the original listener. */
export type EventListenersInternal = EventListeners & { listener: EventListeners }

/**
 * This class is a light and simple browser-compatible implementation of the
 * Node.js `EventEmitter` class. It is used to create event emitters that
 * can be used to listen for and emit events.
 */
export class EventEmitter implements NodeJS.EventEmitter {
  constructor(private options: EventEmitterOptions = {}) {}

  /** The default number of listeners that can be assigned to an event. */
  static defaultMaxListeners = 10

  /** The maximum number of listeners that can be assigned to an event. */
  private maxListeners = EventEmitter.defaultMaxListeners

  /** The internal listeners object. */
  private internalListeners: Record<EventNames, EventListenersInternal[]> = {}

  public addListener(eventName: EventNames, listener: EventListeners): this {
    return this.on(eventName, listener)
  }

  public on(eventName: EventNames, listener: EventListeners): this {
    const handler = this.wrapListener(eventName, listener, false)
    this.internalListeners[eventName] = this.internalListeners[eventName] ?? []
    this.internalListeners[eventName].push(handler)
    return this
  }

  public once(eventName: EventNames, listener: EventListeners): this {
    const handler = this.wrapListener(eventName, listener, true)
    this.internalListeners[eventName] = this.internalListeners[eventName] ?? []
    this.internalListeners[eventName].push(handler)
    return this
  }

  public removeListener(eventName: EventNames, listener: EventListeners): this {
    const listeners = this.internalListeners[eventName]
    if (!listeners) return this
    const index = listeners.findIndex(l => l.listener === listener)
    if (index === -1) return this
    listeners.splice(index, 1)
    if (listeners.length === 0) delete this.internalListeners[eventName]
    return this
  }

  public off(eventName: EventNames, listener: EventListeners): this {
    return this.removeListener(eventName, listener)
  }

  public removeAllListeners(eventName?: EventNames): this {
    delete this.internalListeners[eventName]
    return this
  }

  public setMaxListeners(n: number): this {
    this.maxListeners = n
    return this
  }

  public getMaxListeners(): number {
    return this.maxListeners ?? EventEmitter.defaultMaxListeners
  }

  public listeners(eventName: EventNames): EventListeners[] {
    const listeners = this.internalListeners[eventName]
    return listeners ? listeners.map(l => l.listener) : []
  }

  public rawListeners(eventName: EventNames): EventListenersInternal[] {
    const listeners = this.internalListeners[eventName]
    return listeners ? [...listeners] : []
  }

  public emit(eventName: EventNames, ...args: unknown[]): boolean {
    const listeners = this.internalListeners[eventName]
    if (!listeners) return false
    for (const listener of listeners) {
      try {
        const result = listener(...args)
        if (this.options?.captureRejections && result instanceof Promise)
          result.catch(error => this.emit('error', error))
      }
      catch (error) {
        this.emit('error', error)
      }
    }
    return true
  }

  public listenerCount(eventName: EventNames): number {
    const listeners = this.internalListeners[eventName]
    return listeners ? listeners.length : 0
  }

  public prependListener(eventName: EventNames, listener: EventListeners): this {
    const handler = this.wrapListener(eventName, listener, false)
    this.internalListeners[eventName] = this.internalListeners[eventName] ?? []
    this.internalListeners[eventName].unshift(handler)
    return this
  }

  public prependOnceListener(eventName: EventNames, listener: EventListeners): this {
    const handler = this.wrapListener(eventName, listener, true)
    this.internalListeners[eventName] = this.internalListeners[eventName] ?? []
    this.internalListeners[eventName].unshift(handler)
    return this
  }

  public eventNames(): Array<EventNames> {
    return Object.keys(this.internalListeners)
  }

  /**
   * Wraps a handler function into a common object that can be used to remove the
   * listener by passing a reference to the original function.
   *
   * @param eventName The name of the event.
   * @param listener The handler function.
   * @param once Whether the handler should be removed after it has been called.
   * @returns An object containing the wrapped handler and a reference to the original function.
   */
  private wrapListener(eventName: EventNames, listener: EventListeners, once = false): EventListenersInternal {
    const handler: EventListenersInternal = (...args) => {
      const result = listener(...args)
      if (once) this.off(eventName, handler)
      return result
    }
    handler.listener = listener
    return handler
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should be able to emit events', async() => {
    const emitter = new EventEmitter()
    const handler = vi.fn()
    emitter.on('test', handler)
    emitter.emit('test')
    expect(handler).toBeCalledTimes(1)
  })

  it('should be able to emit events with arguments', async() => {
    const emitter = new EventEmitter()
    const handler = vi.fn()
    emitter.on('test', handler)
    emitter.emit('test', 1, 2, 3)
    expect(handler).toBeCalledWith(1, 2, 3)
  })

  it('should be able to emit events with promises', async() => {
    const emitter = new EventEmitter()
    const handler = vi.fn()
    emitter.on('test', handler)
    emitter.emit('test', Promise.resolve())
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(handler).toBeCalledTimes(1)
  })
}
