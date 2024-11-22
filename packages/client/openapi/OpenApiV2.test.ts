/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { OpenAPIV2 } from './OpenApiV2'

describe('OpenApiV2', () => {
  describe('ServerUrl', () => {
    it('should infer server url types when all properties are present', () => {
      type Result = OpenAPIV2.ServerUrl<{ host: 'api.example.com'; basePath: '/v1'; schemes: ['https'] }>
      expectTypeOf<Result>().toEqualTypeOf<'https://api.example.com/v1'>()
    })

    it('should infer an union of server url types when multiple schemes are present', () => {
      type Result = OpenAPIV2.ServerUrl<{ host: 'api.example.com'; basePath: '/v1'; schemes: ['http', 'https'] }>
      expectTypeOf<Result>().toEqualTypeOf<'http://api.example.com/v1' | 'https://api.example.com/v1'>()
    })

    it('should infer server url types when only host is present', () => {
      type Result = OpenAPIV2.ServerUrl<{ host: 'api.example.com' }>
      expectTypeOf<Result>().toEqualTypeOf<`${string}://api.example.com${string}`>()
    })

    it('should fallback to string when host is missing', () => {
      type Result = OpenAPIV2.ServerUrl<{ basePath: '/v1'; schemes: ['https'] }>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('InferSchema', () => {
    describe('primitive', () => {
      it('should infer string schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'string'; enum: ['a', 'b'] }>
        expectTypeOf<Result>().toEqualTypeOf<'a' | 'b'>()
      })

      it('should infer string schema types without enum', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'string' }>
        expectTypeOf<Result>().toEqualTypeOf<string>()
      })

      it('should infer boolean schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'boolean' }>
        expectTypeOf<Result>().toEqualTypeOf<boolean>()
      })

      it('should infer number schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'number' }>
        expectTypeOf<Result>().toEqualTypeOf<number>()
      })
    })

    describe('object', () => {
      it('should infer object schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'object'; properties: { name: { type: 'string' } } }>
        expectTypeOf<Result>().toEqualTypeOf<{ name?: string }>()
      })

      it('should infer nested object schema types', () => {
        type Result = OpenAPIV2.InferSchema<{
          type: 'object'
          properties: {
            name: {
              type: 'object'
              properties: {
                first: { type: 'string' }
                last: { type: 'string' }
              }
            }
          }
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ name?: { first?: string; last?: string } }>()
      })

      it('should infer object schema types with required properties', () => {
        type Result = OpenAPIV2.InferSchema<{
          type: 'object'
          properties: {
            name: { type: 'string' }
            age: { type: 'number' }
          }
          required: ['name']
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ age?: number; name: string }>()
      })
    })

    describe('array', () => {
      it('should infer array schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'array'; items: { type: 'string' } }>
        expectTypeOf<Result>().toEqualTypeOf<string[]>()
      })

      it('should infer array schema types with additional items', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'array'; items: { type: 'string' }; additionalItems: { type: 'number' } }>
        expectTypeOf<Result>().toEqualTypeOf<Array<number | string>>()
      })

      it('should infer array schema types with additional items as false', () => {
        type Result = OpenAPIV2.InferSchema<{ type: 'array'; items: { type: 'string' }; additionalItems: false }>
        expectTypeOf<Result>().toEqualTypeOf<string[]>()
      })
    })

    describe('anyOf', () => {
      it('should infer anyOf schema types', () => {
        type Result = OpenAPIV2.InferSchema<{ anyOf: [{ type: 'number' }, { type: 'string' }] }>
        expectTypeOf<Result>().toEqualTypeOf<number | string>()
      })
    })

    describe('allOf', () => {
      it('should infer allOf schema types', () => {
        type Result = OpenAPIV2.InferSchema<{
          allOf: [
            { type: 'object'; properties: { name: { type: 'string' } } },
            { type: 'object'; properties: { age: { type: 'number' } } },
          ]
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ name?: string; age?: number }>()
      })
    })

    describe('oneOf', () => {
      it('should infer oneOf schema types', () => {
        type Result = OpenAPIV2.InferSchema<{
          oneOf: [
            { type: 'object'; properties: { name: { type: 'string' } } },
            { type: 'object'; properties: { age: { type: 'number' } } },
          ]
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ age?: number } | { name?: string }>()
      })
    })
  })

  describe('Request', () => {
    describe('Parameters', () => {
      describe('optional parameters', () => {
        it('should infer request query parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'query'; name: 'name'; type: 'number' }] }, 'query'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: number | undefined }>()
        })

        it('should infer request path parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'path'; name: 'name'; type: 'string' }] }, 'path'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string | undefined }>()
        })

        it('should infer request header parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'header'; name: 'name'; type: 'string' }] }, 'header'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string | undefined }>()
        })

        it('should infer request formData parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'formData'; name: 'name'; type: 'string' }] }, 'formData'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string | undefined }>()
        })
      })

      describe('required parameters', () => {
        it('should infer request query parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'query'; name: 'name'; type: 'number'; required: true }] }, 'query'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: number }>()
        })

        it('should infer request path parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'path'; name: 'name'; type: 'string'; required: true }] }, 'path'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string }>()
        })

        it('should infer request header parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'header'; name: 'name'; type: 'string'; required: true }] }, 'header'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string }>()
        })

        it('should infer request formData parameters types', () => {
          type Result = OpenAPIV2.Parameters<{ responses: {}; parameters: [{ in: 'formData'; name: 'name'; type: 'string'; required: true }] }, 'formData'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string }>()
        })
      })

      describe('mixed parameters', () => {
        it('should infer query from mixed parameters required and optional', () => {
          type Result = OpenAPIV2.Parameters<{
            responses: {}
            parameters: [
              { in: 'query'; name: 'name'; type: 'number' },
              { in: 'query'; name: 'age'; type: 'number'; required: true },
            ]
          }, 'query'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: number | undefined; age: number }>()
        })

        it('should infer path from mixed parameters types', () => {
          type Result = OpenAPIV2.Parameters<{
            responses: {}
            parameters: [
              { in: 'path'; name: 'name'; type: 'string' },
              { in: 'query'; name: 'age'; type: 'number'; required: true },
            ]
          }, 'path'>
          expectTypeOf<Result>().toEqualTypeOf<{ name: string | undefined }>()
        })
      })
    })

    describe('RequestBody', () => {
      it('should infer request body types', () => {
        type Result = OpenAPIV2.RequestBody<{
          responses: {}
          parameters: [
            {
              in: 'body'
              name: 'body'
              schema: {
                type: 'object'
                properties: {
                  name: { type: 'string' }
                  age: { type: 'number' }
                }
              }
            },
          ]
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ name?: string; age?: number } | undefined>()
      })

      it('should infer request body types with required properties', () => {
        type Result = OpenAPIV2.RequestBody<{
          responses: {}
          parameters: [
            {
              in: 'body'
              name: 'body'
              schema: {
                type: 'object'
                properties: {
                  name: { type: 'string' }
                  age: { type: 'number' }
                }
                required: ['name']
              }
            },
          ]
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ name: string; age?: number } | undefined>()
      })

      it('should infer request body types with nested object', () => {
        type Result = OpenAPIV2.RequestBody<{
          responses: {}
          parameters: [
            {
              in: 'body'
              name: 'body'
              schema: {
                type: 'object'
                properties: {
                  name: { type: 'object'; properties: { first: { type: 'string' } } }
                  age: { type: 'number' }
                }
              }
            },
          ]
        }>
        expectTypeOf<Result>().toEqualTypeOf<{ name?: { first?: string }; age?: number } | undefined>()
      })
    })
  })
})
