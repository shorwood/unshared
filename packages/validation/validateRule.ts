import { ValidateRuleResult, ValidationRule } from './types'
import { createRule } from './createRule'

/**
 * Validate a rule against a value.
 *
 * @param value The value to validate
 * @param rule The validation rule
 * @param context Any context to pass on to the validator
 * @returns The validation result
 * @throws If the rule is not valid
 * @example
 * const result = validateRule(1, Number.isNaN) // { isValid: true, value: 1, name: 'isNaN' }
 */
export const validateRule = async(value: any, rule: ValidationRule, context?: Record<string, any>): Promise<ValidateRuleResult> => {
  // --- Initialize rule object.
  const result = { value, isValid: true } as ValidateRuleResult

  try {
    // --- Format rule object and try validating or transforming.
    const { handler, name, parameters, error } = createRule(rule)
    result.name = name
    result.error = error
    result.parameters = parameters
    let ruleResult = handler.call(context, value, ...parameters)

    // --- If validator is async, await it and catch errors.
    // --- Save the result or error if any.
    if (ruleResult instanceof Promise) {
      await ruleResult
        .then(result => ruleResult = result)
        .catch((error: any) => {
          result.isValid = false
          result.error = error
          ruleResult = value
        })
    }

    // --- Interpret result as validation result.
    if (typeof ruleResult === 'boolean') result.isValid = ruleResult

    // --- Interpret result as transformed value.
    // --- If result is a Boolean, return its `valueOf` result.
    else result.value = (ruleResult instanceof Boolean) ? ruleResult.valueOf() : ruleResult
  }

  // --- Catch errors.
  catch (error: any) {
    result.isValid = false
    result.error = error
  }

  // --- Return result.
  if (result.isValid) result.error = undefined
  return result
}

/** c8 ignore next */
if (import.meta.vitest) {
  // --- Test validation functions.
  const isRequired = (value: any): boolean => !!value
  const isGreater = (value: number, n: number): boolean => value >= n
  const toTrue = () => new Boolean(true)
  const toUndefined = () => {}
  const toContext = function(this: any, value: number, key: any) { return this[key] }
  const toContextArrow = (_: any, key: any) => this?.[key]
  const isContext = function(this: any, value: number, key: any) { return value === this[key] }
  const toUpperCase = (value: string): string => value.toUpperCase()
  const throwsError = () => { throw new Error('Error') }
  const throwsAsyncError = async() => { throw new Error('Async Error') }

  it.each([

    // --- Validate using a function (fails).
    ['', isRequired, {
      value: '',
      isValid: false,
      name: 'isRequired',
      parameters: [],
      error: new Error('Failed rule: isRequired'),
    }],

    // --- Validate using a function (passes).
    ['value', isRequired, {
      value: 'value',
      isValid: true,
      name: 'isRequired',
      parameters: [],
    }],

    // --- Validate a function from an array with parameters.
    [0, [isGreater, 10], {
      value: 0,
      isValid: false,
      name: 'isGreater',
      parameters: [10],
      error: new Error('Failed rule: isGreater'),
    }],

    // --- Validate using raw rule object.
    [10, { handler: isGreater, parameters: [20], name: 'IS_GREATER', error: new Error('IS_NOT_GREATER') }, {
      value: 10,
      isValid: false,
      name: 'IS_GREATER',
      parameters: [20],
      error: new Error('IS_NOT_GREATER'),
    }],

    // --- Test a RegExp (passes).
    ['foo', /^foo$/, {
      value: 'foo',
      isValid: true,
      name: '/^foo$/',
      parameters: [/^foo$/],
    }],

    // --- Test a RegExp (fails).
    ['foo', /^bar$/, {
      value: 'foo',
      isValid: false,
      name: '/^bar$/',
      parameters: [/^bar$/],
      error: new Error('Failed regexp rule: /^bar$/'),
    }],

    // --- Validate a boolean (passes).
    ['foo', true, {
      value: 'foo',
      isValid: true,
      name: 'true',
      parameters: [],
    }],

    // --- Validate a boolean (fails).
    ['foo', false, {
      value: 'foo',
      isValid: false,
      name: 'false',
      parameters: [],
      error: new Error('Failed boolean rule: false'),
    }],

    // --- Validate using context (fails).
    ['value', [isContext, 'bar'], {
      value: 'value',
      isValid: false,
      name: 'isContext',
      parameters: ['bar'],
      error: new Error('Failed rule: isContext'),
    }],

    // --- Transform using context.
    ['value', [toContext, 'foo'], {
      value: 'bar',
      isValid: true,
      name: 'toContext',
      parameters: ['foo'],
    }],

    // --- Transform using context.
    ['value', [toContextArrow, 'foo'], {
      value: undefined,
      isValid: true,
      name: 'toContextArrow',
      parameters: ['foo'],
    }],

    // --- Transform value.
    ['value', toUpperCase, {
      value: 'VALUE',
      isValid: true,
      name: 'toUpperCase',
      parameters: [],
    }],

    // --- Transform to undefined.
    ['value', toUndefined, {
      value: undefined,
      isValid: true,
      name: 'toUndefined',
      parameters: [],
    }],

    // --- Transform to `true` using `Boolean(true)`.
    ['value', toTrue, {
      value: true,
      isValid: true,
      name: 'toTrue',
      parameters: [],
    }],

    // --- Handle rule error.
    ['value', throwsError, {
      value: 'value',
      isValid: false,
      name: 'throwsError',
      parameters: [],
      error: new Error('Error'),
    }],

    ['value', throwsAsyncError, {
      value: 'value',
      isValid: false,
      name: 'throwsAsyncError',
      parameters: [],
      error: new Error('Async Error'),
    }],

    // --- Invalid rule.
    ['foo', [/foo/], 'Invalid rule: Rule array must have at least 2 elements.\nRule: /foo/'],
    ['foo', [/foo/, false], 'Invalid rule: Rule of type [RegExp, ...] must have a string as second element.\nRule: /foo/,false'],
    ['foo', [isRequired, () => {}], 'Invalid rule: Rule of type [function, ...] must not have a function as second element.\nRule: (value) => !!value,() => {\n  }'],
    ['foo', 'bar', 'Invalid rule: Rule must be a function, RegExp, array or object.\nRule: bar'],
    ['foo', 1, 'Invalid rule: Rule must be a function, RegExp, array or object.\nRule: 1'],
    ['foo', 1n, 'Invalid rule: Rule must be a function, RegExp, array or object.\nRule: 1'],
    ['foo', null, 'Invalid rule: Rule must be a function, RegExp, array or object.\nRule: null'],
    ['foo', undefined, 'Invalid rule: Rule must be a function, RegExp, array or object.\nRule: undefined'],
    ['foo', new Boolean(true), 'Invalid rule: Rule object must have a string as name.\nRule: true'],
    ['foo', {}, 'Invalid rule: Rule object must have a string as name.\nRule: [object Object]'],

  ])('should try to validate/transform %s with "%s"', async(value: any, rule: any, expected: any) => {
    const result = await validateRule(value, rule, { foo: 'bar' })

    // --- If the result is a string, it is an error message.
    if (typeof expected === 'string') {
      expected = {
        value,
        isValid: false,
        error: new Error(expected),
      }
    }

    // --- Assert.
    expect(result).toEqual(expected)
  })
}
