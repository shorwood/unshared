import { ComponentObjectPropsOptions, ExtractPropTypes, Prop, Ref, computed, getCurrentInstance, provide } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'

export const BASE_STATE_PROPS = {

  /**
   * The CSS class to apply when the component is disabled. This allows you
   * to customize the appearance of the component when it is disabled without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classDisabled': { default: '', type: [String] } as Prop<string>,

  /**
   * The CSS class to apply when the component is in an error state. This
   * allows you to customize the appearance of the component when it is in
   * an error state without handling the CSS in the component itself.
   *
   * @default ''
   */
  'classError': { default: '', type: [String] } as Prop<string>,

  /**
   * The CSS class to apply when the component is loading. This allows you
   * to customize the appearance of the component when it is loading without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classLoading': { default: '', type: [String] } as Prop<string>,

  /**
   * The CSS class to apply when the component is read-only. This allows you
   * to customize the appearance of the component when it is read-only without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classReadonly': { default: '', type: [String] } as Prop<string>,

  /**
   * If `true`, all interactions with the component should be disabled.
   * Meaning that the component should not be able to send any `click`,
   * `focus`, `hover`, or any other interaction event.
   *
   * @default false
   */
  'disabled': [Boolean],

  /**
   * If `true`, the component should be in an error state. Meaning that
   * the component should show an error message or a visual indication
   * that something went wrong.
   *
   * @default undefined
   */
  'error': [Error, String],

  /**
   * If `true`, the component should be in a loading state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'loading': [Boolean],
  'onUpdate:disabled': Function as Prop<(disabled: boolean) => void>,
  'onUpdate:error': Function as Prop<(error?: Error | string) => void>,
  'onUpdate:loading': Function as Prop<(loading: boolean) => void>,
  'onUpdate:readonly': Function as Prop<(readonly: boolean) => void>,

  /**
   * If `true`, the component should be in a read-only state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'readonly': [Boolean],
} satisfies ComponentObjectPropsOptions

/** The properties of the base state component. */
export type BaseStateProps = ExtractPropTypes<typeof BASE_STATE_PROPS>

/**
 * A composable that provides the base state for a component. This includes
 * handling the `disabled`, `readonly`, and `loading` states of the component
 * and applying the appropriate classes and attributes to the component.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseState(props: BaseStateProps) {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('useBaseState must be called within the `setup` function.')

  // --- Create two-way bindings for the properties.
  const { emit } = instance
  const loading = useVModel(props, 'loading', emit, { defaultValue: false, passive: true }) as Ref<boolean>
  const disabled = useVModel(props, 'disabled', emit, { defaultValue: false, passive: true }) as Ref<boolean>
  const readonly = useVModel(props, 'readonly', emit, { defaultValue: false, passive: true }) as Ref<boolean>
  const error = useVModel(props, 'error', emit, { passive: true }) as Ref<Error | string | undefined>

  // --- Dynamically compute classes.
  const classes = computed(() => ({
    [props.classDisabled ?? '']: disabled.value,
    [props.classError ?? '']: !!error.value,
    [props.classLoading ?? '']: loading.value,
    [props.classReadonly ?? '']: readonly.value,
  }))

  // --- Get the error message if it is an `Error` instance or a string.
  const errorMessage = computed(() => {
    if (error.value instanceof Error) return error.value.message
    if (typeof error.value === 'string') return error.value
    return
  })

  // --- Build the props object.
  const attributes = computed(() => ({
    'aria-busy': loading.value,
    'aria-disabled': disabled.value,
    'aria-errormessage': errorMessage.value,
    'aria-invalid': error.value,
    'aria-readonly': readonly.value,
    'class': classes.value,
    'disabled': disabled.value,
    'readonly': readonly.value,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, disabled, error, errorMessage, loading, readonly })
  provide('baseState', composable)
  return composable
}
