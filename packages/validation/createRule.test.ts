import type { RuleResult } from './createRule'
import { attempt } from '@unshared/functions'
import { assertString } from './assert/index'
import { createAssertionError } from './createAssertionError'
import { createRule } from './createRule'

describe('createRule', () => {
  const assertNumberInRange = (value: unknown, min: number, max: number): asserts value is number => {
    if (typeof value !== 'number' || value < min || value > max) {
      throw createAssertionError({
        name: 'E_NUMBER_OUT_OF_RANGE',
        message: `Number is not between ${min} and ${max}.`,
        context: { value, min, max },
      })
    }
  }

  describe('from function', () => {
    it('should return the value if it is a string', () => {
      const rule = createRule(assertString)
      const result = rule('test')
      expect(result).toBe('test')
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string>()
    })

    it('should throw a "E_NOT_STRING" error if the value is not a string', () => {
      const rule = createRule(assertString)
      const shouldThrow = () => rule(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })

    it('should transform the value to uppercase', () => {
      const fn = (value: string) => value.toUpperCase()
      const rule = createRule(fn)
      const result = rule('test')
      expect(result).toBe('TEST')
      expectTypeOf(rule).toEqualTypeOf<(value: string) => string>()
    })

    it('should create a rule from an async function and return it as-is', async() => {
      const fn = (value: string) => Promise.resolve(value.toUpperCase())
      const rule = createRule(fn)
      const result = rule('test')
      await expect(result).resolves.toBe('TEST')
      expectTypeOf(rule).toEqualTypeOf<(value: string) => Promise<string>>()
    })

    it('should create a rule from a Number constructor and return a number', () => {
      const rule = createRule(Number)
      const result = rule('1')
      expect(result).toBe(1)
      expectTypeOf(rule).toEqualTypeOf<(value?: any) => number>()
    })

    it('should create a rule from a Boolean constructor and return a boolean', () => {
      const rule = createRule(Boolean)
      const result = rule(0)
      expect(result).toBe(false)
      expectTypeOf(rule).toEqualTypeOf<(value?: unknown) => boolean>()
    })

    it('should preserve the function context', () => {
      const context = { value: 'test' }
      const fn = function(this: typeof context) { return this.value }
      const rule = createRule(fn)
      const result = rule.call(context)
      expect(result).toBe('test')
    })
  })

  describe('from parameterized function', () => {
    it('should create a rule with parameters pre-bound to the function', () => {
      const rule = createRule([assertNumberInRange, 2, 3])
      const result = rule(2)
      expect(result).toBe(2)
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should return undefined if the value is in range', () => {
      const rule = createRule([assertNumberInRange, 1, 3])
      const result = rule(2)
      expect(result).toBe(2)
    })

    it('should throw a AssertionError if ype the value is out of range', () => {
      const rule = createRule([assertNumberInRange, 1, 3])
      const shouldThrow = () => rule(0)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NUMBER_OUT_OF_RANGE',
        message: 'Number is not between 1 and 3.',
        context: { value: 0, min: 1, max: 3 },
      })
    })
  })

  describe('from RegExp to assertion', () => {
    it('should return the value if it matches the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const result = rule('a')
      expect(result).toBe('a')
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string>()
    })

    it('should throw a "E_STRING_NOT_MATCHING" error if the value does not match the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule('1')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MATCHING',
        message: 'String does not match the regular expression: /[a-z]/.',
        context: { value: '1', pattern: /[a-z]/ },
      })
    })

    it('should throw a "E_NOT_STRING" error if the value is not a string', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })
  })

  describe('from RegExp to remplacement', () => {
    it('should replace the value with the replacement string if it matches the regular expression', () => {
      const rule = createRule([/World/, 'Earth'])
      const result = rule('Hello World')
      expect(result).toBe('Hello Earth')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should not replace the value if it does not match the regular expression', () => {
      const rule = createRule([/World/, 'Earth'])
      const result = rule('Hello')
      expect(result).toBe('Hello')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should throw a "E_NOT_STRING" error if the value is not a string', () => {
      const rule = createRule([/World/, 'Earth'])
      const shouldThrow = () => rule(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer the return type of a rule from a transform function', () => {
      type Result = RuleResult<(value: string) => number>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from an assertion function', () => {
      type Result = RuleResult<(value: unknown) => asserts value is number>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from a function that returns void | undefined', () => {
      type Result = RuleResult<(value: string) => undefined | void>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })

    it('should infer the return type of a rule from a parameterized function', () => {
      type Result = RuleResult<[(value: number, min: number, max: number) => asserts value is number, number, number]>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from a regular expression', () => {
      type Result = RuleResult<RegExp>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })

    it('should infer the return type of a rule from a replacement regular expression', () => {
      type Result = RuleResult<[RegExp, string]>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('edge cases', () => {
    it('should throw a TypeError if the rule is not a function, RegExp or array', () => {
      // @ts-expect-error: This is an edge case
      const shouldThrow = () => createRule(1)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Rule must be a function, RegExp or array')
    })

    it('should throw a TypeError if the rule is an array with less than two elements', () => {
      // @ts-expect-error: This is an edge case
      const shouldThrow = () => createRule([/World/])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Paremeterized rule must have at least two elements')
    })

    it('should throw a TypeError if the second parameter is a function', () => {
      // @ts-expect-error: This is an edge case

      const shouldThrow = () => createRule([() => {}, () => {}])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Paremeterized rule must not have a function as second element')
    })

    it('should throw a TypeError if the replacement is not a string', () => {
      // @ts-expect-error: This is a test case
      const shouldThrow = () => createRule([/World/, 1])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Remplacement rule must have a string as second element')
    })

    it('should throw a TypeError if the rule is an array with a function as the first element', () => {
      // @ts-expect-error: This is a test case
      const shouldThrow = () => createRule(['foo', 'bar'])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Invalid rule, must be a function, RegExp or array')
    })
  })
})
