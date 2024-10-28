import type { VNode } from 'vue'
import { mount } from '@vue/test-utils'
import { h, Transition } from 'vue'
import { wrapTransition } from './wrapTransition'

// @vitest-environment happy-dom
describe('wrapTransition', () => {
  const div = h('div', { key: '1' })

  beforeAll(() => {
    vi.stubGlobal('console', { warn: () => {} })
  })

  test('should wrap a single VNode in a Transition component', () => {
    const result = wrapTransition(div, { name: 'fade' })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ name: 'fade' })
    expect(result.type).toStrictEqual(Transition)
    expect(result).not.toStrictEqual(div)
    expect(html).toBe([
      '<transition-stub appear="false" persisted="false">',
      '  <div></div>',
      '</transition-stub>',
    ].join('\n'))
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  test('should wrap an array of VNodes within a TransitionGroup component', () => {
    const result = wrapTransition([div, div], { name: 'fade' })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ name: 'fade' })
    expect(result).not.toStrictEqual([div, div])
    expect(html).toBe([
      '<transition-group-stub name="fade" appear="false" persisted="false" css="true">',
      '  <div></div>',
      '  <div></div>',
      '</transition-group-stub>',
    ].join('\n'))
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  test('should wrap a single VNode in a TransitionGroup component', () => {
    const result = wrapTransition(div, { isGroup: true, name: 'fade' })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ key: '1', name: 'fade' })
    expect(result).not.toStrictEqual(div)
    expect(html).toBe([
      '<transition-group-stub name="fade" appear="false" persisted="false" css="true">',
      '  <div></div>',
      '</transition-group-stub>',
    ].join('\n'))
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  test('should not wrap a single VNode if no options are provided', () => {
    const result = wrapTransition(div)
    const html = mount({ render: () => result }).html()
    expect(result).toStrictEqual(div)
    expect(html).toBe('<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  test('should not wrap multiple VNodes if no options are provided', () => {
    const vnodes = [div, div]
    const result = wrapTransition(vnodes)
    const html = mount({ render: () => result }).html()
    expect(result).toStrictEqual(vnodes)
    expect(html).toBe('<div></div>\n<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode[]>()
  })
})
