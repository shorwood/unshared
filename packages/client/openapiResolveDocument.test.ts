import type { OpenAPIResolved } from './openapiResolveDocument'
import { openapiResolveDocument } from './openapiResolveDocument'

describe('openapiResolveDocument', () => {
  describe('resolve', () => {
    it('should resolve a reference in the document', () => {
      const document = {
        components: {
          schemas: {
            User: { type: 'object' },
          },
        },
        paths: {
          '/users': {
            get: { $ref: '#/components/schemas/User' },
          },
        },
      } as const
      const resolved = openapiResolveDocument(document)
      expect(resolved.paths['/users'].get).toEqual({ type: 'object' })
    })

    it('should resolve nested references in the document', () => {
      const document = {
        components: {
          schemas: {
            User: {
              properties: {
                name: { type: 'string' },
              },
            },
          },
        },
        paths: {
          '/users': {
            get: { $ref: '#/components/schemas/User/properties/name' },
          },
        },
      } as const

      const resolved = openapiResolveDocument(document)
      expect(resolved.paths['/users'].get).toEqual({ type: 'string' })
    })

    it('should handle references with special characters', () => {
      const document = {
        components: {
          schemas: {
            'foo/bar~baz': { type: 'string' },
          },
        },
        paths: {
          '/special': {
            get: { $ref: '#/components/schemas/foo~1bar~0baz' },
          },
        },
      } as const

      const resolved = openapiResolveDocument(document)
      expect(resolved.paths['/special'].get).toEqual({ type: 'string' })
    })

    it('should recursively resolve references in objects', () => {
      const document = {
        components: {
          schemas: {
            FirstAndLastName: {
              properties: {
                first: { type: 'string' },
                last: { type: 'string' },
              },
            },
            User: {
              properties: {
                name: {
                  type: { $ref: '#/components/schemas/FirstAndLastName' },
                },
              },
            },
          },
        },
        paths: {
          '/users': {
            get: { $ref: '#/components/schemas/User' },
          },
        },
      } as const
      const resolved = openapiResolveDocument(document)
      expect(resolved.paths['/users'].get.properties.name.type.properties).toEqual({
        first: { type: 'string' },
        last: { type: 'string' },
      })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the reference cannot be resolved', () => {
      const resolved = openapiResolveDocument({
        components: {
          schemas: {
            User: { $ref: '#/invalid' },
          },
        },
      })
      const shouldThrow = () => resolved.components.schemas.User
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Could not resolve OpenAPI component: #/invalid')
    })
  })

  describe('OpenAPIResolved', () => {
    it('should resolve a reference to a component', () => {
      type Result = OpenAPIResolved<{ $ref: '#/components/schemas/User' }, { components: { schemas: { User: { type: 'object' } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ type: 'object' }>()
    })

    it('should resolve a nested reference to a component', () => {
      type Result = OpenAPIResolved<{ $ref: '#/components/schemas/User/properties/name' }, { components: { schemas: { User: { properties: { name: { type: 'string' } } } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ type: 'string' }>()
    })

    it('should return never if the reference is invalid', () => {
      type Result = OpenAPIResolved<{ $ref: '#/components/schemas/Invalid' }, { components: { schemas: { User: { type: 'object' } } } }>
      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    it('should make nested readonly properties writeable', () => {
      type Result = OpenAPIResolved<{ $ref: '#/components/schemas/User' }, { components: { schemas: { User: { readonly name: string } } } }>
      expectTypeOf<Result>().toEqualTypeOf<{ name: string }>()
    })

    it('should return never if the reference target is not an object', () => {
      type Result = OpenAPIResolved<{ $ref: '#/components/schemas/User' }, { components: { schemas: { User: string } } }>
      expectTypeOf<Result>().toEqualTypeOf<never>()
    })
  })
})
