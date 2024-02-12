// eslint-disable-next-line unicorn/prevent-abbreviations
import { VNodeRef, onMounted, onScopeDispose, unref } from 'vue-demi'
import { MaybeRef as MaybeReference } from '../utils'

// TODO: Support multiple event names
// TODO: Support ref as event name

/**
 * Create a hook that listens to the events emitted outside the component.
 * @param element Element to use.
 * @param eventName Name of the event to listen to.
 * @param callback Callback to call when the event is emitted.
 */
export const useOutsideEvent = (eventName: string, callback: (event: Event) => void, element?: MaybeReference<HTMLElement | VNodeRef>) => {
  // --- Declare event handler.
  const handleOutsideEvent = (event: Event) => {
    // --- Get element
    let domElement = unref(element)
    if (typeof domElement !== 'object') return console.warn('[useOutsideEvent] Element is not a VNode or HTMLElement.')
    if (domElement.$el) domElement = domElement.$el as HTMLElement

    // --- Check if the event is outside the element.
    if (domElement === event.target) return
    if (domElement?.contains(event.target as any)) return
    callback(event)
  }

  // --- Declare register/unregister functions.
  const register = () => document.body.addEventListener(eventName, handleOutsideEvent)
  const unregister = () => document.body.removeEventListener(eventName, handleOutsideEvent)

  // --- Register/unregister outside event.
  onMounted(register)
  onScopeDispose(unregister)
}
