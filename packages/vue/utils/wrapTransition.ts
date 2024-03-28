/* eslint-disable unicorn/prevent-abbreviations */
import { Transition, TransitionGroup, TransitionProps, VNode, h } from 'vue-demi'

type RawChildrenOrSlots = Parameters<typeof h>[2]

/**
 * Wrap a VNode with a `Transition` component
 *
 * @param vnode The VNode to wrap
 * @param options The transition options
 * @param isGroup Whether to wrap the VNode in a `TransitionGroup` instead
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
export function wrapTransition<T extends RawChildrenOrSlots>(vnode: T, options: TransitionProps = {}, isGroup?: boolean): T | VNode {
  // --- Make sure there is a transition.
  if (!options) return vnode

  // --- Wrap the vnode in a transition group.
  if (Array.isArray(vnode))
    return h(TransitionGroup, options, () => vnode)

  // --- Replace the vnode with a transition group.
  if (isGroup && typeof vnode === 'object')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return h(TransitionGroup, { ...options, ...vnode.props as object, tag: vnode.type }, () => vnode.children)

  // --- Wrap the vnode in a transition.
  return h(Transition, options, () => vnode)
}
