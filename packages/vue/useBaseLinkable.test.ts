/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mount } from '@vue/test-utils'
import { getCurrentInstance, isReactive } from 'vue'
import { RouterLink } from 'vue-router'
import { BASE_LINKABLE_SYMBOL, useBaseLinkable } from './useBaseLinkable'

// @vitest-environment happy-dom
describe('useBaseLinkable', () => {
  describe('composable', () => {
    it('should return a reactive object', () => {
      mount(() => {
        const result = useBaseLinkable()
        const reactive = isReactive(result)
        expect(reactive).toBe(true)
      })
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
})
