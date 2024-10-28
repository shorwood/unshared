import { overwrite } from './overwrite'

describe('overwrite', () => {
  test('should return the object with the source values', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
  })

  test('should mutate the object with the source values', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    expect(object).toBe(result)
    expect(object).toStrictEqual({ bar: 2, foo: 1 })
  })

  test('should delete properties that are not in the source', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { foo: 1 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toStrictEqual(['foo'])
  })

  test('should add properties that are not in the object', () => {
    const object = { foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toStrictEqual(['foo', 'bar'])
  })

  test('should return an object with the type of the source', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { baz: 2, foo: 1 }
    const result = overwrite(object, source)
    expectTypeOf(result).toEqualTypeOf<{ baz: number; foo: number }>()
  })

  test('should overwrite an array and set the length', () => {
    const array = [1, 2, 3]
    const source = [101, 102]
    const result = overwrite(array, source)
    expect(result).toStrictEqual([101, 102])
  })

  test('should throw an error if the object and source are not both arrays or objects', () => {
    const shouldThrow = () => overwrite({}, [])
    expect(shouldThrow).toThrow(TypeError)
  })
})
