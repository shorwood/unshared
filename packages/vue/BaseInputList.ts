/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { ListOption, UseBaseInputListOptions } from './useBaseInputList'
import type { BaseRenderableOptions } from './useBaseRenderable'
import type { BaseStateOptions } from './useBaseState'
import { refDebounced } from '@vueuse/core'
import { computed, getCurrentInstance, h, mergeProps, ref } from 'vue'
import { cleanAttributes } from './cleanAttributes'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_INPUT_LIST_OPTIONS, useBaseInputList } from './useBaseInputList'
import { BASE_RENDERABLE_OPTIONS } from './useBaseRenderable'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

const BASE_INPUT_LIST_PROPS = {
  ...BASE_STATE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_INPUT_LIST_OPTIONS,
  label: String,
  native: Boolean,
  placeholder: String,
  classSearch: {},
  classOption: {},
  classOptions: {},
  classValues: {},
  classValue: {},
} satisfies Record<keyof BaseInputProps<any, any, any>, Prop<unknown>>

export interface BaseInputProps<T, V, M extends boolean> extends
  BaseStateOptions,
  BaseRenderableOptions,
  UseBaseInputListOptions<T, V, M> {

  /**
   * The label for the input list. This is used to create an accessible
   * label for the input list.
   *
   * @example 'Select a color'
   */
  label?: string

  /**
   * If true, the input list will be a native input element. This will render
   * a native `<select>` or `<datalist>` element instead of a custom list.
   * This is useful when you want to use the native browser features for
   * accessibility and usability.
   *
   * @default false
   */
  native?: boolean

  /**
   * Placeholder text to display in the search input when the list is searchable.
   * This is used to provide a hint to the user about what they can search for.
   */
  placeholder?: string

  /**
   * The classes to apply to the search input. This can be used to style the
   * search input field when the list is searchable and is a custom implementation.
   *
   * @example 'bg-white'
   */
  classSearch?: string

  /**
   * The classes to apply to the option element. This can be used to style the
   * option elements when the list is either a native input or a custom
   * implementation.
   *
   * @example 'bg-white text-black'
   */
  classOption?: string

  /**
   * The classes to apply to the options container. This can be used to style
   * the options container when the list is either a native input or a custom
   * implementation.
   *
   * @example 'bg-white text-black'
   */
  classOptions?: string

  /**
   * The classes to apply to the value container. This can be used to style
   * the values container when the list is not a native input.
   *
   * @example 'bg-white text-black'
   */
  classValues?: string

  /**
   * The classes to apply to a single value. This can be used to style the
   * value when the list is not a native input.
   *
   * @example 'bg-white text-black'
   */
  classValue?: string
}

/** Slot input for the `BaseInputList` component. */
export interface BaseInputListSlotProps<T, V> {
  options: Array<ListOption<T, V>>
  values: Array<ListOption<T, V>>
  isOpen: boolean
}

