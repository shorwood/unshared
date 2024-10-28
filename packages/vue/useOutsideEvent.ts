import type { MaybeRef } from 'vue'
import { onMounted, onScopeDispose, unref } from 'vue'

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
