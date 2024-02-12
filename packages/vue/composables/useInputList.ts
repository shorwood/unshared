import { get } from '@hsjm/shared'
import { ComputedRef, Ref, computed } from 'vue-demi'

export interface ListItem<T = any, V = any> {
  /** Value of the item. */
  value?: V
  /** Text of the item. */
  text: string
  /** If the item is disabled. */
  disabled: boolean
  /** The passed item. */
  item?: T
  /** If the item is selected. */
  isSelected: () => boolean
  /** If the item is visible. */
  isVisible: (searchQuery: string) => boolean
  /** Toggle the item. */
  toggle: () => void
  /** Add item's value to value array / set value to item's value. */
  add: () => void
  /** Remove item's value from value array / set value to undefined. */
  remove: () => void
}

// TODO: Add `itemListText` and `itemItemText` to the props.
export interface UseInputListOptions<T = any, V = any> {
  /** Items to be used in the list. */
  items: T[] | Record<string, T>
  /** Predicate function or path to the item value, default to item. */
  itemValue?: string | ((item: T) => V)
  /** Predicate function or path to property to be used as text, defaults to item. */
  itemText?: string | ((item: TemplateStringsArray) => string)
  /** Predicate function or path to a boolean value defining if the item is disabled. Defaults to false. */
  itemDisabled?: string | ((item: T) => boolean)
  /** Function used when the search input. Used to filter the items. */
  itemSearch?: string | ((searchQuery: string, item: T) => boolean)
  /** If `true`, allow multiple items to be selected. */
  multiple?: boolean
}

export interface UseInputListReturnType<T = any, V = any> {
  /** List of items. */
  items: ComputedRef<Array<ListItem<T, V>>>
  /** List of selected items. */
  itemsSelected: ComputedRef<Array<ListItem<T, V>>>
  /** If the item is selected. */
  isSelected: (value: V) => boolean
  /** If the item is selected. */
  isVisible: (searchQuery: string, value: V) => boolean
  /** Toggle function for the item. */
  toggle: (value: V) => void
  /** Clear the selected items. */
  clear: () => void
}

/**
 * Prepare list items to be used in a component.
 *
 * @param modelValue Model value.
 * @param options Composable options.
 * @returns Composable.
 * @see `InputList`
 * @example
 * ```ts
 * const { items } = useListItems(modelValue, {
 *   itemValue: 'id',
 *   itemText: 'name',
 *   itemDisabled: x => x.disabled,
 * })
 * ```
 */
export function useInputList <T, V>(modelValue: Ref<any>, options: UseInputListOptions<T, V>): UseInputListReturnType<V, T> {
  // --- Is item selected?
  // TODO: Add deep comparison features.
  const isSelected = (value: V) => (
    options.multiple
      ? Array.isArray(modelValue.value) && modelValue.value.includes(value)
      : modelValue.value === value
  )

  // --- Is the item visible?
  const isVisible = (searchQuery: string, item: T) => {
    // --- If no search query, show all items.
    if (!searchQuery) return true

    // --- If `itemSearch` is a string, use it as a path to compare with.
    if (typeof options.itemSearch === 'string') {
      // @ts-expect-error: ignore
      const comparedWith: string = get(item, options.itemSearch)?.toString()
      return comparedWith.includes(searchQuery)
    }

    // --- If `itemSearch` is a function, use it to compare with.
    if (typeof options.itemSearch === 'function')
      return options.itemSearch(searchQuery, item)

    // --- Otherwise, compare with value.
    // @ts-expect-error: ignore
    const comparedWith: string = get(item, options.itemText)?.toString()
    return comparedWith.includes(searchQuery)
  }

  // --- Toggle item.
  const toggle = (value: V, selected?: boolean) => {
    // --- If not multiple, set value.
    if (!options.multiple) { modelValue.value = value }

    // --- If multiple but value is not an array, initialize array.
    else if (Array.isArray(modelValue.value)) {
      modelValue.value = (selected ?? isSelected(value))
        ? modelValue.value.filter(x => x !== value)
        : [...modelValue.value, value]
    }

    // --- If multiple, toggle item.
    else { modelValue.value = [value] }
  }

  // --- Clear the model value.
  const clear = () => {
    modelValue.value = options.multiple ? [] : undefined
  }

  // --- Computed list items
  const items = computed(() => Object.entries(options.items)
    .map(([key, item]) => {
      // --- Get value, default to key if `itemValue` is not defined.
      const value: any = options.itemValue
        ? get(item, options.itemValue, item)
        : key

      // --- Return object.
      return {
        item,
        value,
        text: get(item, options.itemText, key),
        disabled: !!get(item, options.itemDisabled, false),
        isVisible: (searchQuery: string) => isVisible(searchQuery, item),
        isSelected: () => isSelected(value),
        toggle() { toggle(value) },
        add() { toggle(value, false) },
        remove() { toggle(value, true) },
      } as unknown as ListItem<T, V>
    }),
  )

  // --- Computed selected items.
  const itemsSelected = computed(() => (Array.isArray(modelValue.value)
    ? modelValue.value.map(value => items.value.find(item => item.value === value))
    : [items.value.find(item => item.value === modelValue.value)].filter(Boolean)
  ))

  // --- Return items.
  return { items, itemsSelected, toggle, clear, isSelected, isVisible } as any
}
