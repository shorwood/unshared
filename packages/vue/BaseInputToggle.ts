import { VNode, computed, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions } from './useBaseRenderable'
import { BASE_INPUT_TOGGLE_OPTIONS, BaseInputToggleOptions, ToggleType, useBaseInputToggle } from './useBaseInputToggle'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseInputToggle` component. */
export const BASE_INPUT_TOGGLE_PROPS = {
  ...BASE_INPUT_TOGGLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
}

/** The properties of the `BaseInputToggle` component. */
export interface BaseInputToggleProps<T, U extends ToggleType> extends
  BaseStateOptions,
  BaseInputToggleOptions<T, U>,
  BaseRenderableOptions {}

/** The properties of the `BaseInputToggle` default slot. */
export interface BaseInputToggleSlotProps {
  error?: Error | string
  errorMessage?: string | undefined
  isActive: 'mixed' | boolean
  isDisabled: boolean
  isLoading: boolean
  isReadonly: boolean
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseInputToggleSlots = {
  default?: (props: BaseInputToggleSlotProps) => VNode
}

export const BaseInputToggle = /* #__PURE__ */ defineSetupComponent(
  <T, U extends ToggleType>(props: BaseInputToggleProps<T, U>, { attrs, slots }: DefineComponentContext<BaseInputToggleSlots>) => {
    const state = useBaseState(props)
    const toggle = useBaseInputToggle<T, U>(props)

    // --- Build the props object.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      toggle.attributes,
    ))

    // --- Build the slot properties.
    const slotProps = computed<BaseInputToggleSlotProps>(() => ({
      error: state.error,
      errorMessage: state.errorMessage,
      isActive: toggle.isActive,
      isDisabled: state.disabled,
      isLoading: state.loading,
      isReadonly: state.readonly,
    }))

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({
      attributes,
      state,
      toggle,
    })

    // --- Return virtual DOM node.
    return () => h(
      toggle.is,
      attributes.value,
      slots.default?.(slotProps.value),
    )
  },
  {
    name: 'BaseInputToggle',
    props: BASE_INPUT_TOGGLE_PROPS,
  },
)

/* v8 ignore start */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { mount } = await import('@vue/test-utils')
  const { nextTick } = await import('vue')

  describe('inputToggle', () => {
    it('should render a simple input by default', () => {
      const wrapper = mount(BaseInputToggle)
      const html = wrapper.html()
      expect(html).toBe('<input type="checkbox">')
    })

    it('shoud apply the corresponding html attributes when tag is input', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'input' } })
      const html = wrapper.html()
      expect(html).toBe('<input type="checkbox">')
    })

    it('should apply the corresponding html attributes when tag is not input', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'div' } })
      const html = wrapper.html()
      expect(html).toBe('<div aria-pressed="false" role="checkbox" tabindex="0"></div>')
    })
  })

  describe('switch', () => {
    it('should set the type to switch by default', () => {
      const wrapper = mount(BaseInputToggle)
      const type = wrapper.props('type')
      expect(type).toBe('switch')
    })

    it('should apply the corresponding html attributes when tag is input', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'input', type: 'switch', modelValue: true } })
      const html = wrapper.html()
      const element = wrapper.find('input').element
      expect(html).toBe('<input checked="" type="checkbox">')
      expect(element.checked).toBe(true)
    })

    it('should apply the corresponding html attributes when tag is button', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'button', type: 'switch', modelValue: true } })
      const html = wrapper.html()
      expect(html).toBe('<button selected="true" aria-selected="true" aria-pressed="true" role="checkbox" tabindex="0"></button>')
    })

    it('should apply the corresponding html attributes when tag is div', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'div', type: 'switch', modelValue: true } })
      const html = wrapper.html()
      expect(html).toBe('<div selected="true" aria-selected="true" aria-pressed="true" role="checkbox" tabindex="0"></div>')
    })

    it('should switch the modelValue to `true` when clicked', async() => {
      const wrapper = mount({
        components: { BaseInputToggle },
        template: '<BaseInputToggle v-model="modelValue" type="switch" />',
        data: () => ({ modelValue: false }),
      })
      wrapper.find('input').element.click()
      await nextTick()
      expect(wrapper.vm.modelValue).toBe(true)
    })
  })

  describe('radio', () => {
    it('should set the type to radio', () => {
      const wrapper = mount(BaseInputToggle, { props: { type: 'radio' } })
      const type = wrapper.props('type')
      expect(type).toBe('radio')
    })

    it('should apply the corresponding html attributes when tag is input', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'input', type: 'radio', modelValue: 'value', value: 'value' } })
      const html = wrapper.html()
      expect(html).toBe('<input type="radio">')
    })

    it('should apply the corresponding html attributes when tag is button', () => {
      const wrapper = mount(BaseInputToggle, { props: { as: 'button', type: 'radio', modelValue: 'value', value: 'value' } })
      const html = wrapper.html()
      expect(html).toBe('<button aria-pressed="false" role="radio" tabindex="0"></button>')
    })

    it('should switch the modelValue to `value` when clicked', async() => {
      const wrapper = mount({
        components: { BaseInputToggle },
        template: '<BaseInputToggle v-model="modelValue" value="Hello, World!" type="radio" />',
        data: () => ({ modelValue: undefined }),
      })
      wrapper.find('input').element.click()
      await nextTick()
      expect(wrapper.vm.modelValue).toBe('Hello, World!')
    })
  })

  // describe('attributes', () => {
  //   it('should render template slots', () => {
  //     const wrapper = mount(BaseInputToggle, { slots: { default: h('span', 'slot') } })
  //     const html = wrapper.html()
  //     expect(html).toStrictEqual('<div><span>slot</span></div>')
  //   })

  // it('should pass isActive to the slot', () => {
  //   const wrapper = mount(BaseInputToggle, {
  //     props: { type: 'switch', modelValue: true },
  //     slots: { default: ({ isActive }) => h('span', { 'is-active': isActive }) },
  //   })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div><span is-active="true"></span></div>')
  // })

  // it('should render a simple checkbox by default', () => {
  //   const wrapper = mount(BaseInputToggle)
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div></div>')
  // })

  // it('should set the tag name when the as prop is provided', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { as: 'div' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div></div>')
  // })

  // it('should set the component when the as prop is provided', () => {
  //   const Component = defineComponent({ template: '<h1><slot></slot></h1>' })
  //   const wrapper = mount(BaseInputToggle, { props: { as: markRaw(Component), disabled: true } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<h1 disabled="true" aria-disabled="true"></h1>')
  // })

  // it('should not apply the active class when it is not provided', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { type: 'switch', modelValue: true } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div></div>')
  // })

  // it('should apply the active class when input is active', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { type: 'switch', modelValue: true, classActive: 'active' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div class="active"></div>')
  // })

  // it('should set the disabled attribute when the disabled prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { disabled: true } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div disabled="true" aria-disabled="true"></div>')
  // })

  // it('should apply the disabled class when the disabled prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { disabled: true, classDisabled: 'disabled' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div disabled="true" aria-disabled="true" class="disabled"></div>')
  // })

  // it('should set the readonly attribute when the readonly prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { readonly: true } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div aria-readonly="true"></div>')
  // })

  // it('should apply the readonly class when the readonly prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { readonly: true, classReadonly: 'readonly' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div aria-readonly="true" class="readonly"></div>')
  // })

  // it('should set the aria-busy attribute when the loading prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { loading: true } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div aria-busy="true"></div>')
  // })

  // it('should apply the loading class when the loading prop is true', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { loading: true, classLoading: 'loading' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div aria-busy="true" class="loading"></div>')
  // })

  // it('should merge template attributes with component attributes', () => {
  //   const wrapper = mount(BaseInputToggle, { props: { disabled: true }, attrs: { 'aria-label': 'label' } })
  //   const html = wrapper.html()
  //   expect(html).toStrictEqual('<div aria-label="label" disabled="true" aria-disabled="true"></div>')
  // })
  //   })
  // }

}
