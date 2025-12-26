import type { RuleContext } from '@unocss/core'
import { ruleInnerContent } from './ruleInnerContent'

describe('ruleInnerContent', () => {
  const [matcher, handler] = ruleInnerContent()
  const context = {} as RuleContext

  describe('basic content', () => {
    it('should create empty content when no value is provided', () => {
      const match = matcher.exec('inner-content')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '""',
      })
    })

    it('should create content with simple text', () => {
      const match = (matcher).exec('inner-content-hello')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"hello"',
      })
    })

    it('should create content with multiple words separated by dashes', () => {
      const match = (matcher).exec('inner-content-hello-world')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"hello-world"',
      })
    })
  })

  describe('special characters', () => {
    it('should create content with numbers', () => {
      const match = (matcher).exec('inner-content-123')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"123"',
      })
    })

    it('should create content with alphanumeric text', () => {
      const match = (matcher).exec('inner-content-abc123')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"abc123"',
      })
    })

    it('should create content with underscores', () => {
      const match = (matcher).exec('inner-content-hello_world')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"hello_world"',
      })
    })
  })

  describe('edge cases', () => {
    it('should create content with single character', () => {
      const match = (matcher).exec('inner-content-x')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"x"',
      })
    })

    it('should create content with single number', () => {
      const match = (matcher).exec('inner-content-1')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"1"',
      })
    })

    it('should create content with mixed case', () => {
      const match = (matcher).exec('inner-content-HelloWorld')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        content: '"HelloWorld"',
      })
    })
  })

  describe('invalid', () => {
    it('should not match when missing the inner-content prefix', () => {
      const match = (matcher).exec('content-hello')
      expect(match).toBeNull()
    })

    it('should not match when using different prefix', () => {
      const match = (matcher).exec('outer-content-hello')
      expect(match).toBeNull()
    })
  })
})
