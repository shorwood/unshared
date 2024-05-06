import { Component, ExtractPropTypes, Prop, computed, getCurrentInstance } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'
import { cleanAttributes } from '../utils/cleanAttributes'

/** The symbol to inject the base input text composable. */
export const BASE_INPUT_TEXT_SYMBOL = Symbol()

/** The properties of the base input text composables. */
export const BASE_INPUT_TEXT_OPTIONS = {
  ...BASE_STATE_OPTIONS,

  /**
   * The type of the input. This is used to determine the type of input to render.
   */
  'type': { type: String, default: 'text' } as Prop<string>,

  /**
   * The name of the input. This is used to identify the input when submitting a form or
   * when using the input in a list of inputs.
   *
   * @example 'email'
   */
  'name': String as Prop<string>,

  /**
   * The label of the input that should be displayed above the input. This is also used
   * to provide the `aria-label` attribute to the input for accessibility.
   *
   * @example 'Email Address'
   */
  'label': String as Prop<string>,

  /**
   * The value of the input.
   *
   * @example 'Hello, World!'
   */
  'modelValue': {} as Prop<unknown>,
  'onUpdate:modelValue': Function as Prop<(value: unknown) => void>,

  /**
   * The autocomplete value of the input. This is used to provide autocomplete
   * suggestions to the user when typing in the input.
   *
   * @example 'email'
   */
  'autocomplete': String as Prop<AutoFill>,

  /**
   * The placeholder value of the input. This is used to provide a hint to the user
   * of what should be entered into the input.
   */
  'placeholder': String as Prop<string>,

  /**
   * The parser function to use when parsing the value of the input. This is used
   * to transform the value of the input. If an error is thrown, the value will
   * be set back to the previous value and the `error` event will be emitted.
   *
   * @example (value) => value.trim()
   */
  'parse': Function as Prop<(value: string) => unknown>,
  'onError': Function as Prop<(error: Error) => void>,
}

/** The properties of the base input text composables. */
export type BaseInputTextOptions = ExtractPropTypes<typeof BASE_INPUT_TEXT_OPTIONS>

/** The composable properties returned by the `useBaseInputText` composable. */
export interface BaseInputTextComposable {
  is: Component | string
  modelValue: unknown
  attributes: Record<string, unknown>
  onInput: (event: Event) => void
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TEXT_SYMBOL]?: BaseInputTextComposable
  }
}

export function useBaseInputText(props: BaseInputTextOptions, instance = getCurrentInstance()) {
  if (instance?.[BASE_INPUT_TEXT_SYMBOL]) return instance[BASE_INPUT_TEXT_SYMBOL]

  const emit = instance?.emit
  const state = useBaseState(props)
  const modelValue = useVModel(props, 'modelValue', emit, { passive: true })
  const is = computed(() => (props.type === 'textarea' ? 'textarea' : 'input'))

  // --- Handle native input event to update the model value. If a parser is
  // --- provided, it will parse the value and emit an error event if it fails.
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (props.parse) {
      try {
        modelValue.value = props.parse
          ? props.parse.call(instance, target.value)
          : target.value
        state.error = undefined
      }
      catch (error) {
        state.error = error as Error
        modelValue.value = target.value
        emit?.('error', error)
      }
    }
  }

  // --- Is the value a native input or textarea element?
  const isNative = computed(() => is.value === 'input' || is.value === 'textarea')

  // --- Define the HTML attributes.
  const attributes = computed(() => cleanAttributes({
    'type': props.type !== 'textarea' && props.type,
    'name': props.name,
    'value': String(modelValue.value),
    'placeholder': isNative.value ? props.placeholder : undefined,
    'autocomplete': isNative.value ? props.autocomplete : undefined,
    'contenteditable': isNative.value ? undefined : true,
    'aria-label': props.label,
    'aria-invalid': state.error ? true : undefined,
    'aria-autocomplete': isNative.value ? props.autocomplete : undefined,
    'aria-placeholder': isNative.value ? undefined : props.placeholder,
    'onInput': onInput,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ modelValue, is, onInput, attributes })
  if (instance) instance[BASE_INPUT_TEXT_SYMBOL] = composable
  return composable
}
