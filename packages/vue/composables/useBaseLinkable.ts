import { LocationQuery, RouterLink } from 'vue-router'
import { ComponentObjectPropsOptions, ExtractPropTypes, Prop, computed, provide } from 'vue'
import { toReactive } from '@vueuse/core'

export const BASE_LINKABLE_PROPS = {
  /**
   * The class to apply when the link is active. This allows you to customize
   * the appearance of the link when it is active without handling the CSS in
   * the component itself.
   *
   * @default undefined
   */
  classActive: { default: '', type: [String] } as Prop<string>,
  /**
   * The class to apply when the link is active and the URL matches exactly.
   * This allows you to customize the appearance of the link when it is active
   * and the URL matches exactly without handling the CSS in the component
   * itself.
   *
   * @default undefined
   */
  classActiveExact: { default: '', type: [String] } as Prop<string>,
  /**
   * If `true`, the link should open in a new tab. By default, the link will
   * open in the same tab as trigger a navigation event.
   *
   * @default false
   */
  newtab: Boolean as Prop<boolean>,
  /**
   * If `true`, the link should replace the current URL in the history stack.
   * This can be useful when navigating between similar pages or when you want
   * to prevent the user from navigating back to the previous page.
   *
   * @default false
   */
  replace: Boolean as Prop<boolean>,
  /**
   * The URL to link to when the component is clicked. This is used to create a
   * link to another page or website when the component is clicked.
   *
   * @default undefined
   */
  to: [Object, String] as Prop<LocationQuery | string>,
} satisfies ComponentObjectPropsOptions

/** The properties of the base linkable component. */
export type BaseLinkableProps = ExtractPropTypes<typeof BASE_LINKABLE_PROPS>

/**
 * A composable that provides properties and methods to create a Vue link or
 * external hyperlink. This composable will dynamically determine the type of
 * link to use based on the provided properties.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseLinkable(props: BaseLinkableProps) {

  // --- Determine the type of link based on the provided properties.
  const isLink = computed(() => props.to !== undefined)
  const isExternalLink = computed(() => isLink.value && typeof props.to === 'string' && !props.to?.startsWith('/'))
  const isInternalLink = computed(() => isLink.value && !isExternalLink.value)

  // --- Compute component type.
  const is = computed(() => {
    if (isInternalLink.value) return RouterLink
    if (isExternalLink.value) return 'a'
  })

  // --- Compute internal link props.
  const attributes = computed(() => ({
    activeClass: isInternalLink.value ? props.classActive : undefined,
    exactActiveClass: isInternalLink.value ? props.classActiveExact : undefined,
    href: isExternalLink.value ? props.to : undefined,
    rel: isExternalLink.value ? (props.newtab ? 'noreferrer' : undefined) : undefined,
    replace: isInternalLink.value ? props.replace : undefined,
    target: isExternalLink.value ? (props.newtab ? '_blank' : undefined) : undefined,
    to: isInternalLink.value ? props.to : undefined,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, is, isExternalLink, isInternalLink, isLink })
  provide('baseLinkable', composable)
  return composable
}
