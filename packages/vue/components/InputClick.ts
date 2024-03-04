/* eslint-disable unicorn/no-null */
import { mount } from '@vue/test-utils'
import { useVModel } from '@vueuse/core'
import { Component, PropType, VNode, computed, defineComponent, h, markRaw, mergeProps, nextTick, toRefs } from 'vue-demi'
import { exposeToDevtool } from '../utils'

export const InputClick = defineComponent({
  name: 'InputClick',
  props: {
    as: { type: [Object, String] as PropType<Component | keyof HTMLElementTagNameMap>, default: 'button' },
    type: { type: String as PropType<'checkbox' | 'radio' | 'switch'>, default: 'checkbox' },

    // --- State.
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- Input.
    modelValue: [Boolean, Number, String, Array],
    value: [Boolean, Number, String],

    // --- Classes.
    classActive: String,
    classDisabled: String,
    classLoading: String,
    classReadonly: String,
  },
  emits: {
    'update:modelValue': {} as (value: unknown[] | boolean | number | string | undefined) => void,
    'update:disabled': {} as (value: boolean) => void,
    'update:readonly': {} as (value: boolean) => void,
    'update:loading': {} as (value: boolean) => void,
  },
  slots: {
    [Symbol()]: {
      default: {} as (props: { isActive: boolean }) => VNode,
    },
  },
  setup: (props, { attrs, slots, emit }) => {
    const { value, classActive, type, disabled, readonly, loading } = toRefs(props)
    const model = useVModel(props, 'modelValue', emit, { passive: true, eventName: 'update:modelValue' })

    // --- Compute reactive `isActive` state.
    const isActive = computed(() => {
      if (type.value === 'checkbox') return Array.isArray(model.value) && model.value.includes(value.value)
      if (type.value === 'radio') return model.value === value.value
      if (type.value === 'switch') return !!model.value
      return false
    })

    // --- Declare `toggle` method to handle click event.
    const toggle = () => {
      // --- If `switch`, just toggle the value.
      if (type.value === 'switch') {
        model.value = !model.value
      }

      // --- If `radio`, set the value.
      else if (type.value === 'radio') { model.value = value.value }

      // --- If `checkbox`, but value is not an array, wrap it in an array.
      else if (type.value === 'checkbox' && !Array.isArray(model.value)) {
        model.value = [value.value]
      }

      // --- If `checkbox`, add or remove value.
      else if (type.value === 'checkbox' && Array.isArray(model.value)) {
        model.value = isActive.value
          ? [...model.value].filter(x => x !== value.value)
          : [...model.value, value.value]
      }
    }

    // --- Expose to Vue Devtools for debugging.
    const slotProperties = exposeToDevtool({
      isActive: isActive.value,
    })

    // --- Dynamically compute classes.
    const classes = computed(() => [
      isActive.value && classActive.value,
      disabled.value && props.classDisabled,
      loading.value && props.classLoading,
      readonly.value && props.classReadonly,
    ].filter(Boolean))

    // --- Build the props object.
    const propsObject = computed(() => ({
      'disabled': disabled.value || undefined,
      'readonly': readonly.value || undefined,
      'aria-disabled': disabled.value || undefined,
      'aria-readonly': readonly.value || undefined,
      'aria-busy': loading.value || undefined,
      'class': classes.value.some(Boolean) ? classes.value : undefined,
      'onClick': toggle,
    }))

    // --- Return virtual DOM node.
    return () => h(
      props.as,
      mergeProps(attrs, propsObject.value),
      slots.default?.(slotProperties),
    )
  },
})

