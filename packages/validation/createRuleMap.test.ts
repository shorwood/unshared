import { attempt } from '@unshared/functions'
import { assertNumber, assertString, assertUndefined } from './assert/index'
import { ALL_INDICES, ALL_PROPERTIES, createRuleMap } from './createRuleMap'

describe('createRuleMap', () => {
  describe('properties', () => {
    it('should create a schema and parse an object with a single rule', () => {
      const parse = createRuleMap({ name: assertString })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'John' })
      expectTypeOf(result).toMatchObjectType<{ name: string }>()
    })

    it('should create a schema and parse an object with a rule chain', () => {
      const parse = createRuleMap({ name: [assertString, (x: string) => x.toUpperCase()] })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'JOHN' })
      expectTypeOf(result).toMatchObjectType<{ name: string }>()
    })

    it('should create a schema and parse an object with a rule set', () => {
      const parse = createRuleMap({ name: [[assertUndefined], [assertString, (x: string) => x.toUpperCase()]] })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'JOHN' })
      expectTypeOf(result).toMatchObjectType<{ name: string | undefined }>()
    })

    it('should create a schema and parse an object with a nested schema', () => {
      const parse = createRuleMap({ name: assertString, nested: { age: assertNumber } })
      const result = parse({ name: 'John', nested: { age: 25 } })
      expect(result).toStrictEqual({ name: 'John', nested: { age: 25 } })
      expectTypeOf(result).toMatchObjectType<{ name: string; nested: { age: number } }>()
    })

    it('should create a schema and parse all indices of an array with ALL_PROPERTIES', () => {
      const parse = createRuleMap({ [ALL_PROPERTIES]: assertString, test: [[assertString], [assertUndefined]] })
      const result = parse({ john: 'John', doe: 'Doe' })
      expect(result).toStrictEqual({ john: 'John', doe: 'Doe', test: undefined })
      expect(result).toBeInstanceOf(Object)
      expectTypeOf(result).toMatchObjectType<Record<string, string>>()
    })

    it('should throw a "E_RULE_MAP_ASSERTION_FAILED" error if more than one property fails validation', () => {
      const parse = createRuleMap({ name: assertString, age: assertNumber })
      const shouldThrow = () => parse({ name: false, age: '25' })
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_RULE_MAP_ASSERTION_FAILED',
        message: 'Assertion failed for 2 properties: [name, age]. Check the context for detailed error information.',
        context: {
          name: {
            name: 'E_NOT_STRING',
            message: 'Value is not a string.',
            context: { value: false, received: 'boolean' },
          },
          age: {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: '25', received: 'string' },
          },
        },
      })
    })

    it('should throw a "E_RULE_MAP_ASSERTION_FAILED" error if a single property fails validation', () => {
      const parse = createRuleMap({ name: assertString })
      const shouldThrow = () => parse({ name: false })
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_RULE_MAP_ASSERTION_FAILED',
        message: 'Assertion failed for 1 property: [name]. Check the context for detailed error information.',
        context: {
          name: {
            name: 'E_NOT_STRING',
            message: 'Value is not a string.',
            context: { value: false, received: 'boolean' },
          },
        },
      })
    })
  })

  describe('indices', () => {
    it('should create a schema and parse all indices of an array with ALL_INDICES', () => {
      const parse = createRuleMap({ [ALL_INDICES]: assertString, test: assertUndefined })
      const result = parse(['John', 'Doe'])
      expect(result).toStrictEqual({ 0: 'John', 1: 'Doe', test: undefined })
      expect(result).toBeInstanceOf(Object)
      expectTypeOf(result).toMatchObjectType<{ [x: number]: string; test: undefined }>()
    })

    it('should create a schema and parse specific indices of an array', () => {
      const parse = createRuleMap({ 0: assertString, 1: assertString })
      const result = parse(['John', 'Doe'])
      expect(result).toStrictEqual({ 0: 'John', 1: 'Doe' })
      expect(result).toBeInstanceOf(Object)
      expectTypeOf(result).toMatchObjectType<{ '0': string; '1': string }>()
    })

    it('should throw a "E_RULE_MAP_ASSERTION_FAILED" error if a specific index fails validation', () => {
      const parse = createRuleMap({ 0: assertString, 1: assertNumber })
      const shouldThrow = () => parse(['John', 'Doe'])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_RULE_MAP_ASSERTION_FAILED',
        message: 'Assertion failed for 1 property: [1]. Check the context for detailed error information.',
        context: {
          1: {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: 'Doe', received: 'string' },
          },
        },
      })
    })

    it('should throw a "E_RULE_MAP_ASSERTION_FAILED" error if multiple indices fail validation', () => {
      const parse = createRuleMap({ 0: assertNumber, 1: assertNumber })
      const shouldThrow = () => parse(['John', 'Doe', 42])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_RULE_MAP_ASSERTION_FAILED',
        message: 'Assertion failed for 2 properties: [0, 1]. Check the context for detailed error information.',
        context: {
          0: {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: 'John', received: 'string' },
          },
          1: {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: 'Doe', received: 'string' },
          },
        },
      })
    })
  })

  describe('FormData', () => {
    it('should create a schema and parse FormData with a single rule', () => {
      const parse = createRuleMap({ name: assertString })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'John' })
    })

    it('should create a schema and parse FormData with a rule chain', () => {
      const parse = createRuleMap({ name: [assertString, (x: string) => x.toUpperCase()] })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should create a schema and parse FormData with a rule set', () => {
      const parse = createRuleMap({ name: [[assertUndefined], [assertString, (x: string) => x.toUpperCase()]] })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should parse File values in FormData', () => {
      const parse = createRuleMap({ file: (value: File) => value.type })
      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt')
      const result = parse(formData)
      expect(result).toStrictEqual({ file: 'text/plain' })
    })
  })

  describe('edge cases', () => {
    it('should throw "E_IS_NULL" if the input is null', () => {
      const parse = createRuleMap({ name: assertString })
      const shouldThrow = () => parse(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_NULL',
        message: 'Value is null.',
        context: { value: null },
      })
    })

    it('should throw "E_IS_UNDEFINED" if the input is undefined', () => {
      const parse = createRuleMap({ name: assertString })
      const shouldThrow = () => parse(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_IS_UNDEFINED',
        message: 'Value is undefined.',
        context: { value: undefined },
      })
    })
  })
})
