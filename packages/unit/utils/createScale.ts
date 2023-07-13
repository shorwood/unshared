import { MaybeArray } from '@unshared/types'
import { UnitFactor, UnitMap } from './types'

export interface CreateScaleOptions<S extends string, P extends string, K extends string> {
  /**
   * The base value of the unit.
   *
   * @default 1
   * @example createMultiples('g', { baseValue: 1e-3 }) // { g: 1e-3, kg: 1 }
   */
  baseValue?: UnitFactor
  /**
   * A map of prefixes and their scale. (Defaults to SI prefixes.)
   *
   * @example createMultiples('m', { prefixes: PREFIX_BASE10 }) // { m: 1, cm: 0.01, mm: 0.001, ... }
   */
  prefixes: Record<P, number>
  /**
   * A function to compute the key of a prefix.
   */
  key?: (unit: S, prefix: P) => K
}

/**
 * Create a scale multiple from a base unit. The base unit can be a number, a
 * function, or an object with `to` and `from` functions. This function should
 *
 * @param multiplier The multiplier of the base unit.
 * @param baseValue The base value of the unit.
 * @returns A function or number that scales a value.
 * @example createScaleMultiple(5, 10) // 50
 */
function createUnitValue<U extends UnitFactor>(multiplier = 1, baseValue: U): U {
  if (baseValue === undefined)
    return multiplier as U

  // --- Compute from number base value
  if (typeof baseValue === 'number')
    return (baseValue * multiplier) as U

  // --- Compute from function base value
  if (typeof baseValue === 'function')
    return ((value: number) => baseValue(value) * multiplier) as U

  // --- Compute from bi-directional object base value
  const { to: from, to } = baseValue
  return {
    to: typeof to === 'function' ? (value: number) => to(value) / multiplier : to * multiplier,
    from: typeof from === 'function' ? (value: number) => from(value) * multiplier : from * multiplier,
  } as U
}

/**
 * Create a map of units and their scale based from a base unit and a map of prefixes
 * and their multiplier.
 *
 * @param units The base unit symbol(s).
 * @param options The options to use.
 * @returns A map of units and their scale.
 * @example createScale('m', { prefixes: { k: 1e3, ... } }) // { m: 1, km: 1e3, ... }
 */
export function createScale<
  S extends string,
  P extends string,
  K extends string = `${P}${S}` | S,
// @ts-expect-error: ignore
>(units: MaybeArray<S>, options: CreateScaleOptions<S, P, K> = {}): UnitMap<K> {
  const {
    baseValue = 1,
    prefixes,
    key: createKey = (unit, prefix) => `${prefix}${unit}` as K,
  } = options

  // --- Initialize the result.
  units = Array.isArray(units) ? units : [units]
  const result: Record<string, UnitFactor> = {}
  for (const unit of units) result[unit] = baseValue

  // --- Compute the unit scale.
  for (const prefix in prefixes) {
    const multiplier = prefixes[prefix]
    for (const unit of units) {
      const key = createKey(unit, prefix)
      result[key] = createUnitValue(multiplier, baseValue)
    }
  }

  // --- Return the result.
  return result as UnitMap<K>
}
