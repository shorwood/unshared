import { Function } from './Function'

/**
 * Union of all possible overloads of a function. This is useful when you want to
 * destructure the parameters and return type of a function.
 *
 * @template T The type of the function.
 * @returns The union of all overloads.
 * @example
 * interface Foo {
 *   (a: number, b: string): boolean
 *   (a: string, b: number): boolean
 * }
 *
 * type result = FunctionOverloads<Foo>
 * // ((a: number, b: string) => boolean) |
 * // ((a: string, b: number) => boolean)
 */
export type FunctionOverloads<T extends Function> =
  T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5; (...p: infer P6): infer U6; (...p: infer P7): infer U7; (...p: infer P8): infer U8; (...p: infer P9): infer U9; (...p: infer P10): infer U10 }
    ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5, (...p: P6) => U6, (...p: P7) => U7, (...p: P8) => U8, (...p: P9) => U9, (...p: P10) => U10]
    : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5; (...p: infer P6): infer U6; (...p: infer P7): infer U7; (...p: infer P8): infer U8; (...p: infer P9): infer U9 }
      ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5, (...p: P6) => U6, (...p: P7) => U7, (...p: P8) => U8, (...p: P9) => U9]
      : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5; (...p: infer P6): infer U6; (...p: infer P7): infer U7; (...p: infer P8): infer U8 }
        ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5, (...p: P6) => U6, (...p: P7) => U7, (...p: P8) => U8]
        : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5; (...p: infer P6): infer U6; (...p: infer P7): infer U7 }
          ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5, (...p: P6) => U6, (...p: P7) => U7]
          : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5; (...p: infer P6): infer U6 }
            ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5, (...p: P6) => U6]
            : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4; (...p: infer P5): infer U5 }
              ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4, (...p: P5) => U5]
              : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3; (...p: infer P4): infer U4 }
                ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3, (...p: P4) => U4]
                : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2; (...p: infer P3): infer U3 }
                  ? [(...p: P1) => U1, (...p: P2) => U2, (...p: P3) => U3]
                  : T extends { (...p: infer P1): infer U1; (...p: infer P2): infer U2 }
                    ? [(...p: P1) => U1, (...p: P2) => U2]
                    : T extends { (...p: infer P1): infer U1 }
                      ? [(...p: P1) => U1]
                      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a single signature if function has no overloads', () => {
    type method = (a: number, b: string) => boolean
    type result = FunctionOverloads<method>
    expectTypeOf<result>().toEqualTypeOf<[method]>()
  })

  it('should return a union of signatures if function has 2 overloads', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface method {
      (a: number, b: string): boolean
      (a: string, b: number): boolean
    }
    type result = FunctionOverloads<method>
    type expected = [(a: number, b: string) => boolean, (a: string, b: number) => boolean]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return a union of signatures if function has 10 overloads', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface method {
      (a: number, b: string): boolean
      (a: string, b: number): boolean
      (a: number, b: number): boolean
      (a: string, b: string): boolean
      (a: number, b: string, c: number): boolean
      (a: string, b: number, c: number): boolean
      (a: number, b: number, c: number): boolean
      (a: string, b: string, c: number): boolean
      (a: number, b: string, c: number, d: number): boolean
      (a: string, b: number, c: number, d: number): boolean
    }
    type result = FunctionOverloads<method>
    type expected = [
      (a: number, b: string) => boolean,
      (a: string, b: number) => boolean,
      (a: number, b: number) => boolean,
      (a: string, b: string) => boolean,
      (a: number, b: string, c: number) => boolean,
      (a: string, b: number, c: number) => boolean,
      (a: number, b: number, c: number) => boolean,
      (a: string, b: string, c: number) => boolean,
      (a: number, b: string, c: number, d: number) => boolean,
      (a: string, b: number, c: number, d: number) => boolean,
    ]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
