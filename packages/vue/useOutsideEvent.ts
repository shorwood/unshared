import { MaybeRef, onMounted, onScopeDispose, unref } from 'vue'

/**
 * Create a hook that listens to the events emitted outside the component.
 *
 * @param element Element to use.
 * @param eventName Name of the event to listen to.
 * @param callback Callback to call when the event is emitted.
 */
export function useOutsideEvent(element: MaybeRef<HTMLElement>, eventName: string, callback: (event: Event) => void) {

  // --- Declare event handler.
  const handleOutsideEvent = (event: Event) => {

    // --- Get element
    const domElement = unref(element)
    if (typeof domElement !== 'object') return console.warn('[useOutsideEvent] Element is not a VNode or HTMLElement.')

    // --- Check if the event is outside the element.
    if (domElement === event.target) return
    if (domElement?.contains(event.target as Node)) return
    callback(event)
  }

  // --- Declare register/unregister functions.
  const register = () => document.body.addEventListener(eventName, handleOutsideEvent)
  const unregister = () => document.body.removeEventListener(eventName, handleOutsideEvent)

  // --- Register/unregister outside event.
  onMounted(register)
  onScopeDispose(unregister)
}

/* v8 ignore start */
//
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { ref } = await import('vue')
  const { mount } = await import('@vue/test-utils')

  test('should call the callback when the event is emitted outside the element', () => {
    const callback = vi.fn()
    mount({
      template: '<div ref="element"></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    document.body.click()
    expect(callback).toHaveBeenCalledOnce()
  })

  test('should not call the callback when the event is emitted from the element', () => {
    const callback = vi.fn()
    const wrapper = mount({
      template: '<div ref="element"></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    wrapper.find('div').element.click()
    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback when the event is emitted inside the element', () => {
    const callback = vi.fn()
    const wrapper = mount({
      template: '<div ref="element"><button></button></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    wrapper.find('button').element.click()
    expect(callback).not.toHaveBeenCalled()
  })
}
