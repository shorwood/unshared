/* eslint-disable sonarjs/no-useless-intersection */

/**
 * Wrap a literal type in a union with `string` to make it matchable with a
 * any string type. This is useful for creating a type that can be used to
 * access nested properties of an object allowing comprehensive autocompletion
 * and type checking without forcing the user to use a string literal union.
 *
 * @template T Literal type to wrap.
 * @returns Literal type wrapped in a union with `string & {}`.
 * @example MaybeLiteral<'foo'> // 'foo' | (string & {})
 */
export type MaybeLiteral<T extends string> = ({} & string) | T
