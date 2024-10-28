import type { Prop, Ref } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { computed, getCurrentInstance, ref, watch } from 'vue'

/** The symbol to provide the `useBaseInputList` composable. */
export const BASE_INPUT_LIST_SYMBOL = Symbol()

/** The props when using the `useBaseInputList` composable. */
export const BASE_INPUT_LIST_OPTIONS = {
  'options': {},
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'search': String,
  'onUpdate:search': [Function, Array],
  'allowCustomValue': Boolean,
  'optionValue': Function,
  'optionLabel': Function,
  'optionDisabled': Function,
  'optionFilter': Function,
  'multiple': Boolean,
} satisfies Record<keyof UseBaseInputListOptions<any, any, any>, Prop<unknown>>

/** The options for the `useBaseInputList` composable. */
export interface UseBaseInputListOptions<T, V = T, M extends boolean = boolean> {

  /**
   * Items available for selection as an object or array. Each option should
   * be different as to allow for unique values and avoid duplicates.
   *
   * @example { '1': { name: 'Alice' }, '2': { name: 'Bob' } }
   */
  options?: Record<PropertyKey, T> | T[]

  /**
   * The current value of the input. It can be a single value or an array of
   * values if `multiple` is set to `true`.
   *
   * @example ['Alice', 'Bob']
   */
  modelValue?: M extends true ? V[] : V
  'onUpdate:modelValue'?: (value: M extends true ? V[] : V) => void

  /**
   * The search query to filter options by. It can be used to filter the current
   * list of options by the provided query or to search for options in a remote
   * source.
   *
   * @example 'Alice'
   */
  search?: string
  'onUpdate:search'?: (value: string) => void

  /**
   * If `true`, allow multiple options to be selected at once. If
   * `false`, only one option can be selected at a time.
   *
   * @default false
   */
  multiple?: M

  /**
   * Allow the user to set the value from the search input. If `true`, custom
   * value can be set by the user by pressing `Enter` when the search input is
   * focused.
   */
  allowCustomValue?: boolean

  /**
   * Function that returns the value that should be used as the option's value.
   * This value will be used when selecting the option and comparing it with the
   * list of selected options.
   *
   * @example (option) => option.id
   */
  optionValue?: (option: T) => V

  /**
   * Function that returns the text that should be used as the option's text.
   * This text will be displayed in the selection list and in the selected
   * options list.
   *
   * @example (option) => option.name
   */
  optionLabel?: (option: T) => number | string

  /**
   * Function that returns if the option should be disabled. If `true`, the
   * option will not be selectable and will be displayed as disabled.
   *
   * @example (option) => option.disabled
   */
  optionDisabled?: (option: T) => boolean

  /**
   * Function that returns if the option should be visible when a search query
   * is provided. If `false`, the option will not be displayed in the list.
   *
   * @example (searchQuery, option) => option.name.startsWith(searchQuery)
   */
  optionFilter?: (searchQuery: string, option: T) => boolean
}

/** The `ListOption` object returned by the `useBaseInputList` composable. */
export interface ListOption<T, V = T> {

  /**
   * The option object as provided in the `options` prop. If the options are an
   * array, this will be the option at the current index. If the options are an
   * object, this will be the value of the current key.
   *
   * @example { id: '0000-0000-0000-0000', name: 'Alice' }
   */
  option: T

  /**
   * The value of the option. If the `optionValue` function is provided, this will
   * be the value returned by the function. If not, this will be the key of
   * the option.
   *
   * @example 'Alice'
   */
  value: V

  /**
   * The text of the option. If the `optionLabel` function is provided, this will
   * be the text returned by the function. If not, this will be the key of
   * the option.
   *
   * @example 'Alice'
   */
  label: number | string

  /**
   * If the option is disabled. If the `optionDisabled` function is provided, this
   * will be the value returned by the function. If not, this will be `false`.
   * If `true`, the option will not be selectable and will be displayed as
   *
   * @example false
   */
  isDisabled: () => boolean

  /**
   * If the option is selected by comparing the option's value with the current
   * model value. If `optionValue` is not defined, compare with the option's key.
   * If `true`, the option will be displayed as selected.
   *
   * @example false
   */
  isSelected: () => boolean

