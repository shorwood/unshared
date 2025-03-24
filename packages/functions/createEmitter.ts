export type EmitterEvents = Record<string, any[]>

export class EmitterEvent<T extends any[] = any[]> extends Event {
  constructor(type: string, public payload: T) {
    super(type)
  }
}

/**
 * An event emitter that can be used to dispatch events and listen for them. The
 * emitter is used to create a custom event system that can be used to communicate
 * between different parts of the application.
 */
export class Emitter<T extends EmitterEvents> {

  /** The event target that is used to dispatch events. */
  private eventTarget = new EventTarget()

  /** The event handlers that are currently active. */
  public eventListeners: Array<[keyof T & string, EventListener]> = []

  /**
   * Add a listener for the specified event. The listener will be called whenever
   * the event is dispatched. The listener receives the data that is passed to the
   * `dispatch` method as arguments.
   *
   * @param eventName The event to listen for.
   * @param listener The listener that is called when the event is dispatched.
   * @returns A function that can be called to remove the listener.
   * @example
   *
   * // Create a new emitter instance.
   * const emitter = new Emitter<{ 'data': [string, ...] }>()
   *
   * // Add a listener for the 'data' event.
   * emitter.on('data', (nodeId) => console.log(nodeId))
   *
   * // Dispatch the 'data' event.
   * emitter.dispatch('data', 'Hello, World !')
   * // 'Hello, World !'
   */
  on<K extends keyof T & string>(eventName: K, listener: (...payload: T[K]) => any) {
    const handler = ((event: EmitterEvent) => { listener(...event.payload as T[K]) }) as EventListener
    this.eventTarget.addEventListener(eventName, handler)
    this.eventListeners.push([eventName, handler])
    return () => this.eventTarget.removeEventListener(eventName, handler)
  }

  /**
   * Add a listener for the specified event. The listener will be called once when
   * the event is dispatched. The listener receives the data that is passed to the
   * `dispatch` method as arguments.
   *
   * @param eventName The event to listen for.
   * @param listener The listener that is called when the event is dispatched.
   * @returns A function that can be called to remove the listener.
   * @example
   *
   * // Create a new emitter instance.
   * const emitter = new Emitter<{ 'data': [string, ...] }>()
   *
   * // Add a listener for the 'data' event.
   * emitter.once('data', (nodeId) => console.log(nodeId))
   *
   * // Dispatch the 'data' event with a MouseEvent.
   * emitter.dispatch('data', 'Hello, World !')
   * // 'Hello, World !'
   */
  once<K extends keyof T & string>(eventName: K, listener: (...payload: T[K]) => any) {
    const handler = ((event: EmitterEvent) => {
      listener(...event.payload as T[K])
      this.eventTarget.removeEventListener(eventName, handler)
    }) as EventListener
    this.eventTarget.addEventListener(eventName, handler)
    this.eventListeners.push([eventName, handler])
    return () => this.eventTarget.removeEventListener(eventName, handler)
  }

  /**
   * Dispatch an event with the specified data. This will trigger all listeners
   * that are currently active for the event. The data is passed to the listener
   * as arguments.
   *
   * @param eventName The event to dispatch.
   * @param payload The payload that is passed to the listener.
   * @example
   *
   * // Create a new emitter instance.
   * const emitter = new Emitter<{ 'data': [string, ...] }>()
   *
   * // Add a listener for the 'data' event.
   * emitter.on('data', (nodeId) => console.log(nodeId))
   *
   * // Dispatch the 'data' event with a MouseEvent.
   * emitter.dispatch('data', 'Hello, World !')
   * // 'Hello, World !'
   */
  dispatch<K extends keyof T & string>(eventName: K, ...payload: T[K]) {
    const event = new EmitterEvent(eventName, payload)
    this.eventTarget.dispatchEvent(event)
  }

  /**
   * Remove all event listeners that are currently active. This will prevent any
   * listeners from being called when the event is dispatched.
   */
  clear() {
    for (const [event, handler] of this.eventListeners)
      this.eventTarget.removeEventListener(event, handler)
    this.eventListeners = []
  }

  /**
   * Remove all event listeners that are currently active. This will prevent any
   * listeners from being called when the event is dispatched.
   */
  [Symbol.dispose]() {
    this.clear()
  }
}

/**
 * Create a new emitter instance that can be used to dispatch and listen for events.
 *
 * @returns A new emitter instance.
 * @example
 *
 * // Create a new emitter instance.
 * const emitter = createEmitter()
 */
export function createEmitter<T extends EmitterEvents>() {
  return new Emitter<T>()
}
