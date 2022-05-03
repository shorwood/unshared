/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/consistent-function-scoping */

// --- Types.
export type Validator<T = any, P = undefined> = P extends undefined
  ? (value: T) => boolean
  : (parameters: P) => (value: T) => boolean

// --- Generic.
export const isPrimitiveType: Validator<any, string> = type => value => typeof value === type
export const isNull: Validator<any> = value => value === null
export const isNotNull: Validator<any> = value => value !== null
export const isUndefined: Validator<any> = value => typeof value === 'undefined'
export const isNotUndefined: Validator<any> = value => typeof value !== 'undefined'

// --- String.
export const isString: Validator<string> = value => typeof value === 'string'
export const isStringEmpty: Validator<string> = value => value!.trim().length === 0
export const isStringNotEmpty: Validator<string> = value => value!.trim().length > 0
export const isStringStartingWith: Validator<string, string> = substr => value => value!.startsWith(substr)
export const isStringEndingWith: Validator<string, string> = substr => value => value!.endsWith(substr)
export const isStringEqualTo: Validator<string, string> = string => value => string === value
export const isStringMatching: Validator<string, RegExp> = regex => value => regex.test(value)
export const isStringLongerThan: Validator<string, number> = length => value => value.length >= length
export const isStringShorterThan: Validator<string, number> = length => value => value.length <= length
export const isStringLengthBetween: Validator<string, { min: number; max: number }> = ({ min, max }) => value => value.length >= min && value.length <= max
export const isStringNumber: Validator<string> = value => !Number.isNaN(+value)

// --- Boolean.
export const isBoolean: Validator<boolean> = value => typeof value === 'boolean'
export const isTrue: Validator<boolean> = value => value === true
export const isFalse: Validator<boolean> = value => value === false

// --- Number.
export const isNumber: Validator<number> = value => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
export const isNumberLessThan: Validator<number, number> = n => value => value < n
export const isNumberLessOrEqualThan: Validator<number, number> = n => value => value <= n
export const isNumberGreaterThan: Validator<number, number> = n => value => value > n
export const isNumberGreaterOrEqualThan: Validator<number, number> = n => value => value >= n
export const isNumberInRange: Validator<number, { min: number; max: number }> = ({ min, max }) => value => value >= min && value <= max
export const isNumberPositive: Validator<number> = value => value >= 0
export const isNumberNegative: Validator<number> = value => value < 0
export const isNumberInteger: Validator<number> = value => Number.isInteger(value)
