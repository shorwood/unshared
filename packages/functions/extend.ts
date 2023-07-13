/* eslint-disable unicorn/no-static-only-class */
import { Constructor } from '@unshared/types/Constructor'
import { Extends } from '@unshared/types/Extends'
import { mixins } from './mixins'

/**
 * Extends a class with another class. This is a simple wrapper around the
 * `mixins` function.
 *
 * @param base The base class.
 * @param derived The derived class.
 * @returns The extended class.
 * @example
 * class Base { foo = 'foo' }
 * class Derived { bar = 'bar' }
 * const Extended = extend(Derived, Base) // Class { foo: 'foo', bar: 'bar' }
 */
export function extend<T1 extends Constructor, T2 extends Constructor>(base: T1, derived: T2): Extends<T1, T2> {
  return mixins(base, derived) as Extends<T1, T2>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should extend a class with another class', () => {
    class Base { foo = 'foo' }
    class Derived { bar = 'bar' }
    const Extended = extend(Base, Derived)
    const instance = new Extended()
    expect(instance).toEqual({ foo: 'foo', bar: 'bar' })
  })
}
