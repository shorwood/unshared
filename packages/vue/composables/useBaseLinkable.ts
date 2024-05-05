/* eslint-disable sonarjs/no-duplicate-string */
import { LocationQuery, RouterLink } from 'vue-router'
import { ComponentObjectPropsOptions, ExtractPropTypes, Prop, computed, getCurrentInstance } from 'vue'
import { toReactive } from '@vueuse/core'
import { cleanAttributes } from '../utils/cleanAttributes'

/** The symbol to provide the composable into the component. */
export const BASE_LINKABLE_SYMBOL = Symbol('baseLinkable')

/** The properties of the base linkable component. */
export const BASE_LINKABLE_PROPS = {

  /**
   * The class to apply when the link is active. This allows you to customize
   * the appearance of the link when it is active without handling the CSS in
   * the component itself.
   *
   * @default undefined
   */
  classActive: { type: String, default: '' } as Prop<string>,

  /**
   * The class to apply when the link is active and the URL matches exactly.
   * This allows you to customize the appearance of the link when it is active
   * and the URL matches exactly without handling the CSS in the component
   * itself.
   *
   * @default undefined
   */
  classActiveExact: { type: String, default: '' } as Prop<string>,

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

/** The properties of the base linkable composable. */
export interface BaseLinkable {

  /** The component to render the link as. */
  is: string | typeof RouterLink | undefined

  /** The attributes to apply to the link. */
  attributes: Record<string, unknown>

  /** Whether the link is an internal link. */
  isLink: boolean

  /** Whether the link is an external link. */
  isExternalLink: boolean

  /** Whether the link is an internal link. */
  isInternalLink: boolean
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_LINKABLE_SYMBOL]?: BaseLinkable
  }
}

/**
 * A composable that provides properties and methods to create a Vue link or
 * external hyperlink. This composable will dynamically determine the type of
 * link to use based on the provided properties.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   props: BASE_LINKABLE_PROPS,
 *   setup(props, context) {
 *     const linkable = useBaseLinkable(props)
 *     return () => h(linkable.is ?? 'button', linkable.attributes, context.slots)
 *   }
 * })
 */
export function useBaseLinkable(props: BaseLinkableProps = {}, instance = getCurrentInstance()): BaseLinkable {
  if (instance?.[BASE_LINKABLE_SYMBOL]) return instance[BASE_LINKABLE_SYMBOL]

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
  const attributes = computed(() => cleanAttributes({

    // --- Internal link properties.
    activeClass: isInternalLink.value && props.classActive,
    exactActiveClass: isInternalLink.value && props.classActiveExact,
    replace: isInternalLink.value && props.replace,
    to: isInternalLink.value && props.to,

    // --- External link properties.
    href: isExternalLink.value && props.to,
    rel: isExternalLink.value && props.newtab && 'noreferrer',
    target: isExternalLink.value && props.newtab && '_blank',
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, is, isExternalLink, isInternalLink, isLink })
  if (instance) instance[BASE_LINKABLE_SYMBOL] = composable
  return composable
}

/* v8 ignore next */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { isReactive } = await import('vue')
  const { mount } = await import('@vue/test-utils')

  describe('composable', () => {
    it('should return a reactive object', () => {
      const result = useBaseLinkable()
      const reactive = isReactive(result)
      expect(reactive).toBe(true)
    })

    it('should provide the composable into the component', () => {
      mount(() => {
        const result = useBaseLinkable()
        const instance = getCurrentInstance()
        const injected = instance?.[BASE_LINKABLE_SYMBOL]
        expect(result).toStrictEqual(injected)
      })
    })

    it('should return the same instance when called multiple times', () => {
      mount(() => {
        const result1 = useBaseLinkable()
        const result2 = useBaseLinkable()
        expect(result1).toBe(result2)
      })
    })

    it('should return different instances for different components', () => {
      const result1 = useBaseLinkable()
      const result2 = useBaseLinkable()
      expect(result1).not.toBe(result2)
    })
  })

  describe('internal link', () => {
    it('should set the `isInternalLink` property to `true`', () => {
      const result = useBaseLinkable({ to: '/path' })
      expect(result.isInternalLink).toBe(true)
    })

    it('should set the `isExternalLink` property to `false`', () => {
      const result = useBaseLinkable({ to: '/path' })
      expect(result.isExternalLink).toBe(false)
    })

    it('should set the `isLink` property to `true`', () => {
      const result = useBaseLinkable({ to: '/path' })
      expect(result.isLink).toBe(true)
    })

    it('should set the `is` property to `RouterLink`', () => {
      const result = useBaseLinkable({ to: '/path' })
      expect(result.is).toBe(RouterLink)
    })

    it('should set the `attributes` property with the internal link properties', () => {
      const result = useBaseLinkable({ to: '/path', classActive: 'active', classActiveExact: 'exact-active' })
      expect(result.attributes).toStrictEqual({
        activeClass: 'active',
        exactActiveClass: 'exact-active',
        to: '/path',
      })
    })

    it('should pass the `replace` property to the internal link', () => {
      const result = useBaseLinkable({ to: '/path', replace: true })
      expect(result.attributes).toStrictEqual({
        replace: true,
        to: '/path',
      })
    })

    it('should ignore the `newtab` property for internal links', () => {
      const result = useBaseLinkable({ to: '/path', newtab: true })
      expect(result.attributes).toStrictEqual({
        to: '/path',
      })
    })
  })

  describe('external link', () => {
    it('should set the `isInternalLink` property to `false`', () => {
      const result = useBaseLinkable({ to: 'https://example.com' })
      expect(result.isInternalLink).toBe(false)
    })

    it('should set the `isExternalLink` property to `true`', () => {
      const result = useBaseLinkable({ to: 'https://example.com' })
      expect(result.isExternalLink).toBe(true)
    })

    it('should set the `isLink` property to `true`', () => {
      const result = useBaseLinkable({ to: 'https://example.com' })
      expect(result.isLink).toBe(true)
    })

    it('should set the `is` property to `a`', () => {
      const result = useBaseLinkable({ to: 'https://example.com' })
      expect(result.is).toBe('a')
    })

    it('should set the `attributes` property with the external link properties', () => {
      const result = useBaseLinkable({ to: 'https://example.com', newtab: true })
      expect(result.attributes).toStrictEqual({
        href: 'https://example.com',
        rel: 'noreferrer',
        target: '_blank',
      })
    })

    it('should pass the `newtab` property to the external link', () => {
      const result = useBaseLinkable({ to: 'https://example.com', newtab: true })
      expect(result.attributes).toStrictEqual({
        href: 'https://example.com',
        rel: 'noreferrer',
        target: '_blank',
      })
    })

    it('should ignore the `replace` property for external links', () => {
      const result = useBaseLinkable({ to: 'https://example.com', replace: true })
      expect(result.attributes).toStrictEqual({
        href: 'https://example.com',
      })
    })
  })
}
