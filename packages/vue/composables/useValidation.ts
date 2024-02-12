import { Primitive, ValidateRuleSetResult, ValidateSchemaResult, ValidationRuleSet, ValidationSchema, validateRuleSet, validateSchema } from '@hsjm/shared'
import { computedAsync } from '@vueuse/core'
import { Ref, unref } from 'vue-demi'
import { MaybeRef as MaybeReference } from '../utils'

/**
 * Validate an object value against a schema.
 * @param value The object value to validate.
 * @param schema The schema to validate against.
 * @returns The validation result.
 */
export function useValidation<T extends object>(value: MaybeReference<T>, schema: ValidationSchema): Ref<ValidateRuleSetResult>
/**
 * Validate an input value against a set of rules.
 * @param value The value to validate.
 * @param rules The rules to validate against.
 * @returns The validation result.
 */
export function useValidation<T extends Primitive>(value: MaybeReference<T>, rules: ValidationRuleSet): Ref<ValidateSchemaResult>
export function useValidation(value: MaybeReference<unknown>, rules: ValidationRuleSet | ValidationSchema): Ref<ValidateSchemaResult | ValidateRuleSetResult> {
  return computedAsync(async() => {
    value = unref(value)
    return typeof value === 'object' && value !== null
      ? await validateSchema(value, rules as ValidationSchema)
      : await validateRuleSet(value, rules as ValidationRuleSet)
  })
}
