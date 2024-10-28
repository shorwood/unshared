import type { Prop, Ref } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { computed, getCurrentInstance } from 'vue'
import { cleanAttributes } from './cleanAttributes'
import { cleanClasses } from './cleanClasses'

/** The properties of the base state component. */
export interface BaseStateOptions {

  /**
   * If `true`, all interactions with the component should be disabled.
   * Meaning that the component should not be able to send any `click`,
   * `focus`, `hover`, or any other interaction event.
   *
   * @default false
   */
  'disabled'?: boolean
  'onUpdate:disabled'?: (disabled: boolean) => void

  /**
   * If `true`, the component should be in an error state. Meaning that
   * the component should show an error message or a visual indication
   * that something went wrong.
   *
   * @default undefined
   */
  'error'?: Error | string
  'onUpdate:error'?: (error?: Error | string) => void

  /**
   * If `true`, the component should be in a loading state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'loading'?: boolean
  'onUpdate:loading'?: (loading: boolean) => void

  /**
   * If `true`, the component should be in a read-only state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'readonly'?: boolean
  'onUpdate:readonly'?: (readonly: boolean) => void

  /**
   * The CSS class to apply when the component is disabled. This allows you
   * to customize the appearance of the component when it is disabled without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classDisabled'?: string

  /**
   * The CSS class to apply when the component is in an error state. This
   * allows you to customize the appearance of the component when it is in
   * an error state without handling the CSS in the component itself.
   *
   * @default ''
   */
  'classError'?: string

  /**
   * The CSS class to apply when the component is loading. This allows you
   * to customize the appearance of the component when it is loading without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classLoading'?: string

  /**
   * The CSS class to apply when the component is read-only. This allows you
   * to customize the appearance of the component when it is read-only without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classReadonly'?: string
}

/** The properties of the composable returned by `useBaseState`. */
export interface BaseStateComposable {

  /** The HTML attributes to apply to the HTML element. */
  attributes: Record<string, unknown>

  /** The computed classes to apply to the HTML element. */
  classes: Record<string, boolean>

  /** The current value of the disabled state. */
  disabled: boolean

  /** The current value of the error state. */
  error: Error | string | undefined

  /** The current value of the error message. */
  errorMessage: string | undefined

  /** The current value of the loading state. */
  loading: boolean

  /** The current value of the read-only state. */
  readonly: boolean
}

/** The symbol to provide the composable into the component. */
export const BASE_STATE_SYMBOL = Symbol()

/** The properties of the base state component. */
export const BASE_STATE_OPTIONS = {
  'disabled': Boolean,
  'error': [Error, String],
  'loading': [Boolean],
  'readonly': [Boolean],
  'onUpdate:disabled': [Function, Array],
  'onUpdate:error': [Function, Array],
  'onUpdate:loading': [Function, Array],
  'onUpdate:readonly': [Function, Array],
  'classDisabled': String,
  'classError': String,
  'classLoading': String,
  'classReadonly': String,
} satisfies Record<keyof BaseStateOptions, Prop<unknown>>

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_STATE_SYMBOL]?: BaseStateComposable
  }
}

/**
 * A composable that provides the base state for a component. This includes
 * handling the `disabled`, `readonly`, and `loading` states of the component
 * and applying the appropriate classes and attributes to the component.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @param instance The internal instance of the component.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseState(props: BaseStateOptions = {}, instance = getCurrentInstance()): BaseStateComposable {
  if (instance?.[BASE_STATE_SYMBOL]) return instance[BASE_STATE_SYMBOL]

  // --- Create two-way bindings for the properties.
  const emit = instance?.emit
  const loading = useVModel(props, 'loading', emit, { passive: true }) as Ref<boolean>
  const disabled = useVModel(props, 'disabled', emit, { passive: true }) as Ref<boolean>
  const readonly = useVModel(props, 'readonly', emit, { passive: true }) as Ref<boolean>
  const error = useVModel(props, 'error', emit, { passive: true })

  // --- Dynamically compute classes.
  const classes = computed(() => cleanClasses({
    [props.classDisabled!]: disabled.value,
    [props.classError!]: !!error.value,
    [props.classLoading!]: loading.value,
    [props.classReadonly!]: readonly.value,
  }))

  // --- Get the error message if it is an `Error` instance or a string.
  const errorMessage = computed(() => {
    if (error.value instanceof Error) return error.value.message
    if (typeof error.value === 'string') return error.value
  })

  // --- Build the props object.
  const attributes = computed(() => cleanAttributes({
    'aria-busy': (props.loading || loading.value) ? true : undefined,
    'aria-invalid': (props.error || error.value) ? true : undefined,
    'aria-readonly': (props.readonly || readonly.value) ? true : undefined,
    'aria-disabled': (props.disabled || disabled.value) ? true : undefined,
    'aria-errormessage': errorMessage.value,
    'class': classes.value,
    'disabled': (props.disabled || disabled.value) ? true : undefined,
    'readonly': (props.readonly || readonly.value) ? true : undefined,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, disabled, error, errorMessage, loading, readonly })
  if (instance) instance[BASE_STATE_SYMBOL] = composable
  return composable
}
