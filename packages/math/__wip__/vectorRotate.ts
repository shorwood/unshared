import { Vector, createVector } from "./createVector"
import { printGraph } from "./printGraph"


function rotate2d(vector: Vector<2>, theta: number): Vector<2> {
  const [x, y] = vector
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  return createVector(
    x * cos - y * sin,
    x * sin + y * cos
  )
}

function translate2d(vector: Vector<2>, vector2: Vector<2>): Vector<2> {
  return createVector(
    vector[0] + vector2[0],
    vector[1] + vector2[1]
  )
}

function scale2d(vector: Vector<2>, vector2: Vector<2>): Vector<2> {
  return createVector(
    vector[0] * vector2[0],
    vector[1] * vector2[1]
  )
}

const skew2d = (vector: Vector<2>, vector2: Vector<2>): Vector<2> => {
  return createVector(
    vector[0] + vector2[0] * vector[1],
    vector[1] + vector2[1] * vector[0]
  )
}

// all in one without using the above functions
const transform2d = (vector: Vector<2>, transforms: { translate?: Vector<2>, rotate?: number, scale?: Vector<2>, skew?: Vector<2> }) => {
  const { translate, rotate, scale, skew } = transforms
  
  let [x, y] = [...vector]

  if (translate) {
    x += translate[0]
    y += translate[1]
  }

  if (scale) {
    x *= scale[0]
    y *= scale[1]
  }

  if (skew) {
    x += skew[0] * y
    y += skew[1] * x
  }

  if (rotate) {
    const cos = Math.cos(rotate)
    const sin = Math.sin(rotate)
    const xNew = x * cos - y * sin
    y = x * sin + y * cos
    x = xNew
  }
  
  return createVector(x, y)
}

/* v8 ignore next */
if (import.meta.vitest) {
  it.only('should rotate a 2D vector by 90 degrees on the Z axis', () => {
    // create a square
    const squarePoints = 50
    const squareSize = 10
    const square = [
      ...Array.from({ length: squarePoints }, (_, i) => createVector(i / squarePoints * squareSize, squareSize)),
      ...Array.from({ length: squarePoints }, (_, i) => createVector(squareSize, squareSize - i / squarePoints * squareSize)),
      ...Array.from({ length: squarePoints }, (_, i) => createVector(squareSize - i / squarePoints * squareSize, 0)),
      ...Array.from({ length: squarePoints }, (_, i) => createVector(0, i / squarePoints * squareSize)),
    ]

    // translate the square to the center
    const sq = square.map(x => transform2d(x, {
      translate: [-5, -5],
      // rotate: Math.PI / -4,
      scale: [1.5, 0.5],
      skew: [1, 0]
    }))
      // .map(x => translate2d(x, [-5, -5]))
      // .map(x => rotate2d(x, Math.PI * 0.25))
      // .map(x => skew2d(x, [0.5, 0]))
      // .map(x => vectorTransform(x, rotateTransformMatrix, Math.PI * 0.33))


    printGraph(...sq)
  })
}
