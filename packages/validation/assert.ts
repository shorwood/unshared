import type { Constructor } from '@unshared/types'
import * as ASSERT from './assert/index'
import { wrapAssert } from './wrapAssert'

export * from './assert/index'

/**
 * The `assert` object provides a set of extensible assertion functions that can be used to
 * validate the type and shape of values. Each assertion function throws a `ValidationError`
 * and can be extended with a custom message or error.
 *
 * @example
 *
 * // Assert that a value is a string.
 * assert.string(value) // throws "E_NOT_STRING: Value is not a string."
 *
 * // Define a custom error message.
 * assert.string.with('Custom message')(value) // throws "E_NOT_STRING: Custom message"
 *
 * // Some assertions require additional parameters.
 * assert.numberInRange(0, 10)(value) // throws "E_NUMBER_OUT_OF_RANGE: Value is out of range."
 *
 * // Define a custom error message for an assertion with additional parameters.
 * assert.numberInRange(0, 10).with('Custom message')(value) // throws "E_NUMBER_OUT_OF_RANGE: Custom message"
 */
export const assert = {
  array: wrapAssert(ASSERT.assertArray),
  arrayEmpty: wrapAssert(ASSERT.assertArrayEmpty),
  arrayNotEmpty: wrapAssert(ASSERT.assertArrayNotEmpty),
  boolean: wrapAssert(ASSERT.assertBoolean),
  false: wrapAssert(ASSERT.assertFalse),
  falsy: wrapAssert(ASSERT.assertFalsy),
  function: wrapAssert(ASSERT.assertFunction),
  instance: <T extends object>(of: Constructor<T>) => wrapAssert(ASSERT.assertInstance<T>, of),
  nil: wrapAssert(ASSERT.assertNil),
  notNil: wrapAssert(ASSERT.assertNotNil),
  notNull: wrapAssert(ASSERT.assertNotNull),
  notUndefined: wrapAssert(ASSERT.assertNotUndefined),
  null: wrapAssert(ASSERT.assertNull),
  number: wrapAssert(ASSERT.assertNumber),
  numberInRange: (min: number, max: number) => wrapAssert(ASSERT.assertNumberInRange, min, max),
  numberInRangeStrict: (min: number, max: number) => wrapAssert(ASSERT.assertNumberInRangeStrict, min, max),
  numberEven: wrapAssert(ASSERT.assertNumberEven),
  numberInteger: wrapAssert(ASSERT.assertNumberInteger),
  numberNegative: wrapAssert(ASSERT.assertNumberNegative),
  numberNegativeStrict: wrapAssert(ASSERT.assertNumberNegativeStrict),
  numberOdd: wrapAssert(ASSERT.assertNumberOdd),
  numberPositive: wrapAssert(ASSERT.assertNumberPositive),
  numberPositiveStrict: wrapAssert(ASSERT.assertNumberPositiveStrict),
  object: wrapAssert(ASSERT.assertObject),
  objectStrict: wrapAssert(ASSERT.assertObjectStrict),
  string: wrapAssert(ASSERT.assertString),
  stringConstantCase: wrapAssert(ASSERT.assertStringConstantCase),
  stringDotCase: wrapAssert(ASSERT.assertStringDotCase),
  stringEmail: wrapAssert(ASSERT.assertStringEmail),
  stringEmpty: wrapAssert(ASSERT.assertStringEmpty),
  stringEndingWith: <T extends string>(suffix: T) => wrapAssert(ASSERT.assertStringEndingWith<T>, suffix),
  stringEnum: <T extends string>(...values: T[]) => wrapAssert(ASSERT.assertStringEnum<T>, values),
  stringEquals: <T extends string>(value: T) => wrapAssert(ASSERT.assertStringEquals<T>, value),
  stringHeaderCase: wrapAssert(ASSERT.assertStringHeaderCase),
  stringKebabCase: wrapAssert(ASSERT.assertStringKebabCase),
  stringMatching: (pattern: RegExp) => wrapAssert(ASSERT.assertStringMatching, pattern),
  stringNotEmpty: wrapAssert(ASSERT.assertStringNotEmpty),
  stringNumber: wrapAssert(ASSERT.assertStringNumber),
  stringPascalCase: wrapAssert(ASSERT.assertStringPascalCase),
  stringPathCase: wrapAssert(ASSERT.assertStringPathCase),
  stringSnakeCase: wrapAssert(ASSERT.assertStringSnakeCase),
  stringStartingWith: <T extends string>(prefix: T) => wrapAssert(ASSERT.assertStringStartingWith<T>, prefix),
  stringTitleCase: wrapAssert(ASSERT.assertStringTitleCase),
  stringUuid: wrapAssert(ASSERT.assertStringUuid),
  true: wrapAssert(ASSERT.assertTrue),
  undefined: wrapAssert(ASSERT.assertUndefined),
}
