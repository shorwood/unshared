import { Linter } from 'eslint'
import { MaybeArray } from '@unshared/types'
import { toArray } from '@unshared/collection/toArray'

export interface ESLintConfigLike {
  rules?: Partial<Linter.RulesRecord>
}

/**
 * Extract the rules of an ESLint configuration object.
 *
 * @param config The ESLint configuration object.
 * @returns The `RulesRecord` object from the configuration.
 */
export function getConfigRules(config: MaybeArray<ESLintConfigLike>): Linter.RulesRecord {
  const configs = toArray(config).flat() as Array<{ rules: Linter.RulesRecord }>
  const rules = configs.map(x => x.rules)
  return Object.assign({}, ...rules) as Linter.RulesRecord
}
