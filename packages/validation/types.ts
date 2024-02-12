import { NotFunction } from '@unshared/types/NotFunction'

// TODO: Infer parameters anr return type from function

export type ValidationRulePipe = ValidationRule[]
export type ValidationRuleSet = ValidationRule[][]

export type ValidationRules = ValidationRule | ValidationRulePipe | ValidationRuleSet

export interface ValidateRulePipeResult {
  value: any
  isValid: boolean
  results: ValidateRuleResult[]
  failed: string[]
  valid: string[]
  error?: Error
}
export interface ValidateRuleSetResult {
  value: any
  isValid: boolean
  results: ValidateRuleResult[]
  failed: string[]
  valid: string[]
  error?: Error
}

export interface ValidateSchemaResult {
  value: any
  isValid: boolean
  areValid: Record<string, boolean>
  results: Record<string, ValidateRuleSetResult>
  failed: Record<string, string[]>
  valid: Record<string, string[]>
  errors: Record<string, Error | undefined>
}
