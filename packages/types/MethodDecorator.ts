import type { Function } from './Function'

/**
 * A function to decorate a method withing a class. This type is similar to the
 * native `MethodDecorator` type, but allows to specify the type of the method
 * being decorated.
 *
 * @template T The type of the method being decorated.
 * @example MethodDecorator<(a: number, b: number) => number>
 */
export type MethodDecorator<T extends Function = Function> = (target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>
