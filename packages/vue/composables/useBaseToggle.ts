import { Ref, computed, getCurrentInstance, provide } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'

export type ToggleType = 'checkbox' | 'radio' | 'switch'

export type ToggleValue<T, U extends ToggleType> =
  U extends 'switch' ? boolean :
    U extends 'checkbox' ? T[] :
      U extends 'radio' ? T :
        never

export interface BaseToggleProps<T, U extends ToggleType> {
  /**
   * The class to apply when the toggle is active. This allows you to customize
   * the appearance of the toggle when it is active without handling the CSS in
   * the component itself.
   *
   * @default undefined
   */
  classActive?: string
  /**
   * The class to apply when the toggle is inactive. This allows you to customize
   * the appearance of the toggle when it is inactive without handling the CSS in
   * the component itself.
   *
   * @default undefined
   */
  classInactive?: string
  /**
   * The model value of the toggle. This holds the current state of the toggle
   * and should be updated when the toggle is clicked.
   *
   * @default undefined
   */
  modelValue: ToggleValue<T, U>
  'onUpdate:modelValue'?: (value: ToggleValue<T, U>) => void
  /**
   * The type of the toggle. This can be either `checkbox`, `radio`, or `switch`.
   * This will determine how the toggle will behave when it is clicked.
   *
   * @default 'switch'
   */
  type?: U
  /**
   * The value to set or push when the toggle is active. This is only used when
   * the type of the toggle is either `checkbox` or `radio`. By default, it
   * will use the `key` of the current instance.
   *
   * @default useCurrentInstance().key
   */
  value?: U extends 'switch' ? never : T
}

export const BASE_TOGGLE_PROPS = {
  classActive: { default: '', type: [String] },
  classInactive: { default: '', type: [String] },
  modelValue: { default: undefined, type: [Boolean, Array, String, Number] },
  type: { default: 'switch', type: String },
  value: { default: undefined, type: [Boolean, Array, String, Number] },
}

/**
 * Create a toggle composable given the provided type. The composable will
 * return a corresponding `isActive` computed property and a `toggle` method
 * to handle the click event based on the provided type of toggle.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @returns The computed properties and methods to use in the toggle component.
 * @example
 * defineComponent({
 *   mixins: [BaseToggle],
 *   setup(props, context) {
 *     return useBaseToggle(props, context)
 *   }
 * })
 */
export function useBaseToggle<T, U extends ToggleType>(props: BaseToggleProps<T, U>) {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('useBaseToggle must be called within the `setup` function.')
  const { emit } = instance

  // --- Create a v-model for the provided options.
  // --- Default the `value` property to undefined if it is not provided.
  const value = computed(() => props.value ?? getCurrentInstance()?.props?.key)
  const model = useVModel(props, 'modelValue', emit, { passive: true }) as Ref<unknown>

  // --- Check if, based on the type, the model is active.
  const isActive = computed(() => {
    if (props.type === 'checkbox') return Array.isArray(model.value) && model.value.includes(value.value)
    if (props.type === 'radio') return model.value === props.value
    if (props.type === 'switch') return model.value === true as unknown
    return false
  })

  // --- Toggle the value based on it's type.
  // --- If the type is a radio, it will set the model to the provided value.
  // --- If the type is a switch, it will toggle the model between true and false.
  // --- If the type is a checkbox, it will push or remove the value from the model.
  function toggle() {
    if (props.type === 'switch') { model.value = !isActive.value; return }
    if (props.type === 'radio') { model.value = props.value; return }

    const isArray = Array.isArray(model.value)
    if (props.type === 'checkbox' && !isArray) { model.value = [props.value]; return }
    model.value = isActive.value
      ? [...model.value as unknown[]].filter(x => x !== props.value)
      : [...model.value as unknown[], props.value]
  }

  const classes = computed(() => ({
    [props.classActive!]: isActive.value,
    [props.classInactive!]: !isActive.value,
  }))

  // --- Properties to assign to the element.
  const attributes = computed(() => ({
    'aria-checked': props.type === 'radio' ? undefined : isActive.value,
    'aria-pressed': isActive.value,
    'aria-selected': props.type === 'radio' ? isActive.value : undefined,
    'class': classes.value || undefined,
    'onClick': toggle,
    'role': props.type === 'radio' ? 'radio' : 'checkbox',
    'tabindex': 0,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, isActive, model: model as Ref<T>, toggle })
  provide('baseToggle', composable)
  return composable
}
