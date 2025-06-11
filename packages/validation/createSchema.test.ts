import { attempt } from '@unshared/functions'
import { assertNumber, assertString, assertUndefined } from './assert/index'
import { createSchema } from './createSchema'

describe('createSchema', () => {
  describe('parse object', () => {
    it('should create a schema and parse an object with a single rule', () => {
      const parse = createSchema({ name: assertString })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'John' })
    })

    it('should create a schema and parse an object with a rule chain', () => {
      const parse = createSchema({ name: [assertString, (x: string) => x.toUpperCase()] })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should create a schema and parse an object with a rule set', () => {
      const parse = createSchema({ name: [[assertUndefined], [assertString, (x: string) => x.toUpperCase()]] })
      const result = parse({ name: 'John' })
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should create a schema and parse an object with a nested schema', () => {
      const parse = createSchema({ name: assertString, nested: { age: assertNumber } })
      const result = parse({ name: 'John', nested: { age: 25 } })
      expect(result).toStrictEqual({ name: 'John', nested: { age: 25 } })
    })
  })

  describe('fail', () => {
    it('should throw a "E_SCHEMA_MISMATCH" error if the value does not match the schema', () => {
      const parse = createSchema({ name: assertString, age: assertNumber })
      const shouldThrow = () => parse({ name: false, age: '25' })
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_SCHEMA_MISMATCH',
        message: 'One or more values did not match the schema.',
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
  })

  describe('parse FormData', () => {
    it('should create a schema and parse FormData with a single rule', () => {
      const parse = createSchema({ name: assertString })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'John' })
    })

    it('should create a schema and parse FormData with a rule chain', () => {
      const parse = createSchema({ name: [assertString, (x: string) => x.toUpperCase()] })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should create a schema and parse FormData with a rule set', () => {
      const parse = createSchema({ name: [[assertUndefined], [assertString, (x: string) => x.toUpperCase()]] })
      const formData = new FormData()
      formData.append('name', 'John')
      const result = parse(formData)
      expect(result).toStrictEqual({ name: 'JOHN' })
    })

    it('should parse File values in FormData', () => {
      const parse = createSchema({ file: (value: File) => value.type })
      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt')
      const result = parse(formData)
      expect(result).toStrictEqual({ file: 'text/plain' })
    })
  })
})
