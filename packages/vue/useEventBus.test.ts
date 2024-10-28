import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useEventBus } from './useEventBus'

// @vitest-environment happy-dom
describe('useEventBus', () => {
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
})
