import { ExtractPropTypes, Prop, computed, inject, provide } from 'vue'
import { toReactive } from '@vueuse/core'
import { throttle } from '@unshared/functions/throttle'
import { debounce } from '@unshared/functions/debounce'
import { BASE_STATE_PROPS, useBaseState } from './useBaseState'

export const BASE_CLICKABLE_PROPS = {
  ...BASE_STATE_PROPS,
  /**
   * The debounce time to wait before calling the `onClick` method. This is
   * used to debounce the click event and prevent multiple clicks from being
   * called in a short amount of time.
   *
   * @default 0
   */
  debounce: { default: 0, type: Number } as Prop<number>,
  /**
   * The callback to call when the component is clicked. This is used to
   * handle the click event of the component and should be called when the
   * component is clicked.
   *
   * @default false
   */
  onClick: Function as Prop<() => Promise<void> | void>,
  /**
   * The throttle time to wait before calling the `onClick` method. This is
   * used to throttle the click event and prevent multiple clicks from being
   * called in a short amount of time.
   *
   * @default 0
   */
  throttle: { default: 0, type: Number } as Prop<number>,
}

/** The properties of the base clickable component. */
export type BaseClickableProps = ExtractPropTypes<typeof BASE_CLICKABLE_PROPS>

/**
 * A composable that provides the base clickable state and handling for a component.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @returns An object with the computed properties and methods to use in the clickable component.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseClickable(props: BaseClickableProps) {
  const state = inject('baseState', useBaseState(props))

  // --- Handle click event to make it update the loading state
  // --- and catch any error that might occur during the click event.
  async function onClickRaw() {
    if (!props.onClick || state.disabled || state.readonly || state.loading) return
    try {
      state.loading = true
      state.error = undefined
      await props.onClick()
    }
    catch (error) {
      state.error = error as Error
    }
    finally {
      state.loading = false
    }
  }

  // --- Wrap function to handle loading state & catch error.
  const onClick = computed(() => {
    if (props.throttle && props.throttle > 0) return throttle(onClickRaw, props.throttle)
    if (props.debounce && props.debounce > 0) return debounce(onClickRaw, props.debounce)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return onClickRaw
  })

  // --- Create the reactive attributes for the component.
  const attributes = computed(() => ({
    onClick: () => onClick.value(),
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, onClick, onClickRaw })
  provide('baseClickable', composable)
  return composable
}
