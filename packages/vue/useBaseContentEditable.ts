import { Prop, UnwrapRef, computed, getCurrentInstance, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { useElementSelection } from './useElementSelection'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { cleanAttributes } from './cleanAttributes'

/** The options for the `useBaseContentEditable` composable. */
export interface BaseContentEditableOptions<T = unknown> extends
  BaseStateOptions {

  /**
   * The value of the input.
   *
   * @example 'Hello, World!'
   */
  'modelValue'?: T
  'onUpdate:modelValue'?: (value: T) => void

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

/** The composable properties returned by the `useBaseContentEditable` composable. */
export interface BaseContentEditableComposable {

  /** The current value of the input. */
  model: unknown

  /** The HTML attributes to apply to the HTML element. */
  attributes: Record<string, unknown>
}

/** The symbol to inject in components when using the `useBaseContentEditable` composable. */
export const BASE_CONTENT_EDITABLE_SYMBOL = Symbol()

/** The options for the `useBaseContentEditable` composable. */
export const BASE_CONTENT_EDITABLE_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'parse': Function,
  'serialize': Function,
} satisfies Record<keyof BaseContentEditableOptions, Prop<unknown>>

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_CONTENT_EDITABLE_SYMBOL]?: BaseContentEditableComposable
  }
}

export function useBaseContentEditable<T>(options: BaseContentEditableOptions<T> = {}, instance = getCurrentInstance()): BaseContentEditableComposable {
  if (instance?.[BASE_CONTENT_EDITABLE_SYMBOL]) return instance[BASE_CONTENT_EDITABLE_SYMBOL]

  // --- Define the reactive properties.
  const element = ref<HTMLElement>()
  const state = useBaseState(options)
  const selection = useElementSelection(element)
  const model = useVModel(options, 'modelValue', instance?.emit, {
    passive: true,
    defaultValue: '' as T,
  })

  // --- A flag to pause the observer when updating the inner HTML.
  let isPauseObserver = false
  function pauseObserver() {
    isPauseObserver = true
    void nextTick(() => isPauseObserver = false)
  }

  // --- Computed value for the serialized inner HTML of the element.
  function updateInnerHTML(): void {
    if (!element.value) return
    const serialize = options.serialize ?? String
    const innerHTML = serialize(model.value as T)
    if (element.value.innerHTML === innerHTML) return
    selection.restore()
    element.value.innerHTML = innerHTML
  }

  /**
   * Update the model value from the inner HTML of the element. This will
   * also handle any parsing errors and parse the value based on the `parse`
   * option.
   */
  function updateModelValue(): void {
    if (!element.value) return
    if (selection.index.value === undefined) return
    const value = (element.value.innerHTML ?? '').replaceAll('<br>', '\n')
    const parse = options.parse ?? String

    try {
      model.value = parse(value) as UnwrapRef<T>
      state.error = undefined
    }
    catch (error) {
      model.value = String(value) as UnwrapRef<T>
      state.error = error as Error
    }
  }

  /**
   * Handle paste event to prevent pasting of formatted text. This will
   * remove all formatting from the pasted text and insert plain text.
   *
   * @param event The paste event.
   */
  function onPaste(event: ClipboardEvent): void {
    event.preventDefault()
    if (!event.clipboardData) return
    const clipboard = event.clipboardData.getData('text/plain')
    const currentRange = selection.range.value
    if (!currentRange) return

    // --- Insert the clipboard text using the Selection API.
    pauseObserver()
    const node = document.createTextNode(clipboard)
    currentRange.deleteContents()
    currentRange.insertNode(node)
    currentRange.setStartAfter(node)
  }

  // --- Watch outside changes to the `modelValue` prop and update the
  // --- inner text of the element when the value changes.
  watch([() => options.modelValue], () => {
    pauseObserver()
    updateInnerHTML()
  })

  /**
   * Handle observer mutations to update the model value when the inner text
   * of the element changes. If the `pauseObserver` flag is set, the observer
   * will not update the model value.
   */
  function onMutation(): void {
    if (isPauseObserver) return
    pauseObserver()
    updateModelValue()
  }

  // --- Watch inner text changes in the element using a MutationObserver.
  // --- Destroy the observer when the component is unmounted.
  let observer: MutationObserver | undefined
  if (globalThis.MutationObserver) observer = new MutationObserver(onMutation)
  onScopeDispose(() => observer?.disconnect())
  watch(element, (element) => {
    if (!element) return
    if (!observer) return
    observer.observe(element, {
      subtree: true,
      childList: true,
      characterData: true,
    })
  })

  // --- Define the HTML attributes.
  onMounted(updateInnerHTML)
  const attributes = computed(() => cleanAttributes({
    'ref': element,
    'aria-invalid': state.error ? true : undefined,
    'contenteditable': state.readonly ? undefined : true,
    'onPaste': onPaste,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ model, attributes })
  if (instance) instance[BASE_CONTENT_EDITABLE_SYMBOL] = composable
  return composable
}
