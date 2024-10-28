import type { MaybeArray } from '@unshared/types'
import type { Component, Prop, Ref } from 'vue'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { toReactive, useVModel } from '@vueuse/core'
import { computed, getCurrentInstance } from 'vue'
import { cleanAttributes } from './cleanAttributes'
import { cleanClasses } from './cleanClasses'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The type of the toggle. */
export type ToggleType = 'checkbox' | 'radio' | 'switch'

/** The value of the toggle based on the type. */
export type ToggleValue<T, U extends ToggleType> =
  U extends 'switch' ? 'mixed' | boolean :
    U extends 'checkbox' ? T[] :
      U extends 'radio' ? T :
        never

export interface BaseInputToggleOptions<T = unknown, U extends ToggleType = ToggleType> extends BaseRenderableOptions {

  /**
   * The type of the toggle. This can be either `checkbox`, `radio`, or `switch`.
   * This will determine how the toggle will behave when it is clicked.
   *
   * @default 'switch'
   */
  type?: U

  /**
   * If `true`, the trigger for toggling the state of the toggle will be the
   * `mousedown` event instead of the `click` event. This allows a more responsive
   * feel when toggling the state of the toggle but may hinder some accessibility
   * features.
   *
   * Note that this is disabled when touch capabilities are detected. In that case,
   * the trigger will be the `click` event.
   *
   * @default false
   */
  eager?: boolean

  /**
   * The model value of the toggle. This holds the current state of the toggle
   * and should be updated when the toggle is clicked.
   *
   * @default undefined
   */
  modelValue?: ToggleValue<T, U>
  'onUpdate:modelValue'?: (value: ToggleValue<T, U>) => void

  /**
   * The value to set or push when the toggle is active. This is only used when
   * the type of the toggle is either `checkbox` or `radio`. By default, it
   * will use the `key` of the current instance.
   *
   * @default useCurrentInstance().key
   */
  value?: U extends 'switch' ? void : MaybeArray<T>
  onToggle?: () => void
  onOff?: () => void
  onOn?: () => void

  /**
   * The class to apply when the toggle is active. This allows you to customize
   * the appearance of the toggle when it is active without handling the CSS in
   * the component itself.
   *
   * @example 'active'
   */
  classActive?: string

  /**
   * The class to apply when the toggle is inactive. This allows you to customize
   * the appearance of the toggle when it is inactive without handling the CSS in
   * the component itself.
   *
   * @example 'inactive'
   */
  classInactive?: string

  /**
   * The class to apply when the toggle is mixed. This allows you to customize
   * the appearance of the toggle when it is mixed without handling the CSS in
   * the component itself.
   *
   * @example 'mixed'
   */
  classMixed?: string
}

/** The composable properties returned by the `useBaseInputToggle` composable. */
export interface BaseInputToggleComposable<T = unknown, U extends ToggleType = ToggleType> {
  attributes: Record<string, unknown>
  classes: Record<string, unknown>
  isActive: 'mixed' | boolean
  model: ToggleValue<T, U>
  toggle: () => void
  is: Component | string
}

/** The symbol to provide the base toggle composable. */
export const BASE_INPUT_TOGGLE_SYMBOL = Symbol()

/** The props when using the `useBaseInputToggle` composable. */
export const BASE_INPUT_TOGGLE_OPTIONS = {
  ...BASE_RENDERABLE_OPTIONS,
  'type': { type: String, default: 'switch' },
  'modelValue': [Boolean, Array, String, Number, Object],
  'onUpdate:modelValue': [Function, Array],
  'onOff': [Function, Array],
  'onOn': [Function, Array],
  'onToggle': [Function, Array],
  'value': [Boolean, Array, String, Number],
  'eager': Boolean,
  'classActive': { type: String, default: '' },
  'classInactive': { type: String, default: '' },
  'classMixed': { type: String, default: '' },
} satisfies Record<keyof BaseInputToggleOptions, Prop<unknown>>

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TOGGLE_SYMBOL]?: BaseInputToggleComposable<unknown, ToggleType>
  }
}

/**
 * Create a toggle composable given the provided type. The composable will
 * return a corresponding `isActive` computed property and a `toggle` method
 * to handle the click event based on the provided type of toggle.
 *
 * @param options The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns The computed properties and methods to use in the toggle component.
 * @example
 * defineComponent({
 *   mixins: [BaseToggle],
 *   setup(props, context) {
 *     return useBaseToggle(props, context)
 *   }
 * })
 */