  /**
   * If the option is visible. If the `optionFilter` function is provided, this
   * will be the value returned by the function. If not, this will be `true`.
   * If `false`, the option will not be displayed in the list.
   *
   * @example true
   */
  isVisible: () => boolean

  /**
   * Toggle the option by adding or removing the option's value from the model
   * value. If `multiple` is `false`, set the model value to the option's value.
   * If `selected` is `true`, remove the option's value from the model value.
   *
   * @example toggle() // => undefined
   */
  toggle: () => void

  /**
   * Add option's value to value array / set value to option's value.
   *
   * @example on() // => undefined
   */
  on: () => void

  /**
   * Remove option's value from value array.
   *
   * @example off() // => undefined
   */
  off: () => void
}

/** The composable properties returned by the `useBaseInputList` composable. */
export interface UseBaseInputListComposable<T, V = T, M extends boolean = boolean> {

  /**
   * List of options available for selection. This is a collection of `ListOption`
   * objects that keep track of the option's value, text, and state.
   */
  options: Array<ListOption<T, V>>

  /**
   * List of all options passed to the `options` property so far. This allows you
   * to keep track of all options even if they dissapear from the list of `options`
   * due to a search query or a filter change.
   */
  optionsAll: Array<ListOption<T, V>>

  /**
   * List of selected `ListOption` options. This allows you to keep track of the selected
   * options even if they dissapear from the list of `options` due to a search
   * query or a filter change.
   */
  selected: Array<ListOption<T, V>>

  /**
   * Current value of the input. If `multiple` is `true`, this will be an array
   * of values. If `multiple` is `false`, this will be a single value or `undefined`.
   *
   * @example ['Alice', 'Bob']
   */
  model: M extends true ? V[] : V | undefined

  /**
   * The search query to filter options by or `undefined` if no search query is
   * provided. This can be used to filter the list of options by the provided
   */
  search: string | undefined

  /**
   * Select an option by passing the value of the option. If `multiple` is `true`,
   * add the option's value to the model value. Optionally, pass a boolean value
   * to select or deselect the option.
   *
   * @param option The option to toggle.
   * @param key The key of the option.
   * @param value If `true`, remove the option's value from the model value.
   * @example toggle(option, true) // => undefined
   */
  toggle: (option: T, value?: boolean) => void

  /**
   * Add a custom value to the model value by pressing `Enter` when the search
   * input is focused. If `allowCustomValue` is `false`, this function will do
   * nothing.
   */
  pushSearch: () => void

  /**
   * Deslect all selected options by setting the model value to an empty array
   * or to `undefined` if `multiple` is `false`.
   */
  clear: () => void
}

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_INPUT_LIST_SYMBOL]?: UseBaseInputListComposable<any, any, any>
  }
}

