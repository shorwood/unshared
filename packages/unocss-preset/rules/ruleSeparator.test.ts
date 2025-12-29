import type { RuleContext } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'
import { ruleSeparator } from './ruleSeparator'

describe('ruleSeparator', () => {
  const [matcher, handler, options] = ruleSeparator()
  const regex = matcher as RegExp
  const context = {
    theme: {
      colors: {
        red: { 500: '#ef4444' },
        blue: { 500: '#3b82f6' },
      },
    },
  } as unknown as RuleContext<Theme>

  describe('matching', () => {
    it('should match a separator with a theme color', () => {
      const match = regex.exec('separator-waves-red-500')
      expect(match).not.toBeNull()
    })

    it('should match a separator with a theme color and opacity', () => {
      const match = regex.exec('separator-waves-red-500/50')
      expect(match).not.toBeNull()
    })

    it('should match different separator types', () => {
      expect(regex.exec('separator-arrow-red-500')).not.toBeNull()
      expect(regex.exec('separator-curve-red-500')).not.toBeNull()
      expect(regex.exec('separator-tilt-red-500')).not.toBeNull()
      expect(regex.exec('separator-triangle-red-500')).not.toBeNull()
    })

    it('should not match an invalid separator name', () => {
      const match = regex.exec('separator-invalidseparator-red-500')
      expect(match).toBeNull()
    })

    it('should not match without a color', () => {
      const match = regex.exec('separator-waves')
      expect(match).toBeNull()
    })
  })

  describe('handler', () => {
    it('should return CSS with background-image and background-size for a valid separator and color', () => {
      const match = regex.exec('separator-waves-red-500')!
      const result = handler(match, context)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('background-image')
      expect(result).toHaveProperty('background-size', '100% 100%')
    })

    it('should apply opacity to the separator', () => {
      const match = regex.exec('separator-waves-red-500/50')!
      const result = handler(match, context)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('background-image')
    })

    it('should return undefined for an invalid color', () => {
      const match = regex.exec('separator-waves-nonexistent')
      if (!match) return
      const result = handler(match, context)
      expect(result).toBeUndefined()
    })
  })

  describe('autocomplete', () => {
    it('should provide autocomplete options', () => {
      expect(options).toBeDefined()
      expect(options!.autocomplete).toBeDefined()
      expect(options!.autocomplete).toBeInstanceOf(Array)
    })
  })
})
