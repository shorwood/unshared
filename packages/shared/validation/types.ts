import { NotFunction } from '../types'

export type Validator = (value: any, argument?: any, context?: any) => any
export type ValidatorArgument = (result: ValidateRuleResult) => any

export type Schema = Record<string, RuleSet>
export type RuleSet = Rule[][] | Rule[] | Rule

export type Rule = Validator |
[handler: Validator, arguments: NotFunction, errorMessage?: string] |
RuleObject

export interface RuleObject {
  handler: Validator
  name?: string
  arguments?: (result: ValidateRuleResult) => any
  errorMessage?: string | ((result: ValidateRuleResult) => string)
}

export interface ValidateRuleResult {
  value: any
  args?: unknown
  isValid: boolean
  isInvalid: boolean
  context: any
  name: string
  handler: Validator
  errorMessage: string
}

export interface ValidateRulesResult {
  results: ValidateRuleResult[]
  failed: string[]
  valid: string[]
  errors: string[]
  value: any
  isValid: boolean
  isInvalid: boolean
}

export interface ValidateSchemaResult {
  results: Record<string, ValidateRulesResult>
  failed: Record<string, string[]>
  valid: Record<string, string[]>
  errors: Record<string, string[]>
  value: any
  isValid: boolean
  isInvalid: boolean
}
