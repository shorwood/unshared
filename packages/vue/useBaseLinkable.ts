/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable sonarjs/no-duplicate-string */
import { RouteLocationNamedRaw, RouteLocationRaw, RouterLink, useRouter } from 'vue-router'
import { Component, Prop, computed, getCurrentInstance } from 'vue'
import { toReactive } from '@vueuse/core'
import { cleanAttributes } from './cleanAttributes'

/** The symbol to provide the composable into the component. */
export const BASE_LINKABLE_SYMBOL = Symbol()

/** The properties of the base linkable component. */
export const BASE_LINKABLE_OPTIONS = {
  classActive: { type: String, default: '' },
  classActiveExact: { type: String, default: '' },
  newtab: Boolean,
  replace: Boolean,
  to: [Object, String],
  eager: Boolean,
} satisfies Record<keyof BaseLinkableOptions, Prop<unknown>>

/** The properties of the base linkable component. */
export interface BaseLinkableOptions {

  /**
   * The class to apply when the link is active. This allows you to customize
   * the appearance of the link when it is active without handling the CSS in
   * the component itself.
   *
   * @default undefined
   */
  classActive?: string

  /**
   * The class to apply when the link is active and the URL matches exactly.
   * This allows you to customize the appearance of the link when it is active
   * and the URL matches exactly without handling the CSS in the component
   * itself.
   *
   * @default undefined
   */
  classActiveExact?: string

  /**
   * If `true`, the link should open in a new tab. By default, the link will
   * open in the same tab as trigger a navigation event.
   *
   * @default false
   */
  newtab?: boolean

  /**
   * If `true`, the link should replace the current URL in the history stack.
   * This can be useful when navigating between similar pages or when you want
   * to prevent the user from navigating back to the previous page.
   *
   * @default false
   */
  replace?: boolean

  /**
   * The URL to link to when the component is clicked. This is used to create a
   * link to another page or website when the component is clicked.
   *
   * @default undefined
   */
  to?: RouteLocationRaw

  /**
   * If `true`, the click event will be triggered on mouse down instead of
   * the click event. This is useful for components that need to respond
   * to the click event immediately.
   *
   * If the application is running in a touch environment, the click event
   * will be used instead of the mouse down event.
   *
   * @default false
   */
  eager?: boolean
}

/** The properties of the base linkable composable. */
export interface BaseLinkableComposable {

  /** The component to render the link as. */
  is: Component | string | undefined

  /** The attributes to apply to the link. */
  attributes: Record<string, unknown>

  /** Whether the link is an internal link. */
  isLink: boolean

  /** Whether the link is an external link. */
  isExternalLink: boolean

  /** Whether the link is an internal link. */
  isInternalLink: boolean

  /** Whether the link is active. */
  isActive: boolean
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_LINKABLE_SYMBOL]?: BaseLinkableComposable
  }
}

/**
 * A composable that provides properties and methods to create a Vue link or
 * external hyperlink. This composable will dynamically determine the type of
 * link to use based on the provided properties.
 *
 * @param options The properties of the component passed by the `setup` function.
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
export function useBaseLinkable(options: BaseLinkableOptions = {}, instance = getCurrentInstance()): BaseLinkableComposable {
  if (instance?.[BASE_LINKABLE_SYMBOL]) return instance[BASE_LINKABLE_SYMBOL]
  const router = useRouter()

  // --- Determine the type of link based on the provided properties.
  const isLink = computed(() => options.to !== undefined)
  const isExternalLink = computed(() => isLink.value && typeof options.to === 'string' && !options.to?.startsWith('/'))
  const isInternalLink = computed(() => isLink.value && !isExternalLink.value)

  // --- Determine if the link is active.
  const isActive = computed(() => {
    if (!isInternalLink.value) return false
    if (typeof options.to === 'string') return router.currentRoute.value.path === options.to
    if (typeof options.to === 'object') return router.currentRoute.value.matched.some(route => route.name === (options.to as RouteLocationNamedRaw).name)
    return false
  })

  // --- Compute component type.
  const is = computed(() => {
    if (isInternalLink.value) return RouterLink
    if (isExternalLink.value) return 'a'
  })

  // --- Trigger the navigation event when the link is clicked.
  const onClick = computed(() => {
    if (!isInternalLink.value || !options.to) return
    return () => (options.replace
      ? router.replace(options.to!)
      : router.push(options.to!)
    )
  })

  // --- Compute the name of the click event based on the eager click option.
  // --- If eager click is enabled, the click event will be triggered on mouse down.
  // --- Unless the application is running in a touch environment, then it will
  // --- default to the click event.
  const clickEvent = computed(() => {
    if (typeof window === 'undefined') return 'onClick'
    if ('ontouchstart' in window) return 'onClick'
    if (options.eager) return 'onMousedown'
    return 'onClick'
  })

  // --- Compute internal link props.
  const attributes = computed(() => cleanAttributes({

    // --- Internal link properties.
    [clickEvent.value]: onClick.value,
    activeClass: isInternalLink.value && options.classActive || undefined,
    exactActiveClass: isInternalLink.value && options.classActiveExact || undefined,
    replace: isInternalLink.value && options.replace || undefined,
    to: isInternalLink.value && options.to || undefined,

    // --- External link properties.
    href: isExternalLink.value && options.to || undefined,
    rel: isExternalLink.value && options.newtab && 'noreferrer' || undefined,
    target: isExternalLink.value && options.newtab && '_blank' || undefined,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, is, isExternalLink, isInternalLink, isLink, isActive })
  if (instance) instance[BASE_LINKABLE_SYMBOL] = composable
  return composable
}

/* v8 ignore next */
// @vitest-environment happy-dom
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
        onClick: expect.any(Function),
        activeClass: 'active',
        exactActiveClass: 'exact-active',
        to: '/path',
      })
    })

    it('should pass the `replace` property to the internal link', () => {
      const result = useBaseLinkable({ to: '/path', replace: true })
      expect(result.attributes).toStrictEqual({
        onClick: expect.any(Function),
        replace: true,
        to: '/path',
      })
    })

    it('should ignore the `newtab` property for internal links', () => {
      const result = useBaseLinkable({ to: '/path', newtab: true })
      expect(result.attributes).toStrictEqual({
        onClick: expect.any(Function),
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
