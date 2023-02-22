### Curve

```ts
/**
 * Computes the y-coordinate of a point on a curve at `x` using the Beziers curve formula
 *
 * @param curve The curve
 * @param x The x-coordinate of the point
 * @returns The y-coordinate of the point
 * @example
 * curveBezier({ a: 1, b: 2 }, 3) // 7
 */
function curveBezier(curve: BezierCurve, x: number): number
function curveCardinal(curve: CardinalCurve, x: number): number
function curveCatmullRom(curve: CatmullRomCurve, x: number): number
function curveCubicBezier(curve: CubicBezierCurve, x: number): number
function curveHermite(curve: HermiteCurve, x: number): number
function curveLagrange(curve: LagrangeCurve, x: number): number
function curveLinear(curve: LinearCurve, x: number): number
function curveQuadraticBezier(curve: QuadraticBezierCurve, x: number): number
function curveStep(curve: StepCurve, x: number): number
function curve<T extends CurveType>(type: T, curve: Curve<T>, x: number): number
/**
 * Computes y-coordinates of a curve line of `n` points using the Beziers curve formula
 *
 * @param curve The curve
 * @param n The resolution of the curve line
 * @returns The curve line
 * @example
 * curveLineBezier({ a: 1, b: 2 }, 3) // [1, 3, 7]
 */
function curveLineBezier(curve: BezierCurve, n: number): number[]
function curveLineCardinal(curve: CardinalCurve, n: number): number[]
function curveLineCatmullRom(curve: CatmullRomCurve, n: number): number[]
function curveLineCubicBezier(curve: CubicBezierCurve, n: number): number[]
function curveLineHermite(curve: HermiteCurve, n: number): number[]
function curveLineLagrange(curve: LagrangeCurve, n: number): number[]
function curveLineLinear(curve: LinearCurve, n: number): number[]
function curveLineQuadraticBezier(curve: QuadraticBezierCurve, n: number): number[]
function curveLineStep(curve: StepCurve, n: number): number[]
function curveLine<T extends CurveType>(type: T, curve: Curve<T>, n: number): number[]
```