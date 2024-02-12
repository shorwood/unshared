/* eslint-disable unicorn/prevent-abbreviations */
import { Transition, TransitionGroup, TransitionProps, VNode, h } from 'vue-demi'
type RawChildrenOrSlots = Parameters<typeof h>[2]

/**
 * Wrap a VNode with a transition.
 * @param vnode VNode to wrap.
 * @param options Transition options.
 * @returns Wrapped VNode.
 * @example
 * import { h, ref } from 'vue'
 * import { wrapTransition } from '@hsjm/core'
 *
 * const isVisible = ref(true)
 * const transitionDiv = wrapTransition(isVisible && h('div', 'Hello'), {
 *   name: 'fade',
 *   mode: 'out-in',
 * })
 */
export const wrapTransition = <T extends RawChildrenOrSlots>(vnode: T, options: TransitionProps = {}, isGroup?: boolean): T | VNode => {
  // --- Make sure there is a transition.
  if (!options) return vnode

  // --- Wrap the vnode in a transition group.
  if (Array.isArray(vnode))
    return h(TransitionGroup, options, () => vnode)

  // --- Replace the vnode with a transition group.
  if (isGroup && typeof vnode === 'object')
    return h(TransitionGroup, { ...options, ...<any>vnode.props, tag: vnode.type }, () => vnode.children)

  // --- Wrap the vnode in a transition.
  return h(Transition, options, () => vnode)
}
