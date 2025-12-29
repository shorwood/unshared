import type { RuleContext } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'
import { rulePattern } from './rulePattern'

describe('rulePattern', () => {
  const [matcher, handler, options] = rulePattern()
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
    it('should match a pattern with a theme color', () => {
      const match = regex.exec('bg-pattern-hexagons-red-500')
      expect(match).not.toBeNull()
    })

    it('should match a pattern with a theme color and opacity', () => {
      const match = regex.exec('bg-pattern-hexagons-red-500/50')
      expect(match).not.toBeNull()
    })

    it('should not match an invalid pattern name', () => {
      const match = regex.exec('bg-pattern-invalidpattern-red-500')
      expect(match).toBeNull()
    })

    it('should not match without a color', () => {
      const match = regex.exec('bg-pattern-hexagons')
      expect(match).toBeNull()
    })
  })

  describe('handler', () => {
    it('should return CSS with background-image for a valid pattern and color', () => {
      const match = regex.exec('bg-pattern-hexagons-red-500')!
      const result = handler(match, context)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('background-image')
    })

    it('should apply opacity to the pattern', () => {
      const match = regex.exec('bg-pattern-hexagons-red-500/50')!
      const result = handler(match, context)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('background-image')
    })

    it('should return undefined for an invalid color', () => {
      const match = regex.exec('bg-pattern-hexagons-nonexistent')
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
