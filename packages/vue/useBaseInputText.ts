/* eslint-disable unicorn/prefer-dom-node-text-content */
import { Component, Prop, UnwrapRef, computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { getCursor, setCursor } from './useCursor'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions } from './useBaseRenderable'
import { cleanAttributes } from './cleanAttributes'

/** The options for the `useBaseInputText` composable. */
export interface BaseInputTextOptions<T = unknown> extends
  BaseStateOptions,
  BaseRenderableOptions {

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
   * If the input is not a native input element, this attribute indicates whether the
   * content of the element is editable or not.
   */
  'contenteditable'?: boolean

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

  /** Is the input a native input element. */
  isNative: boolean

  /** The current value of the input. */
  model: unknown

  /** The HTML attributes to apply to the HTML element. */
  attributes: Record<string, unknown>
}

/** The symbol to inject in components when using the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_SYMBOL = Symbol()

/** The options for the `useBaseInputText` composable. */
export const BASE_INPUT_TEXT_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  'id': String,
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'type': { type: String, default: 'text' },
  'name': String,
  'label': String,
  'autocomplete': String,
  'placeholder': String,
  'contenteditable': Boolean,
  'parse': Function,
} satisfies Record<keyof BaseInputTextOptions, Prop<unknown>>

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TEXT_SYMBOL]?: BaseInputTextComposable
  }
}

/**
 * Replace all spaces with a special character to prevent the browser from
 * trimming the spaces. This is necessary for the `contenteditable` attribute.
 *
 * @param value The value to replace spaces with.
 * @returns The sanitized text.
 */
function sanitizeTextContent(value?: unknown): string {
  if (!value) return '\u200B'
  return String(value).replace(/ +$/, '\u00A0')
}

export function useBaseInputText<T>(options: BaseInputTextOptions<T> = {}, instance = getCurrentInstance()): BaseInputTextComposable {
  if (instance?.[BASE_INPUT_TEXT_SYMBOL]) return instance[BASE_INPUT_TEXT_SYMBOL]

  // --- Define the reactive properties.
  const state = useBaseState(options)
  const model = useVModel(options, 'modelValue', undefined, { passive: true })
  const is = computed(() => (options.as ?? (options.type === 'textarea' ? 'textarea' : 'input')))
  const isNative = computed(() => is.value === 'input' || is.value === 'textarea')
  const element = ref<HTMLInputElement>()

  /**
   * Handle native input event to update the model value. If a parser is
   * provided, it will parse the value and emit an error event if it fails.
   */
  function onInput(): void {
    if (!element.value) return
    const value = isNative.value
      ? element.value.value
      : element.value.innerText?.replaceAll('\u200B', '') ?? ''

    // --- Set the model value and handle any parsing errors.
    try {
      model.value = (options.parse ? options.parse(value) : value) as UnwrapRef<T>
      state.error = undefined
    }
    catch (error) {
      model.value = value as UnwrapRef<T>
      state.error = error as Error
    }

    const cursor = getCursor(element.value)
    if (!cursor) return
    void nextTick(() => setCursor(element.value!, cursor.start))
  }

  /**
   * Handle paste event to prevent pasting of formatted text. This will
   * remove all formatting from the pasted text and insert plain text.
   *
   * @param event The paste event.
   */
  function onPaste(event: ClipboardEvent): void {
    if (isNative.value) return
    event.preventDefault()
    if (!event.clipboardData) return
    const target = event.target as HTMLElement

    // --- Remove the currently selected text.
    const selection = window.getSelection()
    if (selection?.rangeCount) selection.getRangeAt(0).deleteContents()

    // --- Get the text to insert and the current text.
    const cursor = getCursor()
    if (!cursor) return
    const textInsert = event.clipboardData.getData('text/plain')
    const textCurrent = target.innerText ?? ''
    const textBefore = textCurrent.slice(0, cursor.start)
    const textAfter = textCurrent.slice(cursor.start)

    // --- Insert the text and set the cursor offset.
    target.textContent = textBefore + textInsert + textAfter
    setCursor(element.value!, cursor.start + textInsert.length)
  }

  // --- If the input is not a native element, add MutationObserver to
  // --- sync the value and the inner text of the element.
  let lastUpdate = Date.now()
  let observer: MutationObserver | undefined
  if (globalThis.MutationObserver) {
    observer = new MutationObserver(() => {
      const now = Date.now()
      if (now - lastUpdate < 5) return
      onInput()
      lastUpdate = now
    })
  }

  // --- Watch for changes in the element's text content. This allows us
  // --- to observe changes in the inner text of the element when the input
  // --- is not a native input element.
  watch(element, (element) => {
    if (!element) return
    if (isNative.value) return
    if (!observer) return
    observer.observe(element, {
      subtree: true,
      childList: true,
      characterData: true,
    })
  })

  // --- Define the HTML attributes.
  const attributes = computed(() => cleanAttributes({
    'ref': element,
    'id': isNative.value ? options.id : undefined,
    'type': is.value === 'input' ? options.type : undefined,
    'name': isNative.value ? options.name : undefined,
    'value': isNative.value ? model.value : undefined,
    'textContent': isNative.value ? undefined : sanitizeTextContent(model.value),
    'aria-label': options.label,
    'aria-invalid': state.error ? true : undefined,
    'placeholder': isNative.value ? options.placeholder : undefined,
    'autocomplete': isNative.value ? options.autocomplete : undefined,
    'contenteditable': !isNative.value && !state.readonly ? true : undefined,
    'aria-autocomplete': !isNative.value && !state.readonly ? options.autocomplete : undefined,
    'aria-placeholder': !isNative.value && !state.readonly ? options.placeholder : undefined,
    'onInput': isNative.value ? onInput : undefined,
    'onPaste': isNative.value ? undefined : onPaste,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ model, is, isNative, attributes })
  if (instance) instance[BASE_INPUT_TEXT_SYMBOL] = composable
  return composable
}