/* v8 ignore start */
if (import.meta.vitest) {
  // @vitest-environment happy-dom
  describe('switch', () => {
    it.each([undefined, false, 0])('should switch the modelValue when clicked from %s to true', async(initialValue) => {
      const wrapper = mount(InputClick, { props: {
        'type': 'switch',
        'modelValue': initialValue,
        'onUpdate:modelValue': (modelValue) => { void wrapper.setProps({ modelValue }) },
      } })
      wrapper.find('button').element.click()
      await nextTick()
      const value = wrapper.props('modelValue')
      expect(value).toBe(true)
    })

    it.each([true, 1])('should switch the modelValue when clicked from %s to false', async(initialValue) => {
      const wrapper = mount(InputClick, { props: {
        'type': 'switch',
        'modelValue': initialValue,
        'onUpdate:modelValue': (modelValue) => { void wrapper.setProps({ modelValue }) },
      } })
      wrapper.find('button').element.click()
      await nextTick()
      const value = wrapper.props('modelValue')
      expect(value).toBe(false)
    })
  })

  describe('checkbox', () => {
    it('should add the value to the modelValue when clicked', async() => {
      const wrapper = mount(InputClick, { props: {
        'type': 'checkbox',
        'modelValue': [],
        'value': 'a',
        'onUpdate:modelValue': (modelValue) => { void wrapper.setProps({ modelValue }) },
      } })
      wrapper.find('button').element.click()
      await nextTick()
      const value = wrapper.props('modelValue')
      expect(value).toEqual(['a'])
    })

    it('should remove the value from the modelValue when clicked', async() => {
      const wrapper = mount(InputClick, { props: {
        'type': 'checkbox',
        'modelValue': ['a'],
        'value': 'a',
        'onUpdate:modelValue': (modelValue) => { void wrapper.setProps({ modelValue }) },
      } })
      wrapper.find('button').element.click()
      await nextTick()
      const value = wrapper.props('modelValue')
      expect(value).toEqual([])
    })
  })

  describe('radio', () => {
    it('should set the modelValue to the value when clicked', async() => {
      const wrapper = mount(InputClick, { props: {
        'type': 'radio',
        'modelValue': 'a',
        'value': 'b',
        'onUpdate:modelValue': (modelValue) => { void wrapper.setProps({ modelValue }) },
      } })
      wrapper.find('button').element.click()
      await nextTick()
      const value = wrapper.props('modelValue')
      expect(value).toBe('b')
    })
  })

  describe('attributes', () => {
    it('should render template slots', () => {
      const wrapper = mount(InputClick, { slots: { default: h('span', 'slot') } })
      const html = wrapper.html()
      expect(html).toEqual('<button><span>slot</span></button>')
    })

    it('should pass isActive to the slot', () => {
      const wrapper = mount(InputClick, {
        props: { type: 'switch', modelValue: true },
        slots: { default: ({ isActive }) => h('span', { 'is-active': isActive }) },
      })
      const html = wrapper.html()
      expect(html).toEqual('<button><span is-active="true"></span></button>')
    })

    it('should render a simple checkbox by default', () => {
      const wrapper = mount(InputClick)
      const html = wrapper.html()
      expect(html).toEqual('<button></button>')
    })

    it('should set the tag name when the as prop is provided', () => {
      const wrapper = mount(InputClick, { props: { as: 'div' } })
      const html = wrapper.html()
      expect(html).toEqual('<div></div>')
    })

    it('should set the component when the as prop is provided', () => {
      const Component = defineComponent({ template: '<h1><slot></slot></h1>' })
      const wrapper = mount(InputClick, { props: { as: markRaw(Component), disabled: true } })
      const html = wrapper.html()
      expect(html).toEqual('<h1 disabled="true" aria-disabled="true"></h1>')
    })

    it('should not apply the active class when it is not provided', () => {
      const wrapper = mount(InputClick, { props: { type: 'switch', modelValue: true } })
      const html = wrapper.html()
      expect(html).toEqual('<button></button>')
    })

    it('should apply the active class when input is active', () => {
      const wrapper = mount(InputClick, { props: { type: 'switch', modelValue: true, classActive: 'active' } })
      const html = wrapper.html()
      expect(html).toEqual('<button class="active"></button>')
    })

    it('should set the disabled attribute when the disabled prop is true', () => {
      const wrapper = mount(InputClick, { props: { disabled: true } })
      const html = wrapper.html()
      expect(html).toEqual('<button disabled="" aria-disabled="true"></button>')
    })

    it('should apply the disabled class when the disabled prop is true', () => {
      const wrapper = mount(InputClick, { props: { disabled: true, classDisabled: 'disabled' } })
      const html = wrapper.html()
      expect(html).toEqual('<button disabled="" aria-disabled="true" class="disabled"></button>')
    })

    it('should set the readonly attribute when the readonly prop is true', () => {
      const wrapper = mount(InputClick, { props: { readonly: true } })
      const html = wrapper.html()
      expect(html).toEqual('<button readonly="" aria-readonly="true"></button>')
    })

    it('should apply the readonly class when the readonly prop is true', () => {
      const wrapper = mount(InputClick, { props: { readonly: true, classReadonly: 'readonly' } })
      const html = wrapper.html()
      expect(html).toEqual('<button readonly="" aria-readonly="true" class="readonly"></button>')
    })

    it('should set the aria-busy attribute when the loading prop is true', () => {
      const wrapper = mount(InputClick, { props: { loading: true } })
      const html = wrapper.html()
      expect(html).toEqual('<button aria-busy="true"></button>')
    })

    it('should apply the loading class when the loading prop is true', () => {
      const wrapper = mount(InputClick, { props: { loading: true, classLoading: 'loading' } })
      const html = wrapper.html()
      expect(html).toEqual('<button aria-busy="true" class="loading"></button>')
    })

    it('should merge template attributes with component attributes', () => {
      const wrapper = mount(InputClick, { props: { disabled: true }, attrs: { 'aria-label': 'label' } })
      const html = wrapper.html()
      expect(html).toEqual('<button aria-label="label" disabled="" aria-disabled="true"></button>')
    })
  })
}
