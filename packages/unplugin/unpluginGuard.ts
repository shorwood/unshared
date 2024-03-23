export interface UnpluginGuardTypesOptions {
  /**
   * A map of custom type guards to use when generating type guards for
   * custom types.
   *
   * @example
   * { MyType(value) => value instanceof MyType }
   */
  guards?: Record<string, (value: unknown) => boolean>
  /**
   * If `true`, the plugin will generate type guards for primitive types such
   * as `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`,
   *
   * @default true
   */
  guardPrimitives?: boolean
  /**
   * If `true`, the plugin will generate type guards for interfaces.
   *
   * @default true
   */
  guardInterfaces?: boolean
  /**
   * If `true`, the plugin will generate type guards for enums.
   *
   * @default true
   */
  guardEnums?: boolean
  /**
   * If `true`, the plugin will generate type guards for non-finite numbers.
   *
   * @default true
   */
  guardNonFiniteNumbers?: boolean
  /**
   * If `true`, the plugin will generate casts for `number` values. This will
   * allow you to use number-like values in your codebase without having to
   * manually cast them to a number.
   *
   * @default false
   */
  castNumber?: Array<'bigint' | 'boolean' | 'null' | 'string' | 'undefined'> | boolean
  /**
   * If `true`, the plugin will generate casts for `boolean` values. This will
   * allow you to use boolean-like values in your codebase without having to
   * manually cast them to a boolean.
   *
   * @default false
   */
  castBoolean?: Array<'bigint' | 'null' | 'number' | 'string' | 'undefined'> | boolean
  /**
   * If `true`, the plugin will generate casts for `string` values. This will
   * allow you to use string-like values in your codebase without having to
   * manually cast them to a string.
   *
   * @default false
   */
  castString?: Array<'bigint' | 'boolean' | 'null' | 'number' | 'undefined'> | boolean
}

/**
 * Create a plugin that will inject type guards for all of the exported
 * functions in the project. Allowing your codebase to abort early if
 * the wrong type is passed to a function.
 *
 * By default, only primitive, enums and interfaces are supported. You can
 * add support for custom types by manually adding type guards to the `guards`
 * option.
 *
 * @example
 * // sum.ts
 * export function sum(a: number, b: number) {
 *   return a + b
 * }
 *
 * // sum.mjs
 * export function sum(a, b) {
 *   if (typeof a !== 'number') throw new TypeError('Expected "a" to be a number.')
 *   if (typeof b !== 'number') throw new TypeError('Expected "b" to be a number.')
 *   return a + b
 * }
 */
export function unpluginGuardTypes() {}
