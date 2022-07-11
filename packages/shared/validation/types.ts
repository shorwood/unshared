import { NotFunction } from '../types/function'

// TODO: Infer parameters anr return type from function

export type ValidationSchema = Record<string, ValidationRuleSet>
export type ValidatorFunction<R = any> = ((value: any, argument?: any) => R)
export type Validator = ValidatorFunction | RegExp | boolean

export interface ValidationRuleObject {
  name: string
  handler: ValidatorFunction
  parameters: any[]
  error: Error
}

export type ValidationRule =
  | Validator
  | ValidationRuleObject
  | [handler: RegExp, replacement: string]
  | [handler: ValidatorFunction, ...parameters: NotFunction[]]

export type ValidationRulePipe = ValidationRule[]
export type ValidationRuleSet = ValidationRule[][]
export interface ValidateRuleResult {
  name: string
  value: any
  isValid: boolean
  parameters?: any[]
  error?: Error
}

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
