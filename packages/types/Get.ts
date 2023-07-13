/**
 * Extract value of an object.
 *
 * @template T Object type
 * @template K Key to get value from
 * @returns Value at key.
 * @example Get<{ foo: 'bar' }, 'foo'> // 'bar'
 */
export type Get<T, K extends string | number | symbol> =
  // --- Handle symbol keys
  K extends symbol ? K extends keyof T ? T[K] : never

    // --- Handle string and number keys
    : K extends keyof T ? T[K]

      // --- Handle string number keys
      : K extends string ? `${K}` extends `${infer U extends number}` ? U extends keyof T ? T[U]

        // --- Key is invalid
        : never : never : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extract the value in an object', () => {
    type Result = Get<{ foo: 'bar' }, 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'bar'>()
  })

  it('should extract the value in an object with a string number key', () => {
    type Result = Get<{ foo: 'bar'; [x: number]: 'x' }, '0'>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value in an object with a number key', () => {
    type Result = Get<{ foo: 'bar'; [x: number]: 'x' }, 0>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value in an object with a symbol key', () => {
    const foo = Symbol('foo')
    type Result = Get<{ foo: 'bar'; [foo]: 'x' }, typeof foo>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should return `never` if the key does not exist', () => {
    type Result = Get<{ foo: 'bar' }, 'bar'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
