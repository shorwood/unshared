import { Function } from './Function'

/**
 * Infer the type from the result of a `typeof` declaration.
 *
 * @template T The literal string to infer from.
 * @returns The inferred type.
 * @example TypeOf<"number"> // number
 */
export type TypeOf<T extends string> = T extends 'number'
  ? number
  : T extends 'string'
    ? string
    : T extends 'boolean'
      ? boolean
      : T extends 'object'
        ? object
        : T extends 'symbol'
          ? symbol
          : T extends 'bigint'
            ? bigint
            : T extends 'undefined'
              ? undefined
              : T extends 'function'
                ? Function
                : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the type of "number"', () => {
    type Result = TypeOf<'number'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should infer the type of "string"', () => {
    type Result = TypeOf<'string'>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should infer the type of "boolean"', () => {
    type Result = TypeOf<'boolean'>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should infer the type of "object"', () => {
    type Result = TypeOf<'object'>
    expectTypeOf<Result>().toEqualTypeOf<object>()
  })

  it('should infer the type of "symbol"', () => {
    type Result = TypeOf<'symbol'>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should infer the type of "bigint"', () => {
    type Result = TypeOf<'bigint'>
    expectTypeOf<Result>().toEqualTypeOf<bigint>()
  })

  it('should infer the type of "undefined"', () => {
    type Result = TypeOf<'undefined'>
    expectTypeOf<Result>().toEqualTypeOf<undefined>()
  })

  it('should infer the type of "function"', () => {
    type Result = TypeOf<'function'>
    expectTypeOf<Result>().toEqualTypeOf<Function>()
  })

  it('should infer "never" for non-matching literals', () => {
    type Result = TypeOf<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should infer "never" for non-literal strings', () => {
    type Result = TypeOf<string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
