import { RuleSet, createRuleSet, createSchema } from '@unshared/validation'
import { Ref, unref } from 'vue-demi'
import { MaybeRef } from '../utils'
import { createParser } from '@unshared/validation'
import { computed } from 'vue'

/**
 * Validate an object value against a schema.
 *
 * @param value The object value to validate.
 * @param schema The schema to validate against.
 * @returns The validation result.
 */
export function useValidation(value: MaybeRef<unknown>, rules: RuleSet | RuleSchemaLike): Ref<ValidateRuleSetResult | ValidateSchemaResult> {
  const parse = computed(() => {
    value = unref(value)
    return typeof value === 'object' && value !== null
      ? createSchema(value, rules)
      : createParser(value, rules)
  })
}
