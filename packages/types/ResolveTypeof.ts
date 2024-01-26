import { Function } from './Function'

/**
 * Infer the type from the result of a `typeof` check.
 *
 * @template T The result of a `typeof` check.
 * @returns The inferred type.
 * @example ResolveTypeof<"number"> // number
 */
export type ResolveTypeof<T extends string> = T extends 'number'
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
  it('should resolve the type of "number"', () => {
    type Result = ResolveTypeof<'number'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should resolve the type of "string"', () => {
    type Result = ResolveTypeof<'string'>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should resolve the type of "boolean"', () => {
    type Result = ResolveTypeof<'boolean'>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should resolve the type of "object"', () => {
    type Result = ResolveTypeof<'object'>
    expectTypeOf<Result>().toEqualTypeOf<object>()
  })

  it('should resolve the type of "symbol"', () => {
    type Result = ResolveTypeof<'symbol'>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should resolve the type of "bigint"', () => {
    type Result = ResolveTypeof<'bigint'>
    expectTypeOf<Result>().toEqualTypeOf<bigint>()
  })

  it('should resolve the type of "undefined"', () => {
    type Result = ResolveTypeof<'undefined'>
    expectTypeOf<Result>().toEqualTypeOf<undefined>()
  })

  it('should resolve the type of "function"', () => {
    type Result = ResolveTypeof<'function'>
    expectTypeOf<Result>().toEqualTypeOf<Function>()
  })

  it('should fall back to "never" for unknown types', () => {
    type Result = ResolveTypeof<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
