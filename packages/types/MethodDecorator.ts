import { Function } from './Function'

/**
 * A function to decorate a method withing a class. This type is similar to the
 * native `MethodDecorator` type, but allows to specify the type of the method
 * being decorated.
 *
 * @template T The type of the method being decorated.
 * @example MethodDecorator<(a: number, b: number) => number>
 */
export type MethodDecorator<T extends Function = Function> = (target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return a method decorator type', () => {
    type Result = MethodDecorator
    expectTypeOf<Result>().toEqualTypeOf<(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => TypedPropertyDescriptor<Function>>()
  })

  it('should return a method decorator type with a specific method type', () => {
    type Method = (a: number, b: number) => number
    type Result = MethodDecorator<Method>
    expectTypeOf<Result>().toEqualTypeOf<(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Method>) => TypedPropertyDescriptor<Method>>()
  })
}
