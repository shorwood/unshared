import { Component, Prop, UnwrapRef, computed, getCurrentInstance, ref } from 'vue'
import { debounceFilter, toReactive, useRefHistory, useVModel } from '@vueuse/core'
import { useElementSelection } from './useElementSelection'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { cleanAttributes } from './cleanAttributes'

/** The symbol to inject in components when using the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_SYMBOL = Symbol()

/** The options for the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  'id': String,
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'type': { type: String, default: 'text' },
  'name': String,
  'label': String,
  'autocomplete': String,
  'placeholder': String,
  'parse': Function,
  'serialize': Function,
} satisfies Record<keyof BaseInputTextOptions, Prop<unknown>>

/** The options for the `useBaseInputText` composable. */
export interface BaseInputTextOptions<T = unknown> extends
  BaseStateOptions {

  /**
   * The unique identifier of the input. This is used to identify the input when
   * submitting a form or when using the input in a list of inputs.
   */
  id?: string

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

  /**
   * The sanitizer function to use when sanitizing the value of the input before
   * setting it as the inner HTML of the element. This is used to prevent injection
   * of malicious code into the element.
   *
   * @default (value: unknown) => String(value)
   */
  'serialize'?: (value: T) => string
}

/** The composable properties returned by the `useBaseInputText` composable. */
export interface BaseInputTextComposable {

  /** The type of the input. */
  is: Component | string

  /** The current value of the input. */
  model: unknown

  /** The HTML attributes to apply to the HTML element. */
  attributes: Record<string, unknown>
}

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TEXT_SYMBOL]?: BaseInputTextComposable
  }
}

export function useBaseInputText<T>(options: BaseInputTextOptions<T> = {}, instance = getCurrentInstance()): BaseInputTextComposable {
  if (instance?.[BASE_INPUT_TEXT_SYMBOL]) return instance[BASE_INPUT_TEXT_SYMBOL]

  // --- Define the reactive properties.
  const element = ref<HTMLInputElement>()
  const state = useBaseState(options)
  const is = computed(() => (options.type === 'textarea' ? 'textarea' : 'input'))
  const model = useVModel(options, 'modelValue', instance?.emit, { passive: true })
  const selection = useElementSelection(element)
  const historyModel = useRefHistory(model, { eventFilter: debounceFilter(50) })

  // --- Computed value for the serialized model value.
  const value = computed(() => {
    const serialize = options.serialize ?? String
    // @ts-expect-error: type matching is not an issue here.
    return serialize(model.value ?? '')
  })

  /**
   * Handle native input event to update the model value. If a parser is
   * provided, it will parse the value and emit an error event if it fails.
   */
  function updateModelValue(): void {
    if (!element.value) return
    const value = element.value.value
    const parse = options.parse ?? String

    try {
      state.error = undefined
      model.value = parse(value) as UnwrapRef<T>
    }
    catch (error) {
      state.error = error as Error
      model.value = value as UnwrapRef<T>
    }

    selection.restore()
  }

  /**
   * Handle specific keydown events to provide additional functionality to the
   * input. For example, undoing the last change with `Ctrl+Z`.
   *
   * @param event The keydown event to handle.
   */
  function onKeydown(event: KeyboardEvent): void {
    const isControl = event.ctrlKey || event.metaKey
    if (!isControl) return

    if (event.key === 'z') {
      historyModel.undo()
      event.preventDefault()
    }

    if (event.key === 'y') {
      historyModel.redo()
      event.preventDefault()
    }
  }

  // --- Define the HTML attributes.
  const attributes = computed(() => cleanAttributes({
    'ref': element,
    'id': options.id,
    'value': value.value,
    'type': is.value === 'input' ? options.type : undefined,
    'name': options.name,
    'aria-label': options.label,
    'aria-invalid': state.error ? true : undefined,
    'placeholder': options.placeholder,
    'autocomplete': options.autocomplete,
    'onInput': updateModelValue,
    'onKeydown': onKeydown,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ model, is, attributes })
  if (instance) instance[BASE_INPUT_TEXT_SYMBOL] = composable
  return composable
}
