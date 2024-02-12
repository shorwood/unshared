# Number

| `clamp` | Clamps a number between two numbers | `clamp(1, 2, 3)` |
| `random` | Random number between two numbers | `random(1, 2)` |
| `sum` | Sum of an array of numbers | `sum([1, 2], iterator)` |
| `mean` | Mean of an array of numbers | `mean([1, 2])` |
| `median` | Median of an array of numbers | `median([1, 2])` |
| `mode` | Mode of an array of numbers | `mode([1, 2])` |

| `variance` | Variance of an array of numbers | `variance([1, 2])` |
| `standardDeviation` | Standard deviation of an array of numbers | `standardDeviation([1, 2])` |
| `percentile` | Percentile of an array of numbers (with optionnal range) |
| `skewness` | Skewness of an array of numbers | `skewness([1, 2])` |
| `kurtosis` | Kurtosis of an array of numbers | `kurtosis([1, 2])` |
| `isEven` | Checks if a number is even | `isEven(1)` |
| `isOdd` | Checks if a number is odd | `isOdd(1)` |
| `isPrime` | Checks if a number is prime | `isPrime(1)` |
| `isDivisible` | Checks if a number is divisible by another | `isDivisible(1, 2)` |
| `isPositive` | Checks if a number is positive | `isPositive(1)` |
| `isNegative` | Checks if a number is negative | `isNegative(1)` |
| `isInteger` | Checks if a number is an integer | `isInteger(1)` |
| `isFloat` | Checks if a number is a float | `isFloat(1)` |
| `isFinite` | Checks if a number is finite | `isFinite(1)` |
| `isInfinite` | Checks if a number is infinite | `isInfinite(1)` |
| `isSafeInteger` | Checks if a number is a safe integer | `isSafeInteger(1)` |
| `isPowerOfTwo` | Checks if a number is a power of two | `isPowerOfTwo(1)` |
| `isPowerOf` | Checks if a number is a power of another | `isPowerOf(1, 2)` |
| `isSquare` | Checks if a number is a square | `isSquare(1)` |
| `isCube` | Checks if a number is a cube | `isCube(1)` |
| `isPalindrome` | Checks if a number is a palindrome | `isPalindrome(1)` |
| `isArmstrong` | Checks if a number is an Armstrong number | `isArmstrong(1)` |
| `isPerfect` | Checks if a number is a perfect number | `isPerfect(1)` |
| `isAbundant` | Checks if a number is an abundant number | `isAbundant(1)` |
| `isDeficient` | Checks if a number is a deficient number | `isDeficient(1)` |
| `isHarshad` | Checks if a number is a Harshad number | `isHarshad(1)` |
| `isHappy` | Checks if a number is a happy number | `isHappy(1)` |
| `isDisarium` | Checks if a number is a Disarium number | `isDisarium(1)` |
| `isKeith` | Checks if a number is a Keith number | `isKeith(1)` |
| `isKaprekar` | Checks if a number is a Kaprekar number | `isKaprekar(1)` |
| `isLychrel` | Checks if a number is a Lychrel number | `isLychrel(1)` |
| `isNiven` | Checks if a number is a Niven number | `isNiven(1)` |
| `isPronic` | Checks if a number is a pronic number | `isPronic(1)` |
| `isSmith` | Checks if a number is a Smith number | `isSmith(1)` |
| `isSquareFree` | Checks if a number is a square-free number | `isSquareFree(1)` |
| `isTriangular` | Checks if a number is a triangular number | `isTriangular(1)` |
| `isTwin` | Checks if a number is a twin prime | `isTwin(1)` |
| `isUgly` | Checks if a number is an ugly number | `isUgly(1)` |
| `isWright` | Checks if a number is a Wright number | `isWright(1)` |
| `isSemiprime` | Checks if a number is a semiprime | `isSemiprime(1)` |
| `isSemiperfect` | Checks if a number is a semiperfect number | `isSemiperfect(1)` |
| `isSphenic` | Checks if a number is a sphenic number | `isSphenic(1)` |
| `isSquareful` | Checks if a number is a squareful number | `isSquareful(1)` |
| `isCarmichael` | Checks if a number is a Carmichael number | `isCarmichael(1)` |
| `isFibonacci` | Checks if a number is a Fibonacci number | `isFibonacci(1)` |
| `isLucas` | Checks if a number is a Lucas number | `isLucas(1)` |
| `isMersenne` | Checks if a number is a Mersenne number | `isMersenne(1)` |
| `isPell` | Checks if a number is a Pell number | `isPell(1)` |
| `isPellLucas` | Checks if a number is a Pell-Lucas number | `isPellLucas(1)` |
| `isPerfectPower` | Checks if a number is a perfect power | `isPerfectPower(1)` |
| `isAbundantPower` | Checks if a number is an abundant power | `isAbundantPower(1)` |
| `isDeficientPower` | Checks if a number is a deficient power | `isDeficientPower(1)` |
| `isHarshadPower` | Checks if a number is a Harshad power | `isHarshadPower(1)` |
| `isNivenPower` | Checks if a number is a Niven power | `isNivenPower(1)` |
| `isPronicPower` | Checks if a number is a pronic power | `isPronicPower(1)` |
| `isSmithPower` | Checks if a number is a Smith power | `isSmithPower(1)` |
| `isSquareFreePower` | Checks if a number is a square-free power | `isSquareFreePower(1)` |
| `isTriangularPower` | Checks if a number is a triangular power | `isTriangularPower(1)` |
| `isTwinPower` | Checks if a number is a twin power | `isTwinPower(1)` |
| `isUglyPower` | Checks if a number is an ugly power | `isUglyPower(1)` |
| `isWrightPower` | Checks if a number is a Wright power | `isWrightPower(1)` |
| `isSemiprimePower` | Checks if a number is a semiprime power | `isSemiprimePower(1)` |

