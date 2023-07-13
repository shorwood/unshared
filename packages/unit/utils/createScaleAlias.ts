import { MaybeArray } from '@unshared/types/MaybeArray'
import { UnitFactor, UnitMap } from './types'

/**
 * Duplicate a unit mapping with different aliases as the keys. This is useful
 * for creating short and long variants of the same unit. For example, `m` and
 * `min` for minutes.
 *
 * @param aliases The aliases to create.
 * @param unit The unit to create the aliases for.
 * @returns The aliases.
 * @example createScaleAlias(['m', 'min'], 60) // { m: 60, min: 60 }
 */
export function createScaleAlias<K extends string>(aliases: MaybeArray<K>, unit: UnitFactor): UnitMap<K> {
  const result = {} as UnitMap<K>
  aliases = Array.isArray(aliases) ? aliases : [aliases]
  for (const alias of <K[]>aliases) result[alias] = unit
  return result
}
