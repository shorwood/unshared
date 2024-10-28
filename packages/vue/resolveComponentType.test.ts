import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { resolveComponentType } from './resolveComponentType'

// @vitest-environment happy-dom
describe('resolveComponentType', () => {
  const Component = defineComponent({
    props: {
      as: { required: true, type: String },
    },
    setup: props => () => h(
      resolveComponentType(props.as),
      { foo: 'bar' },
      { default: () => 'Hello World!' },
    ),
  })

  const Header = defineComponent({
    name: 'Header',
    render: () => h('h1', { foo: 'bar' }),
  })

  test('should resolve to an HTML Tag name', () => {
    const wrapper = mount(Component, { props: { as: 'span' } })
    const html = wrapper.html()
    expect(html).toBe('<span foo="bar">Hello World!</span>')
  })

  test('should resolve to a globally registered Vue component', () => {
    const wrapper = mount(Component, {
      global: { components: { Header } },
      props: { as: 'Header' },
    })
    const html = wrapper.html()
    expect(html).toBe('<h1 foo="bar"></h1>')
  })

  test('should warn if cannot resolve Vue component', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Component, { props: { as: 'NotExisting' } })
    expect(spy).toHaveBeenCalledOnce()
    expect(wrapper.html()).toBe('<notexisting foo="bar">Hello World!</notexisting>')
  })
})
