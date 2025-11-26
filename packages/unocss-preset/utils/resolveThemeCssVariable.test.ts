import type { ThemeOptions } from '../preset'
import { Color, createTheme } from '@unshared/color'
import { resolveThemeCssVariable } from './resolveThemeCssVariable'

describe('resolveThemeCssVariable', () => {
  const options: ThemeOptions = {
    presets: {
      ocean: createTheme({ colors: { primary: Color.fromHex('#1CA7EC') } }),
      desert: createTheme({ colors: { primary: Color.fromHex('#c2b280') } }),
    },
  }

  describe('full specifier resolution', () => {
    it('should resolve full specifier with all four segments', () => {
      const result = resolveThemeCssVariable('primary-default-default-background', options)
      expect(result).toBe('var(--theme-primary-default-default-background)')
    })

    it('should resolve full specifier with non-default role', () => {
      const result = resolveThemeCssVariable('primary-surface-default-background', options)
      expect(result).toBe('var(--theme-primary-surface-default-background)')
    })

    it('should resolve full specifier with non-default state', () => {
      const result = resolveThemeCssVariable('primary-default-hover-background', options)
      expect(result).toBe('var(--theme-primary-default-hover-background)')
    })

    it('should resolve full specifier with all non-default segments', () => {
      const result = resolveThemeCssVariable('primary-surface-hover-border', options)
      expect(result).toBe('var(--theme-primary-surface-hover-border)')
    })
  })

  describe('partial specifier with defaults', () => {
    it('should default to primary-default-default-background when only color is provided', () => {
      const result = resolveThemeCssVariable('primary', options)
      expect(result).toBe('var(--theme-primary-default-default-background)')
    })

    it('should default state and target when color-role is provided', () => {
      const result = resolveThemeCssVariable('primary-surface', options)
      expect(result).toBe('var(--theme-primary-surface-default-background)')
    })

    it('should default target when color-role-state is provided', () => {
      const result = resolveThemeCssVariable('primary-surface-hover', options)
      expect(result).toBe('var(--theme-primary-surface-hover-background)')
    })

    it('should resolve when state matches but role defaults', () => {
      const result = resolveThemeCssVariable('primary-hover', options)
      expect(result).toBe('var(--theme-primary-default-hover-background)')
    })

    it('should resolve when target matches but role and state default', () => {
      const result = resolveThemeCssVariable('primary-border', options)
      expect(result).toBe('var(--theme-primary-default-default-border)')
    })

    it('should resolve when target matches and role is explicit', () => {
      const result = resolveThemeCssVariable('primary-surface-border', options)
      expect(result).toBe('var(--theme-primary-surface-default-border)')
    })
  })

  describe('defaultColor fallback', () => {
    it('should default to primary color when color is not in specifier', () => {
      const result = resolveThemeCssVariable('background', options)
      expect(result).toBe('var(--theme-primary-default-default-background)')
    })

    it('should default to primary color when specifier is empty', () => {
      const result = resolveThemeCssVariable('', options)
      expect(result).toBe('var(--theme-primary-default-default-background)')
    })
  })

  describe('defaultTarget option', () => {
    it('should use defaultTarget when target is not in specifier', () => {
      const result = resolveThemeCssVariable('primary', { ...options, defaultTarget: 'border' })
      expect(result).toBe('var(--theme-primary-default-default-border)')
    })

    it('should use defaultTarget with explicit role', () => {
      const result = resolveThemeCssVariable('primary-surface', { ...options, defaultTarget: 'foreground' })
      expect(result).toBe('var(--theme-primary-surface-default-foreground)')
    })

    it('should use defaultTarget with explicit role and state', () => {
      const result = resolveThemeCssVariable('primary-surface-hover', { ...options, defaultTarget: 'muted' })
      expect(result).toBe('var(--theme-primary-surface-hover-muted)')
    })

    it('should not override explicit target with defaultTarget', () => {
      const result = resolveThemeCssVariable('primary-default-default-background', { ...options, defaultTarget: 'border' })
      expect(result).toBe('var(--theme-primary-default-default-background)')
    })
  })

  describe('edge cases and errors', () => {
    it('should return undefined when presets is undefined', () => {
      const result = resolveThemeCssVariable('primary', {})
      expect(result).toBeUndefined()
    })

    it('should return undefined when specifier is undefined', () => {
      const result = resolveThemeCssVariable(undefined, options)
      expect(result).toBeUndefined()
    })

    it('should return undefined for unknown color', () => {
      const result = resolveThemeCssVariable('unknown', options)
      expect(result).toBeUndefined()
    })

    it('should return undefined for invalid role', () => {
      const result = resolveThemeCssVariable('primary-invalid', options)
      expect(result).toBeUndefined()
    })

    it('should return undefined for invalid state', () => {
      const result = resolveThemeCssVariable('primary-default-invalid', options)
      expect(result).toBeUndefined()
    })

    it('should return undefined for invalid target', () => {
      const result = resolveThemeCssVariable('primary-default-default-invalid', options)
      expect(result).toBeUndefined()
    })

    it('should return undefined when specifier has too many segments', () => {
      const result = resolveThemeCssVariable('primary-default-default-background-extra', options)
      expect(result).toBeUndefined()
    })
  })
})
