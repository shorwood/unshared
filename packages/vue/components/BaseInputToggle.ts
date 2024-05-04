import { SetupContext, VNode, computed, defineComponent, h, mergeProps } from 'vue'
import { pick } from '@unshared/collection/pick'
import { exposeToDevtool } from '../utils'
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

const PROPS = {
  ...BASE_TOGGLE_PROPS,
  ...BASE_STATE_PROPS,
  ...BASE_RENDERABLE_PROPS,
}

const SLOTS = {
  default: {} as (props: SlotProps) => VNode,
}

interface Props<T, U extends ToggleType> extends
  BaseStateProps,
  BaseToggleProps<T, U>,
  BaseRenderableProps {}

interface SlotProps {
  error?: Error | string
  errorMessage?: string
  isActive: boolean
  isDisabled: boolean
  isLoading: boolean
  isReadonly: boolean
  modelValue: unknown
}

type Context = SetupContext<[], Record<symbol, Partial<typeof SLOTS>>>

export const BaseInputToggle = /* #__PURE__ */ defineComponent(
  <T, U extends ToggleType>(props: Props<T, U>, context: Context) => {
    const { attrs, slots } = context
    const state = useBaseState(props)
    const toggle = useBaseToggle<T, U>(props)
    const renderable = useBaseRenderable(props)

    // --- Compute the type of the HTML/Component to render and the type of input.
    const is = computed(() => renderable.is ?? 'input')
    const type = computed(() => {
      if (is.value !== 'input') return
      return props.type === 'radio' ? 'radio' : 'checkbox'
    })

    // --- Build the props object.
    const attributes = computed(() => pick(mergeProps(
      attrs,
      state.attributes,
      toggle.attributes,
      { type: type.value },
    ), Boolean))

    // --- Build the slot properties.
    const slotProps = computed<SlotProps>(() => ({
      error: state.error,
      errorMessage: state.errorMessage,
      isActive: toggle.isActive,
      isDisabled: state.disabled,
      isLoading: state.loading,
      isReadonly: state.readonly,
      modelValue: toggle.model,
    }))

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({
      attributes,
      state,
      toggle,
    })

    // --- Return virtual DOM node.
    return () => h(
      is.value,
      attributes.value,
      () => slots.default?.(slotProps.value),
    )
  },
  {
    name: 'BaseInputToggle',
    props: PROPS as unknown as undefined,
    slots: { [Symbol()]: SLOTS },
  },
)

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { mount } = await import('@vue/test-utils')

  describe('inputToggle', () => {
    it('should render a simple button by default', () => {
      const wrapper = mount(BaseInputToggle)
      const html = wrapper.html()
      expect(html).toBe('<input role="checkbox" type="checkbox">')
    })
  })
}

// it('should expose setup properties to devtools', () => {
//   const wrapper = mount(InputToggle)
//   expect(wrapper.vm.$options.__VUE_DEVTOOLS_UID__).toBeDefined()
// })
// })

// describe('switch', () => {
//   it('should set the type to switch by default', () => {
//     const wrapper = mount(InputToggle)
//     const type = wrapper.props('type')
//     expect(type).toStrictEqual('switch')
//   })

//   it.each([false, 0, 1, undefined])
//     ('should switch the modelValue when clicked from %s to true', async(modelValue: unknown) => {
//     const wrapper = mount(InputToggle, { props: { modelValue } })
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toStrictEqual(true)
//   })

//   it('should switch the modelValue when clicked from true to false', async() => {
//     const wrapper = mount(InputToggle, { props: { modelValue: true } })
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toStrictEqual(false)
//   })
// })

// describe('checkbox', () => {
//   it('should add the value to the modelValue when clicked', async() => {
//     const wrapper = createComponent([], 'checkbox')
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toStrictEqual(['a'])
//   })

//   it('should remove the value from the modelValue when clicked', async() => {
//     const wrapper = createComponent([], 'checkbox')
//     wrapper.find('div').element.click()
//     await nextTick()
//     const value = wrapper.props('modelValue')
//     expect(value).toStrictEqual([])
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
//     expect(value).toStrictEqual('b')
//   })
// })

// describe('attributes', () => {
//   it('should render template slots', () => {
//     const wrapper = mount(InputToggle, { slots: { default: h('span', 'slot') } })
//     const html = wrapper.html()
//     expect(html).toStrictEqual('<div><span>slot</span></div>')
//   })

// it('should pass isActive to the slot', () => {
//   const wrapper = mount(InputToggle, {
//     props: { type: 'switch', modelValue: true },
//     slots: { default: ({ isActive }) => h('span', { 'is-active': isActive }) },
//   })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div><span is-active="true"></span></div>')
// })

// it('should render a simple checkbox by default', () => {
//   const wrapper = mount(InputToggle)
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div></div>')
// })

// it('should set the tag name when the as prop is provided', () => {
//   const wrapper = mount(InputToggle, { props: { as: 'div' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div></div>')
// })

// it('should set the component when the as prop is provided', () => {
//   const Component = defineComponent({ template: '<h1><slot></slot></h1>' })
//   const wrapper = mount(InputToggle, { props: { as: markRaw(Component), disabled: true } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<h1 disabled="true" aria-disabled="true"></h1>')
// })

// it('should not apply the active class when it is not provided', () => {
//   const wrapper = mount(InputToggle, { props: { type: 'switch', modelValue: true } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div></div>')
// })

// it('should apply the active class when input is active', () => {
//   const wrapper = mount(InputToggle, { props: { type: 'switch', modelValue: true, classActive: 'active' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div class="active"></div>')
// })

// it('should set the disabled attribute when the disabled prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div disabled="true" aria-disabled="true"></div>')
// })

// it('should apply the disabled class when the disabled prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true, classDisabled: 'disabled' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div disabled="true" aria-disabled="true" class="disabled"></div>')
// })

// it('should set the readonly attribute when the readonly prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { readonly: true } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div aria-readonly="true"></div>')
// })

// it('should apply the readonly class when the readonly prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { readonly: true, classReadonly: 'readonly' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div aria-readonly="true" class="readonly"></div>')
// })

// it('should set the aria-busy attribute when the loading prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { loading: true } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div aria-busy="true"></div>')
// })

// it('should apply the loading class when the loading prop is true', () => {
//   const wrapper = mount(InputToggle, { props: { loading: true, classLoading: 'loading' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div aria-busy="true" class="loading"></div>')
// })

// it('should merge template attributes with component attributes', () => {
//   const wrapper = mount(InputToggle, { props: { disabled: true }, attrs: { 'aria-label': 'label' } })
//   const html = wrapper.html()
//   expect(html).toStrictEqual('<div aria-label="label" disabled="true" aria-disabled="true"></div>')
// })
//   })
// }