/** The slots of the `BaseInputList` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseInputListSlots<T, V> = {
  search: (options: BaseInputListSlotProps<T, V>) => VNode
  options: (options: BaseInputListSlotProps<T, V>) => VNode
  option: (option: ListOption<T, V>) => VNode
  values: (options: BaseInputListSlotProps<T, V>) => VNode
  value: (options: ListOption<T, V>) => VNode
  empty: (options: BaseInputListSlotProps<T, V>) => VNode
}

export const BaseInputList = defineSetupComponent(
  <T, V, M extends boolean>(props: BaseInputProps<T, V, M>, { attrs, slots }: DefineComponentContext<BaseInputListSlots<T, V>>) => {

    // --- Initialize reactive properties.
    const instance = getCurrentInstance()
    const state = useBaseState(props, instance)
    const input = useBaseInputList<T, V, M>(props, instance)
    const is = computed(() => props.as ?? 'div')
    const isOpen = ref(false)
    const isOpenDebounced = refDebounced(isOpen, 20)

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({ is, state, input })

    // --- Get input props.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
    ))

    // --- The slot properties.
    const slotProps = computed<BaseInputListSlotProps<T, V>>(() => ({
      options: input.options,
      values: input.selected,
      isOpen: isOpenDebounced.value,
    }))

    /**
     * Create an <option> node for the input list. If a slot is provided, it will
     * be used to create the node.
     *
     * @param option The option to create the option for.
     * @returns The VNode for the `<option>` node.
     */
    function createOption(option: ListOption<T, V>): VNode {
      return h('option', cleanAttributes({
        'key': option.value,
        'value': option.value,
        'disabled': option.isDisabled() || undefined,
        'selected': option.isSelected(),
        'aria-disabled': option.isDisabled() || undefined,
        'aria-selected': option.isSelected() || undefined,
        'class': props.classOption,
      }), option.text)
    }

    /**
     * Create the VNode for the input list if the tag is a <select> or <input>
     * with a list attribute.
     *
     * @returns The VNode for the input list.
     */
    function createSelect(): VNode {
      const options = input.options.filter(option => option.isVisible).map(createOption)
      return h('select', mergeProps(
        attributes.value,
        cleanAttributes({
          multiple: props.multiple || undefined,
          onInput: (event: { target: HTMLSelectElement } & InputEvent) => {
            event.preventDefault()
            event.stopPropagation()
            // @ts-expect-error: `model` is a `V[]`.
            input.model = props.multiple
              ? [...event.target.selectedOptions].map(option => option.value as V)
              : event.target.value as V
          },
        }),
      ), options)
    }

    /**
     * Create the VNode for the input list if the tag is a <datalist>.
     *
     * @returns The VNode for the input list.
     */
    // function createDatalist(): VNode {
    //   const id = instance!.uid.toString()
    //   const options = input.options.filter(option => option.isVisible).map(createOption)
    //   return h('div', attributes.value, [
    //     h('input', { list: `list-${id}` }),
    //     h('datalist', { id: `list-${id}` }, options),
    //   ])
    // }

    /**
     * Create the VNode for the search input if the list is searchable.
     *
     * @returns The VNode for the search input.
     */
    function createSearchInput(): VNode {
      if (slots.search) return slots.search(slotProps.value)
      return h('input', cleanAttributes({
        type: 'text',
        class: props.classSearch,
        disabled: props.disabled,
        readonly: props.readonly ?? !props.optionFilter,
        placeholder: props.placeholder,
        value: input.search,
        onFocusin: () => isOpen.value = true,
        onFocusout: () => isOpen.value = false,
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            input.pushSearch()
          }
        },
        onInput: (event: { target: HTMLInputElement } & InputEvent) => {
          event.preventDefault()
          event.stopPropagation()
          input.search = event.target.value
        },
      }))
    }

    /**
     * Create the VNode for the list of items in the input list.
     *
     * @returns The VNode for the list of items.
     */
    function createList() {
      if (slots.options) return slots.options(slotProps.value)
      if (!isOpenDebounced.value) return

      // --- Create the VNodes for the list of items.
      const options = input.options
        .filter(option => option.isVisible)
        .map(option => h('li', cleanAttributes({
          'role': 'option',
          'disabled': option.isDisabled() || undefined,
          'selected': option.isSelected() || undefined,
          'aria-disabled': option.isDisabled() || undefined,
          'aria-selected': option.isSelected() || undefined,
          'class': props.classOption,
          'onClick': option.toggle,
        }), slots.option?.(option) ?? option.text))

      // --- If the list is empty, use the `empty` slot.
      return h(
        'ul',
        { role: 'list', class: props.classOptions },
        options.length === 0 ? slots.empty?.(slotProps.value) : options,
      )
    }

    /**
     * Create a VNode to display the current value of the input list.
     *
     * @returns The VNode for the value of the input list.
     */
    function createListValues(): VNode {

      // --- Create the VNodes for the list of values.
      const vnodeValues = slots.values?.(slotProps.value) ?? input.selected.map(option => h(
        'span',
        cleanAttributes({ class: props.classValue }),
        slots.value?.(option) ?? option.text,
      ))

      return h('div', cleanAttributes({ class: props.classValues }), vnodeValues)
    }

    /**
     * Create the custom VNode for the input list if the tag is not a
     * native input or select element. This will create a search input
     * and a list of items.
     *
     * @returns The VNode for the input list.
     */
    function createListGroup(): VNode {
      const vnodeSearch = createSearchInput()
      const vnodeValue = createListValues()
      const vnodeList = createList()
      return h(
        is.value,
        mergeProps(
          attrs,
          state.attributes,
          {
            'tabindex': '0',
            'role': 'listbox',
            'aria-multiselectable': props.multiple,
            'aria-expanded': isOpen.value,
            'onFocus': (event: { target: HTMLElement } & Event) => event.target.querySelector('input')?.focus(),
          },
        ),
        [vnodeValue, vnodeSearch, vnodeList],
      )
    }

    // --- Return virtual DOM node.
    return () => {
      if (!props.native) return createListGroup()
      return createSelect()
    }
  },
  {
    name: 'BaseInputList',
    props: BASE_INPUT_LIST_PROPS,
  },
)
