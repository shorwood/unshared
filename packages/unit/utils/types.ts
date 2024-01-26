/** A function to convert a value to the base unit. */
export type UnitFunction = (value: number) => number

/** A scale object with bi-directional conversion. */
export interface UnitObject {
  /** A factor or function to convert a value to the base unit. */
  to: UnitFunction | number
  /** A factor or function to convert a value from the base unit. */
  from: UnitFunction | number
}

/**
 * A factor to convert a value to and from the base unit. Can be a number, a
 * function, or an object with bi-directional conversion functions.
 *
 * - For linear conversion, (1000m -> 1km), use a number.
 * - For non-linear conversion, (1 kelvin -> -272.15 celsius), use a function.
 * - For bi-directional conversion, use an object with `to` and `from` functions.
 */
export type UnitFactor = UnitFunction | UnitObject | number

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
export type UnitValue<T extends UnitMap> = number | `${number}${UnitSymbol<T>}`

/**
 * A unit symbol.
 *
 * @template T A map of units and their scale.
 * @example 'm'
 */
export type UnitSymbol<T extends UnitMap> = Exclude<string & keyof T, ''>
