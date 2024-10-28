import type { Function } from './Function'
import type { MethodDecorator } from './MethodDecorator'

describe('MethodDecorator', () => {
  test('should return a method decorator type', () => {
    expectTypeOf<MethodDecorator>().toEqualTypeOf<(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => TypedPropertyDescriptor<Function>>()
  })

  test('should return a method decorator type with a specific method type', () => {
    type Method = (a: number, b: number) => number
    type Result = MethodDecorator<Method>
    expectTypeOf<Result>().toEqualTypeOf<(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Method>) => TypedPropertyDescriptor<Method>>()
  })
})
