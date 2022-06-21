
import { expect, it } from 'vitest'
import { createVeeSchema, createVeeValidator } from './createVeeSchema'
import { isStringNotEmpty } from './isString'

it('should return a validation function that can be used with vee-validate', async() => {
  const validator = createVeeValidator(Number.isInteger)
  const result1 = await validator(1)
  const result2 = await validator(0.5)
  expect(result1).toBe(true)
  expect(result2).toBe('isInteger')
})

it('should return a validation function that returns a custom error message when provided', async() => {
  const validator = createVeeValidator([Number.isInteger, undefined, 'must be an integer'])
  const result = await validator(0.5)
  expect(result).toBe('must be an integer')
})

it('should return a validation schema that can be used with vee-validate', async() => {
  const schema = createVeeSchema({
    id: Number.isInteger,
    name: [isStringNotEmpty, undefined, 'must not be empty'],
  })
  expect(await schema.id(1)).toBe(true)
  expect(await schema.name('')).toBe('must not be empty')
})
