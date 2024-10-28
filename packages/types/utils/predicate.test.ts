import type {
  BooleanEvery,
  BooleanSome,
  ExcludeEmptyArray,
  ExcludeEmptyObject,
  IsAllNegative,
  IsAllPositive,
  IsAllZero,
  IsAnyDecimal,
  IsAnyNegative,
  IsAnyNumber,
  IsAnyPositive,
  IsAnyZero,
  IsArray,
  IsDecimal,
  IsEmptyString,
  IsEqual,
  IsInteger,
  IsNegative,
  IsNever,
  IsNil,
  IsNotEqual,
  IsNumber,
  IsPositive,
  IsStrictEqual,
  IsStrictNotEqual,
  IsString,
  IsTuple,
  IsTupleEmpty,
  IsUndefined,
  IsUnknown,
  IsVoid,
  IsZero,
} from './predicate'

describe('predicate', () => {
  test('should check if all booleans are true', () => {
    expectTypeOf<BooleanEvery<[true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanEvery<[false]>>().toEqualTypeOf<false>()
    expectTypeOf<BooleanEvery<[true, true, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanEvery<[true, false, true]>>().toEqualTypeOf<false>()
  })

  test('should check if some booleans are true', () => {
    expectTypeOf<BooleanSome<[true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[false]>>().toEqualTypeOf<false>()
    expectTypeOf<BooleanSome<[true, true, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[true, false, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[false, false, false]>>().toEqualTypeOf<false>()
  })

  test('should check if a value is unknown', () => {
    expectTypeOf<IsUnknown<unknown>>().toEqualTypeOf<true>()
    expectTypeOf<IsUnknown<string>>().toEqualTypeOf<false>()
  })

  test('should check if a value is never', () => {
    expectTypeOf<IsNever<never>>().toEqualTypeOf<true>()
    expectTypeOf<IsNever<string>>().toEqualTypeOf<false>()
  })

  test('should check if a value is void', () => {
    expectTypeOf<IsVoid<void>>().toEqualTypeOf<true>()
    expectTypeOf<IsVoid<undefined>>().toEqualTypeOf<false>()
  })

  test('should check if a value is undefined', () => {
    expectTypeOf<IsUndefined<undefined>>().toEqualTypeOf<true>()
    expectTypeOf<IsUndefined<void>>().toEqualTypeOf<false>()
  })

  test('should check if a value is nil', () => {
    expectTypeOf<IsNil<undefined>>().toEqualTypeOf<true>()
    expectTypeOf<IsNil<void>>().toEqualTypeOf<true>()
    expectTypeOf<IsNil<null>>().toEqualTypeOf<false>()
  })

  test('should check if a value is a string', () => {
    expectTypeOf<IsString<string>>().toEqualTypeOf<true>()
    expectTypeOf<IsString<number>>().toEqualTypeOf<false>()
  })

  test('should check if a string is empty', () => {
    expectTypeOf<IsEmptyString<''>>().toEqualTypeOf<true>()
    expectTypeOf<IsEmptyString<'hello'>>().toEqualTypeOf<false>()
  })

  test('should check if a value is an array', () => {
    expectTypeOf<IsArray<any[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsArray<readonly any[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsArray<string>>().toEqualTypeOf<false>()
  })

  test('should check if a value is a tuple', () => {
    expectTypeOf<IsTuple<[1, 2]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTuple<number[]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTuple<readonly [1, 2]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTuple<readonly number[]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTuple<string>>().toEqualTypeOf<false>()
  })

  test('should check if a tuple is empty', () => {
    expectTypeOf<IsTupleEmpty<[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTupleEmpty<[1]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTupleEmpty<readonly []>>().toEqualTypeOf<true>()
    expectTypeOf<IsTupleEmpty<readonly [1]>>().toEqualTypeOf<false>()
  })

  test('should check if two values are equal', () => {
    expectTypeOf<IsEqual<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqual<1, 2>>().toEqualTypeOf<false>()
    expectTypeOf<IsEqual<1, number>>().toEqualTypeOf<true>()
  })

  test('should check if two values are not equal', () => {
    expectTypeOf<IsNotEqual<1, 1>>().toEqualTypeOf<false>()
    expectTypeOf<IsNotEqual<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsNotEqual<1, number>>().toEqualTypeOf<false>()

  })

  test('should check if two values are strictly equal', () => {
    expectTypeOf<IsStrictEqual<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsStrictEqual<1, 2>>().toEqualTypeOf<false>()
    expectTypeOf<IsStrictEqual<1, number>>().toEqualTypeOf<false>()
  })

  test('should check if two values are strictly not equal', () => {
    expectTypeOf<IsStrictNotEqual<1, 1>>().toEqualTypeOf<false>()
    expectTypeOf<IsStrictNotEqual<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsStrictNotEqual<1, number>>().toEqualTypeOf<true>()
  })

  test('should check if a number is zero', () => {
    expectTypeOf<IsZero<0>>().toEqualTypeOf<true>()
    expectTypeOf<IsZero<1>>().toEqualTypeOf<false>()
  })

  test('should check if a value is a number', () => {
    expectTypeOf<IsNumber<number>>().toEqualTypeOf<true>()
    expectTypeOf<IsNumber<1>>().toEqualTypeOf<false>()
  })

  test('should check if a number is positive', () => {
    expectTypeOf<IsPositive<1>>().toEqualTypeOf<true>()
    expectTypeOf<IsPositive<-1>>().toEqualTypeOf<false>()
  })

  test('should check if a number is negative', () => {
    expectTypeOf<IsNegative<1>>().toEqualTypeOf<false>()
    expectTypeOf<IsNegative<-1>>().toEqualTypeOf<true>()
  })

  test('should check if a number is an integer', () => {
    expectTypeOf<IsInteger<1>>().toEqualTypeOf<true>()
    expectTypeOf<IsInteger<1.1>>().toEqualTypeOf<false>()
  })

  test('should check if a number is a decimal', () => {
    expectTypeOf<IsDecimal<1>>().toEqualTypeOf<false>()
    expectTypeOf<IsDecimal<1.1>>().toEqualTypeOf<true>()
  })

  test('should check if all numbers are zero', () => {
    expectTypeOf<IsAllZero<0, 0>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllZero<0, 1>>().toEqualTypeOf<false>()
  })

  test('should check if all numbers are positive', () => {
    expectTypeOf<IsAllPositive<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllPositive<1, -1>>().toEqualTypeOf<false>()
  })

  test('should check if all numbers are negative', () => {
    expectTypeOf<IsAllNegative<-1, -2>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllNegative<1, -1>>().toEqualTypeOf<false>()
  })

  test('should check if any number is zero', () => {
    expectTypeOf<IsAnyZero<0, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyZero<1, 1>>().toEqualTypeOf<false>()
  })

  test('should check if any number is a number', () => {
    expectTypeOf<IsAnyNumber<1, number>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyNumber<1, 2>>().toEqualTypeOf<false>()
  })

  test('should check if any number is positive', () => {
    expectTypeOf<IsAnyPositive<1, -1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyPositive<-1, -1>>().toEqualTypeOf<false>()
  })

  test('should check if any number is negative', () => {
    expectTypeOf<IsAnyNegative<-1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyNegative<1, 1>>().toEqualTypeOf<false>()
  })

  test('should check if any number is a decimal', () => {
    expectTypeOf<IsAnyDecimal<1, 1.1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyDecimal<1, 2>>().toEqualTypeOf<false>()
  })

  test('should exclude empty objects', () => {
    expectTypeOf<ExcludeEmptyObject<[] | object>>().toEqualTypeOf<[]>()
  })

  test('should exclude empty arrays', () => {
    expectTypeOf<ExcludeEmptyArray<[] | object>>().toEqualTypeOf<object>()
  })
})
