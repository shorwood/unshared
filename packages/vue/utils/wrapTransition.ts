import { Transition, TransitionGroup, TransitionProps, VNode, h } from 'vue'

type RawChildrenOrSlots = Parameters<typeof h>[2]

export interface WrapTransitionOptions<T extends boolean = boolean> extends TransitionProps {
  /**
   * Whether to wrap the VNode in a `TransitionGroup` instead
   */
  isGroup?: T
}

export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T): T
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T & any[], options: WrapTransitionOptions): VNode
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T, options: WrapTransitionOptions): VNode
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T, options?: WrapTransitionOptions): T | VNode
/**
 * Wrap a VNode with a `Transition` component
 *
 * @param vnode The VNode to wrap
 * @param options The transition options
 * @returns The wrapped VNode or VNode array
 * @example
 * // Create a ref to control the visibility of the wrapped VNode.
 * const isVisible = ref(true)
 *
 * // Wrap a VNode with a `Transition` component.
 * const transitionDiv = wrapTransition(isVisible && h('div', 'Hello'), {
 *   name: 'fade',
 *   mode: 'out-in',
 * })
 */
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T, options?: WrapTransitionOptions): T | VNode {
  if (!options) return vnode
  const { isGroup, ...transitionOptions } = options

  // --- Array of VNodes should be wrapped in a transition group.
  if (Array.isArray(vnode))
    return h(TransitionGroup, transitionOptions, () => vnode)

  // --- Replace the vnode with a transition group.
  if (isGroup && typeof vnode === 'object')
    return h(TransitionGroup, { ...transitionOptions, ...vnode.props as object }, () => vnode)

  // --- Wrap the vnode in a transition.
  return h(Transition, transitionOptions, () => vnode)
}

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { mount } = await import('@vue/test-utils')
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
}
