import { UnitFactor, UnitMap, UnitSymbol } from './types'

export interface CreateDerivedScaleOptions<
  T1 extends UnitMap,
  T2 extends UnitMap,
  S1 extends string,
  S2 extends string,
  K extends string,
> {
  /**
   * A suffix to append to the unit. Useful for creating a scale with a
   * different unit symbol or with a more descriptive name.
   *
   * @example `²`
   */
  suffix?: S1
  /**
   * The separator between the unit and the suffix.
   *
   * @default '/'
   */
  separator?: S2
  /**
   * A function to compute the key of a prefix.
   *
   * @param unit1 The first unit.
   * @param unit2 The second unit.
   * @param suffix The suffix.
   * @param separator The separator.
   * @returns The key.
   * @example (unit1, unit2, suffix) => `${unit1}/${unit2}${suffix}`
   */
  key?: (unit1: UnitSymbol<T1>, unit2: UnitSymbol<T2>, suffix: S1, separator: S2) => K
}

function createDerivedFactor(scale1: UnitFactor, scale2: UnitFactor): UnitFactor {
  if (typeof scale1 === 'number' && typeof scale2 === 'number')
    return scale1 / scale2

  // --- Derive if both are functions
  if (typeof scale1 === 'function' && typeof scale2 === 'function')
    return (value: number) => scale1(value) / scale2(value)

  // --- Derive if one is a function and the other is a number
  return typeof scale1 === 'function'
    ? (value: number) => (<Function>scale1)(value) / <number>scale2
    : (value: number) => <number>scale1 / (<Function>scale2)(value)
}

/**
 * Create a scale that derives two units into a third unit.
 *
 * @param scale1 The first scale.
 * @param scale2 The second scale.
 * @param options The options.
 * @returns A scale that derives the two units into a third unit.
 * @example createScaleDerived(SCALE_LENGTH, SCALE_TIME) // { 'm/s': 1, 'm/min': 1/60, ... }
 */
export function createScaleDerived<
  T1 extends UnitMap,
  T2 extends UnitMap,
  S1 extends string = '',
  S2 extends string = '/',
  K extends string = `${UnitSymbol<T1>}${S2}${UnitSymbol<T2>}${S1}`,
>(scale1: T1, scale2: T2, options: CreateDerivedScaleOptions<T1, T2, S1, S2, K> = {}): UnitMap<K> {
  const {
    suffix = '' as S1,
    separator = '/' as S2,
    key: createKey = (unit1, unit2, suffix, separator) => `${unit1}${separator}${unit2}${suffix}` as K,
  } = options

  // --- Derive all units into one another
  const result = {} as UnitMap<K>
  for (const unit1 in scale1) {
    for (const unit2 in scale2) {
      if (!unit1 || !unit2) continue
      const key = createKey(<any>unit1, <any>unit2, suffix, separator)
      const scale = createDerivedFactor(scale1[unit1], scale2[unit2])
      result[key] = scale
    }
  }

  // --- Return derived.
  return result as UnitMap<K>
}
