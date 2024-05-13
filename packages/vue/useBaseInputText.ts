import { Component, ComponentObjectPropsOptions, UnwrapRef, computed, getCurrentInstance, nextTick } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { cleanAttributes } from './cleanAttributes'

/** The symbol to inject in components when using the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_SYMBOL = Symbol()

/** The options for the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'type': { type: String, default: 'text' },
  'name': String,
  'label': String,
  'autocomplete': String,
  'placeholder': String,
  'parse': Function,
} satisfies ComponentObjectPropsOptions

/** The options for the `useBaseInputText` composable. */
export interface BaseInputTextOptions<T = unknown> extends BaseStateOptions {

  /**
   * The type of the input. This is used to determine the type of input to render.
   *
   * @default 'text'
   */
  'type'?: string

  /**
   * The name of the input. This is used to identify the input when submitting a form or
   * when using the input in a list of inputs.
   *
   * @example 'email'
   */
  'name'?: string

  /**
   * The label of the input that should be displayed above the input. This is also used
   * to provide the `aria-label` attribute to the input for accessibility.
   *
   * @example 'Email Address'
   */
  'label'?: string

  /**
   * The value of the input.
   *
   * @example 'Hello, World!'
   */
  'modelValue'?: T
  'onUpdate:modelValue'?: (value: T) => void

  /**
   * The autocomplete value of the input. This is used to provide autocomplete
   * suggestions to the user when typing in the input.
   *
   * @example 'email'
   */
  'autocomplete'?: AutoFill

  /**
   * The placeholder value of the input. This is used to provide a hint to the user
   * of what should be entered into the input.
   */
  'placeholder'?: string

  /**
   * The parser function to use when parsing the value of the input. This is used
   * to transform the value of the input. If an error is thrown, the value will
   * be set back to the previous value and the `error` event will be emitted.
   *
   * @example (value) => value.trim()
   */
  'parse'?: (value: string) => T
}

/** The composable properties returned by the `useBaseInputText` composable. */
export interface BaseInputTextComposable {

  /** The type of the input. */
  is: Component | string

  /** The current value of the input. */
  modelValue: unknown

  /** The HTML attributes to apply to the HTML element. */
  attributes: Record<string, unknown>

  /** The handler for the input event. */
  onInput: (event: Event) => void
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TEXT_SYMBOL]?: BaseInputTextComposable
  }
}

export function useBaseInputText<T>(options: BaseInputTextOptions<T> = {}, instance = getCurrentInstance()): BaseInputTextComposable {
  if (instance?.[BASE_INPUT_TEXT_SYMBOL]) return instance[BASE_INPUT_TEXT_SYMBOL]

  const state = useBaseState(options)
  const modelValue = useVModel(options, 'modelValue', undefined, { passive: true })
  const is = computed(() => (options.type === 'textarea' ? 'textarea' : 'input'))

  // --- Handle native input event to update the model value. If a parser is
  // --- provided, it will parse the value and emit an error event if it fails.
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    try {
      const cursor = target.selectionStart
      modelValue.value = options.parse
        ? options.parse.call(instance, target.value) as UnwrapRef<T>
        : target.value as UnwrapRef<T>
      void nextTick(() => target.setSelectionRange(cursor, cursor))
      state.error = undefined
    }
    catch (error) {
      modelValue.value = target.value as UnwrapRef<T>
      state.error = error as Error
    }
  }

  // --- Is the value a native input or textarea element?
  const isNative = computed(() => is.value === 'input' || is.value === 'textarea')

  // --- Define the HTML attributes.
  const attributes = computed(() => cleanAttributes({
    'type': options.type !== 'textarea' && options.type,
    'name': options.name,
    'value': modelValue.value ? String(modelValue.value) : '',
    'placeholder': isNative.value ? options.placeholder : undefined,
    'autocomplete': isNative.value ? options.autocomplete : undefined,
    'contenteditable': isNative.value ? undefined : true,
    'aria-label': options.label,
    'aria-invalid': state.error ? true : undefined,
    'aria-autocomplete': isNative.value ? undefined : options.autocomplete,
    'aria-placeholder': isNative.value ? undefined : options.placeholder,
    'onInput': onInput,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ modelValue, is, onInput, attributes })
  if (instance) instance[BASE_INPUT_TEXT_SYMBOL] = composable
  return composable
}
