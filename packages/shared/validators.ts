import { get } from './collection'
import { dateTimeIso8601, email, firestoreId, url } from './regexes'
import { RuleSet, Schema, validateRuleSet, validateSchema } from './validation'

// --- Generic validators.
export const isTypeOf = (value: any, type: string) => typeof value === type
export const isNull = (value: any): value is null => value === null
export const isNotNull = (value: any) => value !== null
export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'
export const isNotUndefined = (value: any) => typeof value !== 'undefined'
export const isNil = (value: any): value is undefined | null => typeof value === 'undefined' || value === null
export const isNotNil = (value: any) => typeof value !== 'undefined' && value !== null

// --- String validators.
export const isString = (value: any): value is string => typeof value === 'string'
export const isStringEmpty = (string: string) => string.trim().length === 0
export const isStringNotEmpty = (string: string) => string.trim().length > 0
export const isStringStartingWith = (string: string, substr: string) => string.startsWith(substr)
export const isStringEndingWith = (string: string, substr: string) => string.endsWith(substr)
export const isStringMatching = (string: string, regex: RegExp) => regex.test(string)
export const isStringLonger = (string: string, length: number) => string.length > length
export const isStringLongerOrEq = (string: string, length: number) => string.length >= length
export const isStringShorter = (string: string, length: number) => string.length < length
export const isStringShorterOrEq = (string: string, length: number) => string.length <= length
export const isStringBetween = (string: string, { min, max }: { min: number; max: number }) => string.length > min && string.length < max
export const isStringBetweenOrEq = (string: string, { min, max }: { min: number; max: number }) => string.length >= min && string.length <= max
export const isStringNumber = (string: string) => !Number.isNaN(+string)

// --- Regex validators.
export const isStringUrl = (value: string) => url.test(value)
export const isStringEmail = (value: string) => email.test(value)
export const isStringFirestoreId = (value: string) => firestoreId.test(value)
export const isStringTimestamp = (value: string) => dateTimeIso8601.test(value)

// --- Boolean validators.
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isTruthy = (value: any) => !!value
export const isFalsy = (value: any) => !value
export const isTrue = (value: boolean): value is true => value === true
export const isFalse = (value: boolean): value is false => value === false

// --- Number validators.
export const isNumber = (value: any) => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
export const isNumberLess = (number: number, n: number) => number < n
export const isNumberLessOrEq = (number: number, n: number) => number <= n
export const isNumberGreater = (number: number, n: number) => number > n
export const isNumberGreaterOrEq = (number: number, n: number) => number >= n
export const isNumberInRange = (number: number, { min, max }: { min: number; max: number }) => number >= min && number <= max
export const isNumberPositive = (number: number) => number >= 0
export const isNumberNegative = (number: number) => number < 0
export const isNumberInteger = (number: number) => Number.isInteger(number)

// --- Array validators.
export const isArray = (value: any): value is any[] => Array.isArray(value)
export const isArrayEmpty = (value: any[]): value is [] => Array.isArray(value) && value.length === 0
export const isArrayNotEmpty = (value: any[]): value is any[] => Array.isArray(value) && value.length > 0
export const isArrayIncluding = (value: any[], x: any): value is any[] => value.includes(x)
export const isArrayIncludingContext = (value: any[], path: string, context: any): value is any[] => value.includes(get(context, path))
export const isArrayOf = async(array: any[], ruleSet: RuleSet, context?: any) => {
  const resultPromises = array.map(value => validateRuleSet(value, ruleSet, context))
  const results = await Promise.all(resultPromises)
  const errors = results.flatMap(x => x.errors)
  if (errors.length > 0) throw new Error(errors[0])
  return results.every(result => result.isValid)
}

// --- Object validators.
export const isObject = (value: any): value is Record<string | symbol, any> => Object.prototype.toString.call(value) === '[object Object]'
export const isObjectShape = async(object: Record<string, any>, schema: Schema) => {
  const result = await validateSchema(object, schema)
  return result.isValid
}

// --- Comparaison.
export const isEqualToValue = (value: any, x: any) => value === x
export const isEqualToContext = (value: any, path: string, context: any) => value === get(context, path)

// --- Transformers.
export const defaultToValue = (value: any, defaultValue: any) => (value !== undefined ? false : defaultValue)
export const defaultToContext = (value: any, path: string, context: any) => (value !== undefined ? false : get(context, path))
export const defaultToContexts = (value: any, paths: string[], context: any) => (value !== undefined ? false : paths.map(path => get(context, path)))
export const toValue = (value: any, newValue: any) => newValue
export const toContext = (value: any, path: string, context: any) => get(context, path)
export const toContexts = (value: any, paths: string[], context: any) => paths.map(path => get(context, path))
