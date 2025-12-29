import type { RuleContext } from '@unocss/core'
import { ruleUnsplash } from './ruleUnsplash'

describe('ruleUnsplash', () => {
  const [matcher, handler, options] = ruleUnsplash()
  const regex = matcher as RegExp
  const context = {} as RuleContext

  describe('matching', () => {
    it('should match an Unsplash ID without width', () => {
      const match = regex.exec('bg-unsplash-abc12345678')
      expect(match).not.toBeNull()
      expect(match![1]).toBe('abc12345678')
    })

    it('should match an Unsplash ID with width', () => {
      const match = regex.exec('bg-unsplash-abc12345678-1920')
      expect(match).not.toBeNull()
      expect(match![1]).toBe('abc12345678')
      expect(match![2]).toBe('1920')
    })

    it('should not match an ID with wrong length', () => {
      const match = regex.exec('bg-unsplash-abc123')
      expect(match).toBeNull()
    })

    it('should not match without an ID', () => {
      const match = regex.exec('bg-unsplash-')
      expect(match).toBeNull()
    })
  })

  describe('handler', () => {
    it('should return CSS with background-image URL without width parameter', () => {
      const match = regex.exec('bg-unsplash-abc12345678')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        'background-image': 'url(https://unsplash.com/photos/abc12345678/download)',
      })
    })

    it('should return CSS with background-image URL with width parameter', () => {
      const match = regex.exec('bg-unsplash-abc12345678-1920')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        'background-image': 'url(https://unsplash.com/photos/abc12345678/download?w=1920)',
      })
    })

    it('should handle different width values', () => {
      const widths = ['480', '720', '1280', '1920']
      for (const width of widths) {
        const match = regex.exec(`bg-unsplash-abc12345678-${width}`)!
        const result = handler(match, context)
        expect(result).toStrictEqual({
          'background-image': `url(https://unsplash.com/photos/abc12345678/download?w=${width})`,
        })
      }
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
