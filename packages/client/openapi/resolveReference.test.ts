import type { OpenAPIReferenceDecoded, OpenAPIReferencePath, OpenAPIReferenceResolved } from './resolveReference'
import { resolveReference } from './resolveReference'

describe('resolveReference', () => {
  describe('resolve', () => {
    it('should resolve a reference', () => {
      const result = resolveReference({ $ref: '#/tags' }, { tags: [{ name: 'foo' }] })
      expect(result).toEqual([{ name: 'foo' }])
    })

    it('should resolve a nested reference', () => {
      const result = resolveReference(
        { $ref: '#/components/schemas/user' },
        { components: { schemas: { user: { type: 'object' } } } } as const,
      )
      expect(result).toEqual({ type: 'object' })
    })

    it('should resolve a deeply nested reference', () => {
      const result = resolveReference(
        { $ref: '#/components/schemas/user/properties/name' },
        { components: { schemas: { user: { properties: { name: { type: 'string' } } } } } } as const,
      )
      expect(result).toEqual({ type: 'string' })
    })

    it('should handle references with special characters', () => {
      const result = resolveReference(
        { $ref: '#/components/schemas/foo~1bar~0baz' },
        { components: { schemas: { 'foo/bar~baz': { type: 'string' } } } } as const,
      )
      expect(result).toEqual({ type: 'string' })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the reference is not a reference object', () => {
    // @ts-expect-error: ignore type error
      const shouldThrow = () => resolveReference({}, { tags: [{ name: 'foo' }] })
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Expected value to be an OpenAPI reference object.')
    })

    it('should throw an error if the document is not an object', () => {
    // @ts-expect-error: ignore type error
      const shouldThrow = () => resolveReference({ $ref: '#/tags' }, null)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Expected OpenAPI specification to be an object.')
    })

    it('should throw an error if the reference cannot be resolved', () => {
      const shouldThrow = () => resolveReference({ $ref: '#/invalid' }, { tags: [{ name: 'foo' }] })
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Could not resolve OpenAPI component: #/invalid')
    })
  })

  describe('OpenAPIReferencePath', () => {
    it('should split a reference into parts', () => {
      type Result = OpenAPIReferencePath<'#/components/schemas/user/properties/name'>
      expectTypeOf<Result>().toEqualTypeOf<['components', 'schemas', 'user', 'properties', 'name']>()
    })

    it('should split a reference into parts with special characters', () => {
      type Result = OpenAPIReferencePath<'#/components/schemas/foo~1bar~0baz'>
      expectTypeOf<Result>().toEqualTypeOf<['components', 'schemas', 'foo~1bar~0baz']>()
    })
  })

  describe('OpenAPIReferenceDecoded', () => {
    it('should decode special "~0" into "~"', () => {
      type Result = OpenAPIReferenceDecoded<'foo~0bar'>
      expectTypeOf<Result>().toEqualTypeOf<'foo~bar'>()
    })

    it('should decode special "~1" into "/"', () => {
      type Result = OpenAPIReferenceDecoded<'foo~1bar'>
      expectTypeOf<Result>().toEqualTypeOf<'foo/bar'>()
    })
  })

  describe('OpenAPIReferenceResolved', () => {
    it('should resolve a reference to a component', () => {
      type Result = OpenAPIReferenceResolved<{ $ref: '#/components/schemas/user' }, { components: { schemas: { user: { type: 'object' } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ type: 'object' }>()
    })

    it('should resolve a nested reference to a component', () => {
      type Result = OpenAPIReferenceResolved<{ $ref: '#/components/schemas/user/properties/name' }, { components: { schemas: { user: { properties: { name: { type: 'string' } } } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ type: 'string' }>()
    })

    it('should return never if the reference is invalid', () => {
      type Result = OpenAPIReferenceResolved<{ $ref: '#/components/schemas/invalid' }, { components: { schemas: { user: { type: 'object' } } } }>
      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it('should make nested readonly properties writeable', () => {
      type Result = OpenAPIReferenceResolved<{ $ref: '#/components/schemas/user' }, { components: { schemas: { user: { readonly name: string } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ name: string }>()
    })

    it('should return never if the reference target is not an object', () => {
      type Result = OpenAPIReferenceResolved<{ $ref: '#/components/schemas/user' }, { components: { schemas: { user: string } } }>
      expectTypeOf<Result>().toEqualTypeOf<never>()
    })
  })
})
