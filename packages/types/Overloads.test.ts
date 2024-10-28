import type { Overloads } from './Overloads'

describe('Overloads', () => {
  test('should return a single signature if function has no overloads', () => {
    type Method = (a: string, b: string) => boolean
    type Result = Overloads<Method>
    expectTypeOf<Result>().toEqualTypeOf<[Method]>()
  })

  test('should return a union of signatures if function has 2 overloads', () => {
    interface Method {
      (a: number, b: number): boolean
      (a: string, b: number): boolean
    }
    type Result = Overloads<Method>
    type Expected = [
      (a: number, b: number) => boolean,
      (a: string, b: number) => boolean,
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a union of signatures if function has 10 overloads', () => {
    interface Method {
      (a: number, b: string): boolean
      (a: string, b: number): boolean
      (a: number, b: number): boolean
      (a: string, b: string): boolean
      (a: number, b: string, c: number): boolean
      (a: string, b: number, c: number): boolean
      (a: number, b: number, c: number): boolean
      (a: string, b: string, c: number): boolean
      (a: number, b: string, c: string): boolean
      (a: string, b: number, c: string): boolean
    }
    type Result = Overloads<Method>
    type Expected = [
      (a: number, b: string) => boolean,
      (a: string, b: number) => boolean,
      (a: number, b: number) => boolean,
      (a: string, b: string) => boolean,
      (a: number, b: string, c: number) => boolean,
      (a: string, b: number, c: number) => boolean,
      (a: number, b: number, c: number) => boolean,
      (a: string, b: string, c: number) => boolean,
      (a: number, b: string, c: string) => boolean,
      (a: string, b: number, c: string) => boolean,
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
