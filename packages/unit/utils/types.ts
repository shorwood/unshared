/** A function to convert a value to the base unit. */
export type UnitFunction = (value: number) => number

/** A scale object with bi-directional conversion. */
export interface UnitObject {
  /** A factor or function to convert a value to the base unit. */
  to: number | UnitFunction
  /** A factor or function to convert a value from the base unit. */
  from: number | UnitFunction
}

/**
 * A factor to convert a value to and from the base unit. Can be a number, a
 * function, or an object with bi-directional conversion functions.
 *
 * - For linear conversion, (1000m -> 1km), use a number.
 * - For exponential conversion, (1
 * - For bi-directional conversion, use an object with `to` and `from` functions.
 */
export type UnitFactor = number | UnitObject | UnitFunction

/**
 * A map of units and their scale. (1 unit = x base unit)
 *
 * @example { m: 1, cm: 0.01 }
 */
export type UnitMap<K extends string = string> = Record<K, UnitFactor>

/**
 * A number suffixed with a unit from a scale.
 *
 * @template T A map of units and their scale.
 * @example '1 meter'
 */
export type UnitValue<T extends UnitMap> = number | `${number}` | `${number}${UnitSymbol<T>}`

/**
 * A unit symbol.
 *
 * @template T A map of units and their scale.
 * @example 'm'
 */
export type UnitSymbol<T extends UnitMap> = Exclude<keyof T & string, ''>
