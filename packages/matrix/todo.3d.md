# 3D

| Description | Example |
| --- | --- |
| Create a 3D scene | `createScene()` |
| Create a 3D vector | `createVector(1, 2, 3)` |
| Create a 3D box | `createBox(1, 2, 3)` |
| Create a 3D sphere | `createSphere(1)` |
| Create a 3D cylinder | `createCylinder(1, 2)` |
| Create a 3D cone | `createCone(1, 2)` |
| Create a 3D torus | `createTorus(1, 2)` |
| Create a 3D plane | `createPlane(1, 2)` |
| Create a 3D point light | `createPointLight(1, 2, 3)` |
| Create a 3D ambient light | `createAmbientLight()` |
| Create a 3D directional light | `createDirectionalLight(1, 2, 3)` |
| Render a 3D scene | `renderScene(scene, cameraPosition, cameraRotation)` |
| Transform a 3D object | `transformObject(object, position, rotation)` |

### Matrix and vector operations in 3D space

```ts
interface Matrix { x: number; y: number; z: number; w: number }
interface Vector3 { x: number; y: number; z: number }
interface Vector2 { x: number; y: number }
/**
 * Add multiple vectors
 *
 * @param vectors The vectors to add
 * @returns The sum of the vectors
 * @example
 * addVector({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }) // { x: 5, y: 7, z: 9 }
 */
function vectorAdd(...vectors: Vector[]): Vector
function vectorSubstract(...vectors: Vector[]): Vector
function vectorMultiply(...vectors: Vector[]): Vector
function vectorDivide(...vectors: Vector[]): Vector
function vectorModule(...vectors: Vector[]): Vector
function vectorPow(base: Vector, exponent: Vector): Vector
function vectorSqrt(n: Vector): Vector
function vectorAbs(n: Vector): Vector
function vectorCeil(n: Vector): Vector
function vectorFloor(n: Vector): Vector
function vectorRound(n: Vector): Vector
function vectorMin(...vectors: Vector[]): Vector
function vectorMax(...vectors: Vector[]): Vector
function vectorDotProduct(a: Vector, b: Vector): number
function vectorCrossProduct(a: Vector, b: Vector): Vector
function vectorLength(n: Vector): number
function vectorNormalize(n: Vector): Vector
function vectorDistance(a: Vector, b: Vector): number
function vectorAngle(a: Vector, b: Vector): number
function vectorProject(a: Vector, b: Vector): Vector
function vectorReflect(a: Vector, b: Vector): Vector
function vectorRefract(a: Vector, b: Vector, n: number): Vector[]
function vectorLerp(a: Vector, b: Vector, n: number): Vector[]
function vectorHermite(a: Vector, b: Vector, c: Vector, d: Vector, n: number): Vector[]
function vectorBezier(a: Vector, b: Vector, c: Vector, d: Vector, n: number): Vector[]
function vectorCatmullRom(a: Vector, b: Vector, c: Vector, d: Vector, n: number): Vector[]

/**
 * Add multiple matrices
 *
 * @param matrices The matrices to add
 * @returns The sum of the matrices
 */
function matrixAdd(...matrices: Matrix[]): Matrix
function matrixSubstract(...matrices: Matrix[]): Matrix
function matrixMultiply(...matrices: Matrix[]): Matrix
function matrixDivide(...matrices: Matrix[]): Matrix
function matrixModule(...matrices: Matrix[]): Matrix
function matrixPow(base: Matrix, exponent: Matrix): Matrix
function matrixSqrt(n: Matrix): Matrix
function matrixAbs(n: Matrix): Matrix
function matrixCeil(n: Matrix): Matrix
function matrixFloor(n: Matrix): Matrix
function matrixRound(n: Matrix): Matrix
function matrixMin(...matrices: Matrix[]): Matrix
function matrixMax(...matrices: Matrix[]): Matrix
function matrixDotProduct(a: Matrix, b: Matrix): number
function matrixLength(n: Matrix): number
function matrixNormalize(n: Matrix): Matrix
function matrixDistance(a: Matrix, b: Matrix): number
```