import { bernstein } from './bernstein'
import { Vector2 } from './createVector2'

/**
 * Compute the value at `x` for a [Bezier curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).
 * The curve is defined by a set of `Vector2` points. The first point is the start
 * of the curve and the last point is the end of the curve. The points in between
 * are the control points.
 *
 * @param x The `x` value to compute the `y` value for.
 * @param points The points that define the curve.
 * @returns The `y` value for the given `x` value.
 * @example
 * const p0 = vector2(0, 0)
 * const p1 = vector2(0.5, 1)
 * const p2 = vector2(1, 0)
 * curveBezier(0.5, p0, p1, p2) // { x: 0.5, y: 0.5 }
 */
// export function curveBezier(x: number, ...points: Vector2[]): Vector2 {
//   const result = { x, y: 0 }
//   const n = points.length - 1
//   for (const t in points)
//     result.y += points[t].y * bernstein(n, t) * Math.pow(1 - x, n - t) * Math.pow(x, t)
//   return result
// }
