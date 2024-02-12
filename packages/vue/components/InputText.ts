/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/no-null */
import { isTruthy, pick } from '@hsjm/shared'
import { useVModel } from '@vueuse/core'
import { PropType, computed, defineComponent, getCurrentInstance, h, mergeProps } from 'vue-demi'
import { UseInputListOptions, useInputList } from '../composables'
import { exposeToDevtool } from '../utils'

export default defineComponent({
  name: 'InputText',
  inheritAttrs: true,
  props: {
    // --- Options.
    type: { type: String as PropType<HTMLInputElement['type'] | 'list' | 'select'>, default: 'text' },
    autocomplete: String as PropType<HTMLInputElement['autocomplete']>,
    name: String,
    required: Boolean,
    multiple: Boolean,

    // --- State
    modelValue: {} as PropType<any>,
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- List
    items: { type: [Array, Object] as PropType<UseInputListOptions['items']>, default: () => ({}) },
    itemText: [String, Function] as PropType<UseInputListOptions['itemText']>,
    itemValue: [String, Function] as PropType<UseInputListOptions['itemValue']>,
    itemDisabled: [String, Function] as PropType<UseInputListOptions['itemDisabled']>,

    // --- Classes
    classOption: String,
  },
  emits: [
    'update:modelValue',
  ],
  setup: (props, { attrs, slots, emit }) => {
    // --- Initialize two-way bindings and items.
    const modelValue = useVModel(props, 'modelValue', emit, { passive: true })
    const { items } = useInputList(modelValue, props)

    // --- Computed input tagname.
    const is = computed(() => {
      switch (props.type) {
        case 'select': { return 'select' }
        case 'textarea': { return 'textarea' }
        default: { return 'input' }
      }
    })

    // --- Computed component type.
    const type = computed(() => {
      switch (props.type) {
        case 'list': { return null }
        case 'select': { return null }
        case 'textarea': { return null }
        default: { return props.type }
      }
    })

    // --- Expose to Vue Devtools for debugging.
    const slotProps = exposeToDevtool({ is, type, items, modelValue })

    // --- Handler input change.
    // --- If input is a <select>, get selected item values.
    const handleInput = ({ target }: { target: any }) => {
      modelValue.value = target.tagName === 'SELECT' && target.multiple === true
        ? [...target.options].filter(option => option.selected).map(option => option.value)
        : target.value
    }

    // --- Return virtual DOM node.
    return () => {
      // --- Get input props.
      const nodeProps = mergeProps(attrs, pick({
        'name': props.name,
        'type': type.value,
        'disabled': props.disabled,
        'readonly': props.readonly,
        'aria-disabled': props.disabled,
        'aria-readonly': props.readonly,
        'aria-busy': props.loading,
        'aria-required': props.required,
        'multiple': props.multiple,
        'onInput': handleInput,
        'value': modelValue.value,
      }, isTruthy))

      // --- Create and return <input/textarea> node.
      if (props.type !== 'list' && props.type !== 'select')
        return h(is.value, nodeProps)

      // --- Create <option> nodes.
      const nodeOptions = slots.options?.(slotProps) ?? items.value.map((item) => {
        if (slots.option) return slots.option(item)

        // --- Default with option node.
        const selected = item.isSelected()
        return h('option', pick({
          'value': item.value,
          'disabled': item.disabled,
          'selected': selected,
          'aria-disabled': item.disabled,
          'aria-selected': selected,
          'class': props.classOption,
        }, isTruthy), item.text)
      })

      // --- Create and return <input> and <datalist> nodes.
      if (props.type === 'list') {
        const inputName = props.name ?? getCurrentInstance()?.uid.toString()
        const listName = `${inputName}-list`
        return [
          h('input', { ...nodeProps, list: listName }),
          h('datalist', { id: listName }, nodeOptions),
        ]
      }

      // --- Create and return <select> nodes.
      if (props.type === 'select')
        return h('select', nodeProps, nodeOptions)
    }
  },
})