export function useBaseInputList<T, V, M extends boolean>(options: UseBaseInputListOptions<T, V, M>, instance = getCurrentInstance()): UseBaseInputListComposable<T, V, M> {
  if (instance?.[BASE_INPUT_LIST_SYMBOL]) return instance[BASE_INPUT_LIST_SYMBOL] as UseBaseInputListComposable<T, V, M>

  // --- Initialize model value.
  const emit = instance?.emit
  const model = useVModel(options, 'modelValue', emit, { passive: true }) as Ref<V | V[] | undefined>
  const search = useVModel(options, 'search', undefined, { passive: true })

  /**
   * Check if the option is selected by comparing the option's value with the
   * current model value. If `optionValue` is not defined, compare with the
   * option's key.
   *
   * @param option The option to check.
   * @returns `true` if the option is selected, `false` otherwise.
   * @example isSelected(option) // => true
   */
  function isSelected(option: T): boolean {
    const value = options.optionValue ? options.optionValue(option) : option
    if (options.multiple) return Array.isArray(options.modelValue) && options.modelValue.includes(value)
    return options.modelValue === value
  }

  /**
   * Check if the option is visible by comparing the option with the search query.
   * If `optionFilter` is not defined, return `true`.
   *
   * @param searchQuery The search query to filter options by.
   * @param option The option to check.
   * @returns `true` if the option is visible, `false` otherwise.
   * @example isVisible('Alice', option) // => true
   */
  function isVisible(searchQuery: string | undefined, option: T): boolean {
    if (!searchQuery) return true
    if (!options.optionFilter) return true
    return options.optionFilter(searchQuery, option)
  }

  /**
   * Clear the selected options by setting the model value to an empty array or
   * to `undefined` if `multiple` is `false`.
   */
  function clear(): void {
    model.value = options.multiple ? [] as V[] : undefined
  }

  /**
   * Wrap the option in a `ListOption` object to keep track of the option's value,
   * text, and state. Additionally, provide a `toggle` function to toggle the
   * option's state.
   *
   * @param option The option to wrap.
   * @returns The `ListOption` object.
   */
  function wrapOption(option: T): ListOption<T, V> {
    return {
      option,
      value: options.optionValue?.(option) ?? String(option) as unknown as V,
      label: options.optionLabel?.(option) ?? String(option) as unknown as number | string,
      isDisabled: () => !!options.optionDisabled?.(option),
      isSelected: () => isSelected(option),
      isVisible: () => isVisible(search.value, option),
      toggle: () => toggle(option),
      off: () => toggle(option, false),
      on: () => toggle(option, true),
    }
  }

  /**
   * Toggle the option by adding or removing the option's value from the model
   * value. If `multiple` is `false`, set the model value to the option's value.
   * If `selected` is `true`, remove the option's value from the model value.
   *
   * @param option The option to toggle.
   * @param state The state to set the option to.
   * @example toggle(option, true) // => undefined
   */
  function toggle(option: T, state?: boolean): void {
    const value = options.optionValue?.(option) ?? String(option) as unknown as V
    search.value = ''

    // --- If not multiple, set value.
    if (!options.multiple) {
      model.value = state === false ? undefined : value
    }

    // --- If multiple and value is already an array, push or remove value.
    // --- Additionally, keep track of selected options in a separate array.
    else if (Array.isArray(model.value)) {
      model.value = state ?? !isSelected(option)
        ? [...new Set([...model.value, value])]
        : [...model.value].filter(x => x !== value)
    }

    // --- Otherwise, initialize array with value.
    else {
      model.value = [value]
    }
  }

  // --- Computed wrapped options.
  const optionsWrapped = computed(() => {
    if (!options.options) return []
    return Object.values(options.options).map(option => wrapOption(option))
  })

  const optionsAll = ref([]) as Ref<Array<ListOption<T, V>>>
  watch(optionsWrapped, (optionsWrapped) => {
    for (const option of optionsWrapped) {
      optionsAll.value = optionsAll.value.filter(x => x.value !== option.value)
      optionsAll.value.push(option)
    }
  }, { immediate: true })

  // --- Computed selected options
  const selected = computed(() => {
    if (model.value === undefined) return []
    const modelValue = Array.isArray(model.value) ? model.value : [model.value]
    return modelValue.map(value => optionsAll.value.find(x => x.value === value)).filter(Boolean) as Array<ListOption<T, V>>
  })

  /**
   * Add a custom value to the model value by pressing `Enter` when the search
   * input is focused. If `allowCustomValue` is `false`, this function will do
   * nothing.
   */
  function pushSearch(): void {
    if (!search.value) return
    if (!options.allowCustomValue) return
    const optionExists = optionsWrapped.value.find(x => x.value === search.value)

    // --- If search value matches an existing option, select it.
    if (optionExists) {
      optionExists.on()
    }

    // --- Otherwise, add a new option to the list and select it.
    else {
      const option = wrapOption(search.value as T)
      optionsAll.value.push(option)
      option.on()
    }
  }

  // ---- Return the reactive properties.
  const composables = toReactive({ options: optionsWrapped, optionsAll, model, selected, search, clear, toggle, pushSearch }) as unknown as UseBaseInputListComposable<T, V, M>
  if (instance) instance[BASE_INPUT_LIST_SYMBOL] = composables
  return composables
}
