import { Component, defineComponent, h, resolveComponent } from 'vue'

export type ResolvedComponent<K extends string> = K extends keyof HTMLElementTagNameMap ? K : Component | string

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
export function resolveComponentType<K extends string = string>(type: K): ResolvedComponent<K>
export function resolveComponentType(type: string): Component | string {
  return /^[A-Z]/.test(type) ? resolveComponent(type) : type
}

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { mount } = await import('@vue/test-utils')

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
}