### Complex arithmetics

```ts
/**
 * Add multiple complex numbers
 *
 * @param numbers The complex numbers to add
 * @returns The sum of the complex numbers
 * @example
 * addComplex({ real: 1, imaginary: 2 }, { real: 3, imaginary: 4 }) // { real: 4, imaginary: 6 }
 */
function addComplex(...numbers: Complex[]): Complex
function substractComplex(...numbers: Complex[]): Complex
function multiplyComplex(...numbers: Complex[]): Complex
function divideComplex(...numbers: Complex[]): Complex
function moduleComplex(...numbers: Complex[]): Complex
function powComplex(base: Complex, exponent: Complex): Complex
function sqrtComplex(n: Complex): Complex
function absComplex(n: Complex): Complex
function ceilComplex(n: Complex): Complex
function floorComplex(n: Complex): Complex
function roundComplex(n: Complex): Complex
function minComplex(...numbers: Complex[]): Complex
function maxComplex(...numbers: Complex[]): Complex
```

### Number theory

```ts
/**
 * Checks if a number is prime
 *
 * @param n The number to check
 * @returns `true` if the number is prime, `false` otherwise
 * @example
 * isPrime(1) // false
 */
function isNumberPrime(n: bigint | number): boolean
function isNumberEven(n: bigint | number): boolean
function isNumberOdd(n: bigint | number): boolean
function isNumberPositive(n: bigint | number): boolean
function isNumberNegative(n: bigint | number): boolean
function isNumberZero(n: bigint | number): boolean
function isNumberInteger(n: bigint | number): boolean
function isNumberSafe(n: bigint | number): boolean
function isNumberInfinite(n: bigint | number): boolean
function isNumberFinite(n: bigint | number): boolean
function isNumberNaN(n: bigint | number): boolean
function isNumberDivisibleBy(n: bigint | number, divisor: bigint | number): boolean
```
