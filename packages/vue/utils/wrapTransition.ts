/* eslint-disable unicorn/prevent-abbreviations */
import { mount } from '@vue/test-utils'
import { Transition, TransitionGroup, TransitionProps, VNode, h } from 'vue'

type RawChildrenOrSlots = Parameters<typeof h>[2]

export interface WrapTransitionOptions<T extends boolean = boolean> extends TransitionProps {
  /**
   * Whether to wrap the VNode in a `TransitionGroup` instead
   */
  isGroup?: T
}

export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T): T
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: any[] & T, options: WrapTransitionOptions): VNode
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
if (import.meta.vitest) {
  // @vitest-environment happy-dom
  const div = h('div', { key: '1' })

  it('should wrap a single VNode in a Transition component', () => {
    const result = wrapTransition(div, { name: 'fade' })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ name: 'fade' })
    expect(result.type).toStrictEqual(Transition)
    expect(result).not.toEqual(div)
    expect(html).toEqual('<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  it('should wrap an array of VNodes wiinth a TransitionGroup component', () => {
    const result = wrapTransition([div, div], { name: 'fade' })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ name: 'fade' })
    expect(result.type).toStrictEqual(TransitionGroup)
    expect(result).not.toEqual([div, div])
    expect(html).toEqual('<div></div>\n<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  it('should wrap a single VNode in a TransitionGroup component', () => {
    const result = wrapTransition(div, { name: 'fade', isGroup: true })
    const html = mount({ render: () => result }).html()
    expect(result.props).toStrictEqual({ name: 'fade', key: '1' })
    expect(result.type).toStrictEqual(TransitionGroup)
    expect(result).not.toEqual(div)
    expect(html).toEqual('<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  it('should not wrap a single VNode if no options are provided', () => {
    const result = wrapTransition(div)
    const html = mount({ render: () => result }).html()
    expect(result).toEqual(div)
    expect(html).toEqual('<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode>()
  })

  it('should not wrap multiple VNodes if no options are provided', () => {
    const vnodes = [div, div]
    const result = wrapTransition(vnodes)
    const html = mount({ render: () => result }).html()
    expect(result).toEqual(vnodes)
    expect(html).toEqual('<div></div>\n<div></div>')
    expectTypeOf(result).toEqualTypeOf<VNode[]>()
  })
}
