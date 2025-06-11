import { attempt } from '@unshared/functions'
import { assertNumber, assertString, assertStringNumber, assertUndefined } from './assert/index'
import { createParser } from './createParser'

describe('createParser', () => {
  test('should create a parser function from a single rule', () => {
    const rule = createParser(assertStringNumber)
    const result = rule('5')
    expect(result).toBe('5')
    expectTypeOf(result).toEqualTypeOf<`${number}`>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => `${number}`>()
  })

  test('should create a parser function from a rule chain', () => {
    const rule = createParser(assertStringNumber, Number)
    const result = rule('5')
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
  })

  test('should create a parser function from a rule set', () => {
    const rule = createParser([assertStringNumber, Number], [assertNumber], [assertUndefined])
    const result = rule(5)
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
  })

  test('should create a parser function from a schema', () => {
    const rule = createParser({ name: assertString, age: [assertStringNumber, Number] })
    const result = rule({ name: 'John', age: '25' })
    expect(result).toStrictEqual({ name: 'John', age: 25 })
    expectTypeOf(result).toEqualTypeOf<{ name: string; age: number }>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => { name: string; age: number }>()
  })

  test('should throw a validation error if no rule passes', () => {
    const rule = createParser([assertStringNumber, Number], [assertNumber])
    const shouldThrow = () => rule('a')
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_RULE_SET_ASSERTION_FAILED',
      message: 'No rule set passed.',
      context: {
        causes: [
          {
            name: 'E_NOT_STRING_NUMBER',
            message: 'String is not parseable as a number.',
            context: { value: 'a' },
          },
          {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: 'a', received: 'string' },
          },
        ],
      },
    })
  })
})
