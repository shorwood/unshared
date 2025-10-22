import type { MaybeArray } from '@unshared/unshared'
import type { Prop } from 'vue'
import type { BaseStateOptions } from './useBaseState'
import { toReactive } from '@vueuse/core'
import { computed, getCurrentInstance } from 'vue'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

/** The symbol to inject the base clickable composable. */
export const BASE_CLICKABLE_SYMBOL = Symbol('baseClickable')

/** The base clickable properties. */
export const BASE_CLICKABLE_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  label: [Number, String],
  onClick: [Function, Array],
  eager: Boolean,
} as Record<keyof BaseClickableOptions, Prop<unknown>>

/** The properties of the base clickable component. */
export interface BaseClickableOptions extends BaseStateOptions {

  /**
   * The label of the button. This is used to set the text content of the button
   * element as well as the `aria-labelledby` attribute for accessibility and SEO
   * purposes.
   *
   * @example 'Submit'
   */
  label?: number | string

  /**
   * The callback(s) to call when the component is clicked. This can be a single handler
   * function or an array of handler functions, each of which will be called when the
   * component is clicked.
   *
   * @example
   * // Single handler
   * onClick: (event) => { ... }
   *
   * // Multiple handlers
   * onClick: [
   *   (event) => { ... },
   *   (event) => { ... }
   * ]
   */
  onClick?: MaybeArray<(event: MouseEvent) => unknown>

  /**
   * If `true`, the click event will be triggered on mouse down instead of
   * the click event. This is useful for components that need to respond
   * to the click event immediately.
   *
   * If the application is running in a touch environment, the click event
   * will be used instead of the mouse down event.
   *
   * @default false
   */
  eager?: boolean
}

/** The composable properties returned by the `useBaseClickable` composable. */
export interface BaseClickableComposable {

  /** The HTML attributes to apply to the component. */
  attributes: Record<string, unknown>

  /** The method to call when the component is clicked. */
  onClick: (event: MouseEvent) => unknown
}

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_CLICKABLE_SYMBOL]?: BaseClickableComposable
  }
}

/**
 * A composable that provides the base clickable state and handling for a component.
 *
 * @param options The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns An object with the computed properties and methods to use in the clickable component.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseClickable(options: BaseClickableOptions = {}, instance = getCurrentInstance()): BaseClickableComposable {
  if (instance?.[BASE_CLICKABLE_SYMBOL]) return instance[BASE_CLICKABLE_SYMBOL]

  // --- Inject the base state composable to get the state properties.
  const state = useBaseState(options, instance)

  // --- Handle click event to make it update the loading state
  // --- and catch any error that might occur during the click event.
  function onClick(event: MouseEvent) {
    if (!options.onClick || state.disabled || state.readonly || state.loading) return
    try {
      state.error = undefined
      const handlers = Array.isArray(options.onClick) ? options.onClick : [options.onClick]
      const results = handlers.map(handler => handler(event))
      const promises = results.filter((result): result is Promise<unknown> => result instanceof Promise)
      if (promises.length > 0) {
        state.loading = true
        Promise.all(promises)
          .catch((error: Error) => state.error = error)
          .finally(() => state.loading = false)
      }
    }
    catch (error) {
      state.error = error as Error
    }
  }

  // --- Compute the name of the click event based on the eager click option.
  // --- If eager click is enabled, the click event will be triggered on mouse down.
  // --- Unless the application is running in a touch environment, then it will
  // --- default to the click event.
  const clickEvent = computed(() => {
    if (typeof globalThis === 'undefined') return 'onClick'
    if ('ontouchstart' in globalThis) return 'onClick'
    if (options.eager) return 'onMousedown'
    return 'onClick'
  })

  // --- Create the reactive attributes for the component.
  const attributes = computed(() => ({
    [clickEvent.value]: onClick,
    'aria-labelledby': options.label,
    'aria-live': 'assertive',
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, onClick })
  if (instance) instance[BASE_CLICKABLE_SYMBOL] = composable
  return composable
}
