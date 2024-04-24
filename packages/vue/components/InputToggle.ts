import { SetupContext, VNode, computed, defineComponent, h, mergeProps } from 'vue'
import {
  BASE_RENDERABLE_PROPS,
  BASE_STATE_PROPS,
  BASE_TOGGLE_PROPS,
  BaseRenderableProps,
  BaseStateProps,
  BaseToggleProps,
  ToggleType,
  useBaseRenderable,
  useBaseState,
  useBaseToggle,
} from '../composables'
import { exposeToDevtool } from '../utils'

interface Props<T, U extends ToggleType> extends
  BaseStateProps,
  BaseToggleProps<T, U>,
  BaseRenderableProps {}

interface SlotProps {
  isActive: boolean
  isLoading: boolean
  isDisabled: boolean
  isReadonly: boolean
  modelValue: unknown
  error?: Error | string
  errorMessage?: string
}

type Context = SetupContext<[], Record<symbol, {
  default?: (props: SlotProps) => VNode
}>>

export const InputToggle = /* #__PURE__ */ defineComponent(
  <T, U extends ToggleType>(props: Props<T, U>, context: Context) => {
    const { slots, attrs } = context

    const state = useBaseState(props)
    const toggle = useBaseToggle<T, U>(props)
    const renderable = useBaseRenderable(props)

    // --- Build the props object.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      toggle.attributes,
    ))

    // --- Build the slot properties.
    const slotProps = computed<SlotProps>(() => ({
      isActive: toggle.isActive,
      isLoading: state.loading,
      isDisabled: state.disabled,
      isReadonly: state.readonly,
      modelValue: toggle.model,
      error: state.error,
      errorMessage: state.errorMessage,
    }))

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({
      attributes,
      toggle,
      state,
    })

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'div',
      attributes.value,
      () => slots.default?.(slotProps.value),
    )
  },
  {
    name: 'InputToggle',
    props: {
      ...BASE_TOGGLE_PROPS,
      ...BASE_STATE_PROPS,
      ...BASE_RENDERABLE_PROPS,
    } as unknown as undefined,
    slots: {
      [Symbol()]: {
        default: {} as (props: SlotProps) => VNode,
      },
    },
  },
)

/* v8 ignore start */
// @vitest-environment happy-dom
// if (import.meta.vitest) {
//   const { mount } = await import('@vue/test-utils')

// describe('InputToggle', () => {
//   it('should render a simple button by default', () => {
//     const wrapper = mount(InputToggle)
//     const html = wrapper.html()
//     expect(html).toEqual('<div></div>')
//   })

// it('should expose setup properties to devtools', () => {
//   const wrapper = mount(InputToggle)
//   expect(wrapper.vm.$options.__VUE_DEVTOOLS_UID__).toBeDefined()
// })
// })

// describe('switch', () => {
//   it('should set the type to switch by default', () => {
//     const wrapper = mount(InputToggle)
//     const type = wrapper.props('type')
//     expect(type).toEqual('switch')
//   })

//   it.each([false, 0, 1, undefined])('should switch the modelValue when clicked from %s to true', async(modelValue: unknown) => {
//     const wrapper = mount(InputToggle, { props: { modelValue } })
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toEqual(true)
//   })

//   it('should switch the modelValue when clicked from true to false', async() => {
//     const wrapper = mount(InputToggle, { props: { modelValue: true } })
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toEqual(false)
//   })
// })

// describe('checkbox', () => {
//   it('should add the value to the modelValue when clicked', async() => {
//     const wrapper = createComponent([], 'checkbox')
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toEqual(['a'])
//   })

//   it('should remove the value from the modelValue when clicked', async() => {
//     const wrapper = createComponent([], 'checkbox')
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toEqual([])
//   })
// })

// describe('radio', () => {
//   it('should set the modelValue to the value when clicked', async() => {
//     const wrapper = mount(InputToggle, { props: {
//       'type': 'radio',
//       'modelValue': 'a',
//       'value': 'b',
//       'onUpdate:modelValue': (modelValue: unknown) => { void wrapper.setProps({ modelValue }) },
//     } })
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toEqual('b')
//   })
// })

// describe('attributes', () => {
//   it('should render template slots', () => {
//     const wrapper = mount(InputToggle, { slots: { default: h('span', 'slot') } })
//     const html = wrapper.html()
//     expect(html).toEqual('<div><span>slot</span></div>')
//   })

// it('should pass isActive to the slot', () => {
//   const wrapper = mount(InputToggle, {
//     props: { type: 'switch', modelValue: true },
//     slots: { default: ({ isActive }) => h('span', { 'is-active': isActive }) },
//   })
//   const html = wrapper.html()
//   expect(html).toEqual('<div><span is-active="true"></span></div>')
// })

// it('should render a simple checkbox by default', () => {
//   const wrapper = mount(InputToggle)
//   const html = wrapper.html()
//   expect(html).toEqual('<div></div>')
// })

// it('should set the tag name when the as prop is provided', () => {
//   const wrapper = mount(InputToggle, { props: { as: 'div' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div></div>')
// })

// it('should set the component when the as prop is provided', () => {
//   const Component = defineComponent({ template: '<h1><slot></slot></h1>' })
//   const wrapper = mount(InputToggle, { props: { as: markRaw(Component), disabled: true } })
//   const html = wrapper.html()
//   expect(html).toEqual('<h1 disabled="true" aria-disabled="true"></h1>')
// })

// it('should not apply the active class when it is not provided', () => {
//   const wrapper = mount(InputToggle, { props: { type: 'switch', modelValue: true } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div></div>')
// })

// it('should apply the active class when input is active', () => {
//   const wrapper = mount(InputToggle, { props: { type: 'switch', modelValue: true, classActive: 'active' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div class="active"></div>')
// })

// it('should set the disabled attribute when the disabled prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div disabled="true" aria-disabled="true"></div>')
// })

// it('should apply the disabled class when the disabled prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true, classDisabled: 'disabled' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div disabled="true" aria-disabled="true" class="disabled"></div>')
// })

// it('should set the readonly attribute when the readonly prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { readonly: true } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div aria-readonly="true"></div>')
// })

// it('should apply the readonly class when the readonly prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { readonly: true, classReadonly: 'readonly' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div aria-readonly="true" class="readonly"></div>')
// })

// it('should set the aria-busy attribute when the loading prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { loading: true } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div aria-busy="true"></div>')
// })

// it('should apply the loading class when the loading prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { loading: true, classLoading: 'loading' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div aria-busy="true" class="loading"></div>')
// })

// it('should merge template attributes with component attributes', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true }, attrs: { 'aria-label': 'label' } })
//   const html = wrapper.html()
//   expect(html).toEqual('<div aria-label="label" disabled="true" aria-disabled="true"></div>')
// })
//   })
// }
