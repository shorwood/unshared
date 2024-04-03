import { Matrix, Add, Function, TupleLength } from "@unshared/types";

export type TransformMatrixComponent = number | Function<number>
export type TransformMatrix<N extends number = number> = Matrix<N, TransformMatrixComponent>

export function createTransformMatrix<N extends number>(matrix: Readonly<TransformMatrix<N>>): TransformMatrix<N>
export function createTransformMatrix<T extends TransformMatrix>(matrix: Readonly<T>): TransformMatrix<TupleLength<T>>
export function createTransformMatrix(matrix: TransformMatrix) {
  return matrix;
}

/* v8 ignore next */
if (import.meta.vitest) {
  it('should create a 3D rotation matrix', () => {
    const result = createTransformMatrix([
      [Math.cos, Math.cos, 0],
      [Math.sin, Math.cos, 0],
      [0, 0, 1]
    ])
  })
}