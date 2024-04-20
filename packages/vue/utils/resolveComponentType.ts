import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { Component, resolveComponent, defineComponent, h } from 'vue-demi'

/**
 * Dynamically resolves to a globally registered Vue component or an HTML tag.
 *
 * @param type The tag or component name to resolve.
 * @returns The locally registered component or tag name.
 * @example
 * // Resolves to a globally registered component.
 * resolveComponentType('MyComponent') // => MyComponent
 *
 * // Resolves to an HTML tag.
 * resolveComponentType('div') // => 'div'
 */
export function resolveComponentType<T extends Component, K extends string = string>(type: K): K extends keyof HTMLElementTagNameMap ? K : K | T
export function resolveComponentType(type: string): Component | string {
  return /^[A-Z]/.test(type)
    ? resolveComponent(type)
    : type
}

/* v8 ignore start */
if (import.meta.vitest) {
  // @vitest-environment happy-dom
  const Component = defineComponent({
    props: ['as'],
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

  it('resolves to an HTML Tag name', () => {
    const wrapper = mount(Component, { props: { as: 'span' } })
    const html = wrapper.html()
    expect(html).toEqual('<span foo="bar">Hello World!</span>')
  })

  it('resolves to a globally registered Vue component', () => {
    const wrapper = mount(Component, {
      props: { as: 'Header' },
      global: { components: { Header } },
    })
    const html = wrapper.html()
    expect(html).toEqual('<h1 foo="bar"></h1>')
  })

  it('warns if cannot resolve Vue component', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Component, { props: { as: 'NotExisting' } })
    expect(spy).toHaveBeenCalled()
    expect(wrapper.html()).toEqual('<notexisting foo="bar">Hello World!</notexisting>')
  })
}