export function useBaseInputToggle<T, U extends ToggleType>(options: BaseInputToggleOptions<T, U> = {}, instance = getCurrentInstance()): BaseInputToggleComposable<T, U> {
  if (instance?.[BASE_INPUT_TOGGLE_SYMBOL])
    return instance[BASE_INPUT_TOGGLE_SYMBOL] as BaseInputToggleComposable<T, U>

  // --- Create a v-model for the provided options.
  // --- Default the `value` property to undefined if it is not provided.
  const emit = instance?.emit
  const value = computed(() => options.value ?? instance?.props.key)
  const model = useVModel(options, 'modelValue', emit, { passive: true }) as Ref<unknown>
  const renderable = useBaseRenderable(options, instance)

  // --- Check if, based on the type, the model is active. When the type is
  // --- `checkbox` and the value is an array, it will check if the model
  // --- intersects with the value. If so, `isActive` will be `mixed` instead.
  const isActive = computed(() => {
    if (options.type === 'radio') return model.value === value.value
    if (options.type === 'switch') return model.value === true
    if (options.type !== 'checkbox') return false
    const modelValue = Array.isArray(model.value) ? model.value : []
    const valueValue = Array.isArray(value.value) ? value.value : [value.value]
    const isMixed = valueValue.some(x => modelValue.includes(x))
    const isActive = valueValue.every(x => modelValue.includes(x))
    return isActive || (isMixed && 'mixed')
  })

  function emitChange() {
    if (!emit) return
    emit('toggle')
    emit(isActive.value ? 'off' : 'on')
  }

  function toggleSwitch() {
    model.value = model.value !== true
    emitChange()
  }

  function toggleRadio() {
    if (model.value === value.value) return
    model.value = value.value
    emitChange()
  }

  function toggleCheckbox() {
    const valueValue: unknown[] = Array.isArray(value.value) ? value.value : [value.value]
    let modelValue: unknown[] = Array.isArray(model.value) ? model.value : []

    // --- Push or remove the value from the model based on the current state.
    modelValue = isActive.value === true
      ? [...modelValue].filter(x => !valueValue.includes(x))
      : [...modelValue, ...valueValue]

    // --- Deduplicate the model value and set it.
    model.value = [...new Set(modelValue)]
    emitChange()
  }

  function toggle() {
    if (options.type === 'radio') toggleRadio()
    if (options.type === 'switch') toggleSwitch()
    if (options.type === 'checkbox') toggleCheckbox()
  }

  // --- Compute the classes based on the active state.
  const classes = computed(() => cleanClasses({
    [options.classActive!]: options.classActive && isActive.value === true,
    [options.classInactive!]: options.classInactive && isActive.value === false,
    [options.classMixed!]: options.classMixed && isActive.value === 'mixed',
  }))

  // --- Compute the name of the click event based on the eager click option.
  // --- If eager click is enabled, the click event will be triggered on mouse down.
  // --- Unless the application is running in a touch environment, then it will
  const clickEvent = computed(() => {
    if (typeof globalThis === 'undefined') return 'onClick'
    if ('ontouchstart' in globalThis) return 'onClick'
    if (options.eager) return 'onMousedown'
    return 'onClick'
  })

  // --- Default the component to `input` if no component is provided.
  const is = computed(() => renderable.is ?? 'input')

  // --- Properties to assign to the element.
  const attributes = computed(() => cleanAttributes({
    [clickEvent.value]: toggle,
    'checked': (is.value === 'input' && isActive.value) ? true : undefined,
    'selected': (is.value !== 'input' && isActive.value) ? true : undefined,
    'aria-selected': (is.value !== 'input' && isActive.value) ? true : undefined,
    'aria-pressed': (is.value !== 'input' && options.type !== 'checkbox') ? isActive.value : undefined,
    'aria-checked': (is.value !== 'input' && options.type === 'checkbox') ? isActive.value : undefined,
    'role': is.value !== 'input' && (options.type === 'radio' ? 'radio' : 'checkbox') || undefined,
    'type': is.value === 'input' && (options.type === 'radio' ? 'radio' : 'checkbox') || undefined,
    'class': classes.value,
    'tabindex': is.value === 'input' ? undefined : 0,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, isActive, model, is, toggle })
  if (instance) instance[BASE_INPUT_TOGGLE_SYMBOL] = composable
  return composable as BaseInputToggleComposable<T, U>
}
