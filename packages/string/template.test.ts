import { expect, it } from 'vitest'
import { template } from './template'

it.each([

  // --- Template nested
  ['Hello {{name}}', 'Hello World', { name: 'World' }, undefined],
  ['Hello {{name.0}}', 'Hello World', { name: ['World'] }, undefined],
  ['Hello {{name.world}}', 'Hello World', { name: { world: 'World' } }, undefined],

  // --- Template value
  ['Hello {{0}}', 'Hello W', 'World', undefined],

  // --- Custom delimiters/transform.
  ['Hello #0', 'Hello World', ['World'], { delimiters: ['#', ''] }],
  ['Hello (name)', 'Hello World', { name: 'World' }, { delimiters: ['(', ')'] }],
  ['Hello -name-', 'Hello World', { name: 'World' }, { delimiters: ['-', '-'] }],
  ['Hello {{World}}', 'Hello World', undefined, { transform: ({ key }: any) => key }],

])('should template %s to %s', (templated, expected, data: any, options: any) => {
  const result = template(templated, data, options)
  expect(result).toEqual(expected)
})
