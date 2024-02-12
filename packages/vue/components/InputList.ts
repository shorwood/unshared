/* eslint-disable unicorn/consistent-function-scoping */

/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/no-null */
import { MaybeArray, arrayify, isTruthy, pick, toCamelCase } from '@hsjm/shared'
import { useVModel } from '@vueuse/core'
import { PropType, TransitionProps, VNode, defineComponent, h, mergeProps, ref } from 'vue-demi'
import { UseInputListOptions, useInputList, useOutsideEvent } from '../composables'
import { exposeToDevtool, wrapTransition } from '../utils'

export default defineComponent({
  name: 'InputList',
  inheritAttrs: true,
  props: {
    multiple: Boolean,
    searchable: Boolean,
    alwaysOpen: Boolean,

    openOn: {
      type: [String, Array] as PropType<MaybeArray<keyof HTMLElementEventMap>>,
      default: () => ['focusin', 'click'],
    },

    closeOn: {
      type: [String, Array] as PropType<MaybeArray<`${keyof HTMLElementEventMap}${'-outside' | ''}`>>,
      default: () => ['focusin-outside', 'click-outside'],
    },

    // --- State.
    modelValue: {} as PropType<any>,
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- Transitions.
    transitionList: Object as PropType<TransitionProps>,
    transitionItems: Object as PropType<TransitionProps>,

    // --- List
    items: { type: [Array, Object] as PropType<UseInputListOptions['items']>, default: () => ({}) },
    itemText: [String, Function] as PropType<UseInputListOptions['itemText']>,
    itemValue: [String, Function] as PropType<UseInputListOptions['itemValue']>,
    itemDisabled: [String, Function] as PropType<UseInputListOptions['itemDisabled']>,
    itemSearch: [String, Function] as PropType<UseInputListOptions['itemSearch']>,

    // --- Classes
    classItem: {} as PropType<any>,
    classSearch: {} as PropType<any>,
    classList: {} as PropType<any>,
    classListItem: {} as PropType<any>,
    classListBox: {} as PropType<any>,
  },
  emits: [
    'input',
    'change',
    'update:modelValue',
  ],
  setup: (props, { attrs, slots, emit }) => {
    // --- Initialize state.
    const modelValue = useVModel(props, 'modelValue', emit, { passive: true })
    const { items, itemsSelected } = useInputList(modelValue, props)
    const searchQuery = ref('')
    const searchKey = Symbol('search')
    const listOpen = ref(false)
    const listKey = Symbol('list')
    const close = () => listOpen.value = false
    const open = () => listOpen.value = true

    // --- Initialize refs.
    const inputElement = ref<HTMLDivElement | VNode | undefined>()
    const inputSearchElement = ref<HTMLDivElement | VNode | undefined>()

    // --- Handle evebts outside of the element.
    arrayify(props.closeOn)
      .filter(eventName => eventName.endsWith('-outside'))
      .forEach(eventName => useOutsideEvent(eventName.replace(/-outside$/, ''), close, inputElement))

    // --- Expose to Vue Devtools for debugging.
    const slotProps = exposeToDevtool({
      items,
      itemsSelected,
      listOpen,
      modelValue,
      searchQuery,
      inputElement,
    })

    // --- Create VNode of list and their items.
    const createVNodeList = () => {
      if (slots.list) return slots.list(slotProps)

      // --- Iterate over list items
      // --- Overwrite with item slot if provided.
      // --- Filter-out non visible items.
      // --- Default with li node.
      const vNodeListItems = items.value.map((item) => {
        if (slots['list-item']) return slots['list-item'](item)
        if (item.isVisible(searchQuery.value) === false) return null
        const selected = item.isSelected()
        return h('li', pick({
          'role': 'listitem',
          'disabled': item.disabled,
          'selected': selected,
          'aria-disabled': item.disabled,
          'aria-selected': selected,
          'class': props.classListItem,
          'onClick': () => {
            item.toggle()
            emit('input', new InputEvent('input', { bubbles: true }))
            emit('change', new InputEvent('change', { bubbles: true }))
          },
        }, isTruthy), slots.item?.(item) ?? item.text)
      })

      // --- Return list node.
      return h('ul', {
        key: listKey,
        role: 'list',
        class: props.classList,
      }, vNodeListItems)
    }

    // --- Create VNode of value items.
    return () => {
      // --- Iterate over values.
      const vNodeItems = itemsSelected.value.map(item => h(
        'span',
        pick({ key: item.value, class: props.classItem }, isTruthy),
        slots.item?.(item) ?? item.text,
      ))

      // --- Create automplete input if searchQueryable is enabled.
      const vNodeSearchInput = props.searchable && h('input', pick({
        key: searchKey,
        type: 'text',
        ref: inputSearchElement,
        class: props.classSearch,
        disabled: props.disabled,
        readonly: props.readonly,
        value: searchQuery.value,
        onInput: (event: InputEvent & { target: HTMLInputElement }) => {
          event.preventDefault()
          event.stopPropagation()
          searchQuery.value = event.target.value
        },
      }, isTruthy))

      // --- Build props
      const onOpenEvents = arrayify(props.openOn).map(eventName => [toCamelCase(`on-${eventName}`), open])
      const onCloseEvents = arrayify(props.closeOn).map(eventName => [toCamelCase(`on-${eventName}`), close])
      const inputEventHandlers = Object.fromEntries([...onOpenEvents, ...onCloseEvents])

      // --- Focus on search input if exists
      const handleFocus = (event: Event) => {
        const target = event.target as HTMLElement
        const inputSearch = target.querySelector('input')
        inputSearch?.focus()
      }

      // --- Return item group node.
      return h('div', mergeProps(
        attrs,
        inputEventHandlers,
        pick({ tabIndex: -1, ref: inputElement, onFocus: handleFocus }, isTruthy),
      ), [
        wrapTransition([vNodeItems, vNodeSearchInput], props.transitionItems),
        wrapTransition(listOpen.value && createVNodeList(), props.transitionList),
      ])
    }
  },
})
