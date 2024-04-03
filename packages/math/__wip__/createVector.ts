import { Tuple, TupleLength } from "@unshared/types"

/**
 * A vector is a tuple of numbers that represent a point in space.
 * 
 * @template N The number of dimensions.
 * @template T The type of the vector.
 * @example type Vector3D = Vector<3> // [number, number, number]
 */
export type Vector<N extends number = number> = Tuple<N, number>

/**
 * Create a N-dimensional vector of the given dimensions. The resulting
 * vector will be an array of N numbers, all initialized to 0.
 * 
 * @param n The number of dimensions.
 * @returns The N-dimensional vector.
 * @example createVector(5) // [0, 0, 0, 0, 0]
 */
export function createVector<N extends number>(n: N): Vector<N>
/**
 * Create a vector of the given dimensions.
 * 
 * @param dimensions The dimensions of the vector.
 * @returns The vector.
 * @example createVector(10, 20, 30) // [10, 20, 30]
 */
export function createVector<T extends number[]>(...dimensions: T): Vector<TupleLength<T>>
export function createVector(...dimensions: number[]): Vector {
  return dimensions.length === 1
    ? Array.from({ length: dimensions[0] }, () => 0)
    : dimensions
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should create a 4-dimensional vector', () => {
    const result = createVector(10, 20, 30, 40)
    expect(result).toEqual([10, 20, 30, 40])
    expectTypeOf(result).toEqualTypeOf<[number, number, number, number]>()
  })

  it('should create a 3-dimensional vector', () => {
    const result = createVector(10, 20, 30)
    expect(result).toEqual([10, 20, 30])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  it('should create a 2-dimensional vector', () => {
    const result = createVector(10, 20)
    expect(result).toEqual([10, 20])
    expectTypeOf(result).toEqualTypeOf<[number, number]>()
  })

  it('should create a 5-dimensional vector', () => {
    const result = createVector(10, 20, 30, 40, 50)
    expect(result).toEqual([10, 20, 30, 40, 50])
    expectTypeOf(result).toEqualTypeOf<[number, number, number, number, number]>()
  })

  it('should initialize a 5-dimensional vector with 0', () => {
    const result = createVector(5)
    expect(result).toEqual([0, 0, 0, 0, 0])
    expectTypeOf(result).toEqualTypeOf<[number, number, number, number, number]>()
  })
}