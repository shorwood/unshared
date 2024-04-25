import { defineComponent, getCurrentInstance, onUnmounted } from 'vue'
import { createSharedComposable } from '@vueuse/core'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface EventMap {
  [key: string]: unknown[]
}

type EventCallback<T extends EventMap, K extends keyof T> =
  (...parameters: T[K]) => void

type Unsubscribe = () => void

export interface EventBus<T extends EventMap = EventMap> {
  /**
   * Emit a change event to notify the panel that the item being displayed has
   * been saved, updated, or deleted. This allows us to trigger a refresh of the
   * data in other components.
   *
   * @param eventName The name of the event to emit.
   * @param data The data to send with the event.
   */
  emit<K extends keyof T & string>(eventName: K, ...data: T[K]): void
  /**
   * Add a listener to the panel to listen for changes to the data being displayed.
   * This allows us to trigger a refresh of the data in other components.
   *
   * @param eventName The name of the event to listen for.
   * @param callback The callback to call when the event is emitted.
   * @returns The unsubscribe function.
   */
  listen<K extends keyof T & string>(eventName: K, callback: EventCallback<T, K>): Unsubscribe

  /**
   * The listener that will be used to emit events. This is an `EventTarget` that
   * will be shared across all components and will receive and emit events.
   */
  listener: EventTarget
}

/**
 * Create a shared event bus that can be used to emit and listen to events across
 * multiple components. This is useful when you need to communicate between components
 * that are not directly related to each other.
 *
 * @returns The event bus composable.
 * @example
 * ```html
 * <script setup>
 *   const { emit, listen } = useEventBus<{ foo: string, bar: string }>()
 *
 *   // Emit an event to notify every listener that something has happened.
 *   emit('foo', 'bar')
 *
 *   // Listen for an event from anywhere in the application.
 *   listen('bar', (value) => console.log(value))
 * </script>
 * ```
 */
export const useEventBus = createSharedComposable(<T extends EventMap>(): EventBus<T> => {
  const listener = new EventTarget()
  return {
    emit<K extends keyof T & string>(eventName: K, ...data: T[K]) {
      const event = new CustomEvent(eventName, { detail: data })
      listener.dispatchEvent(event)
    },

    listen<K extends keyof T & string>(eventName: K, callback: EventCallback<T, K>) {
      const callbackWrapped = (event: CustomEvent) => callback(...event.detail as T[K])
      listener.addEventListener(eventName, callbackWrapped as EventListener)

      // --- Return the unsubscribe function, call it anyway when the scope is disposed.
      const unsubscribe = () => listener.removeEventListener(eventName, callbackWrapped as EventListener)
      const instance = getCurrentInstance()
      if (instance) onUnmounted(unsubscribe, instance)
      return unsubscribe
    },

    listener,
  }
})

/* v8 ignore start */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { mount } = await import('@vue/test-utils')
  interface EventMap {
    [key: string]: unknown[]
    bar: [string]
    foo: [string]

  }

  describe('event', () => {
    it('should send and receive events', () => {
      const callback = vi.fn()
      const bus = useEventBus<{ bar: [string]; foo: [string] }>()
      bus.listen('foo', callback)
      bus.emit('foo', 'bar')
      expect(callback).toHaveBeenCalledWith('bar')
    })

    it('should unsubscribe from events', () => {
      const callback = vi.fn()
      const bus = useEventBus<{ bar: [string]; foo: [string] }>()
      const unsubscribe = bus.listen('foo', callback)
      unsubscribe()
      bus.emit('foo', 'bar')
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('component', () => {
    it('should unsubscribe when component is unmounted', () => {
      const callback = vi.fn()
      const bus = useEventBus<EventMap>()
      const wrapper = mount({
        setup: () => { bus.listen('foo', callback) },
        template: '<div></div>',
      })

      wrapper.unmount()
      bus.emit('foo', 'bar')
      expect(callback).not.toHaveBeenCalled()
    })

    it('should send and receive events within the same component', async() => {
      const callback = vi.fn()
      const wrapper = mount({
        setup: () => {
          const bus = useEventBus<EventMap>()
          bus.listen('foo', callback)
          return { onClick: () => bus.emit('foo', 'bar') }
        },
        template: '<div @click="onClick"></div>',
      })

      await wrapper.trigger('click')
      expect(callback).toHaveBeenCalledWith('bar')
    })

    it('should send and receive events across multiple components', async() => {
      const callback = vi.fn()
      const listener = defineComponent({
        setup: () => {
          const bus = useEventBus<EventMap>()
          bus.listen('foo', callback)
        },
        template: '<div></div>',
      })

      const emitter = defineComponent({
        setup: () => {
          const bus = useEventBus<EventMap>()
          return { onClick: () => bus.emit('foo', 'bar') }
        },
        template: '<button @click="onClick"></button>',
      })

      const parent = mount({
        components: { emitter, listener },
        template: '<div><listener /><emitter /></div>',
      })

      await parent.find('button').trigger('click')
      expect(callback).toHaveBeenCalledWith('bar')
    })
  })
}
