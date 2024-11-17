import type { OpenAPIV3 } from 'openapi-types'

/**
 * Resolve a type to the type it references. If the source is not a reference,
 * the source will be returned.
 *
 * @template T The type to resolve.
 * @returns The result type.
 * @example Resolved<OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject> // OpenAPIV3.SchemaObject
 */
export type Resolved<T> = T extends OpenAPIV3.ReferenceObject ? never : T

/**
 * Resolve an OpenAPI `ReferenceObject` to the component it references. If the
 * source is not a reference, the source will be returned.
 *
 * @private
 * @param specification  The OpenAPI specification.
 * @param source The object to dereference.
 * @returns The result component.
 * @example resolveComponent(specification, '#/schemas/MySchema')
 */
export function resolveReference<T>(specification: Partial<OpenAPIV3.Document>, source: OpenAPIV3.ReferenceObject): Resolved<T>
export function resolveReference<T>(specification: Partial<OpenAPIV3.Document>, source: T): Resolved<T>
export function resolveReference<T>(specification: Partial<OpenAPIV3.Document>, source: T): Resolved<T> {

  // --- Return the source if it is not a reference.
  if (typeof source !== 'object' || source === null || !('$ref' in source))
    return source as Resolved<T>

  // --- Assert that the parameters are valid.
  if (typeof specification.components !== 'object' || specification.components === null)
    throw new TypeError('Expected specification to have a components property.')
  if (typeof source.$ref !== 'string')
    throw new TypeError('Expected reference to have a $ref property.')
  if (!source.$ref.startsWith('#/'))
    throw new TypeError('Expected reference to start with #/.')

  // --- Resolve the component with it's reference path.
  const referenceParts = source.$ref.split('/').slice(1)
  let result = specification
  // @ts-expect-error: ignore type error
  for (const part of referenceParts) result = result?.[part]

  // --- Throw an error if the component could not be result.
  if (result === undefined)
    throw new Error(`Could not resolve OpenAPI component: ${source.$ref}`)

  // --- Return the result component.
  return result as Resolved<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const specification = await import('../../__fixtures__/example.json') as OpenAPIV3.Document

  it('should resolve a reference and infer the type', () => {
    const reference = { $ref: '#/components/schemas/user' } as OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
    const result = resolveReference(specification, reference)
    expect(result).toEqual(specification?.components?.schemas?.user)
    expectTypeOf(result).toEqualTypeOf<OpenAPIV3.SchemaObject>()
  })

  it('should resolve a reference and override the type', () => {
    const reference = { $ref: '#/components/schemas/user' }
    const result = resolveReference<OpenAPIV3.SchemaObject>(specification, reference)
    expect(result).toEqual(specification?.components?.schemas?.user)
    expectTypeOf(result).toEqualTypeOf<OpenAPIV3.SchemaObject>()
  })

  it('should return the source if it is not a reference', () => {
    const result = resolveReference(specification, { foo: 'bar' })
    expect(result).toEqual({ foo: 'bar' })
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  it('should throw an error if the reference does not start with #/', () => {
    const shouldThrow = () => resolveReference(specification, { $ref: 'components/schemas/user' })
    expect(shouldThrow).toThrow('Expected reference to start with #/.')
  })

  it('should throw an error if the reference is not a string', () => {
    const shouldThrow = () => resolveReference(specification, { $ref: 1 })
    expect(shouldThrow).toThrow('Expected reference to have a $ref property.')
  })

  it('should throw if specification does not have a components property', () => {
    const shouldThrow = () => resolveReference({}, { $ref: '#/components/schemas/user' })
    expect(shouldThrow).toThrow('Expected specification to have a components property.')
  })
}
