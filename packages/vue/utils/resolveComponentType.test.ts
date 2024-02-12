// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue-demi'
import { resolveComponentType } from './resolveComponentType'

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
  props: ['h'],
  render: () => h('h1', { foo: 'bar' }),
})

it('resolves to an HTML Tag name', () => {
  const wrapper = mount(Component, { props: { as: 'span' } })
  expect(wrapper.html()).toEqual('<span foo="bar">Hello World!</span>')
})

it('resolves to a Vue component', () => {
  const wrapper = mount(Component, {
    props: { as: 'Header' },
    global: { components: { Header } },
  })
  expect(wrapper.html()).toEqual('<h1 foo="bar"></h1>')
})

it('warns if cannot resolve Vue component', () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const wrapper = mount(Component, { props: { as: 'NotExisting' } })
  expect(spy).toHaveBeenCalled()
  expect(wrapper.html()).toEqual('<notexisting foo="bar">Hello World!</notexisting>')
})
