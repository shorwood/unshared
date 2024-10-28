import type { TransitionProps, VNode } from 'vue'
import { h, Transition, TransitionGroup } from 'vue'

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
