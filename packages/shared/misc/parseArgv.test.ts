import { expect, it } from 'vitest'
import { parseArgv } from './parseArgv'

it.each([

  // --- Simple option.
  ['foo bar', { options: {}, args: ['foo', 'bar'] }],
  [['foo', 'bar'], { options: {}, args: ['foo', 'bar'] }],
  ['--foo bar', { options: { foo: 'bar' }, args: [] }],
  ['--foo --bar', { options: { foo: true, bar: true }, args: [] }],

  // --- Flags
  ['-fbq', { options: { f: true, b: true, q: true }, args: [] }],
  ['-f -b -q', { options: { f: true, b: true, q: true }, args: [] }],
  ['foo -fbq', { options: { f: true, b: true, q: true }, args: ['foo'] }],
  ['foo -f -b -q', { options: { f: true, b: true, q: true }, args: ['foo'] }],

  // --- Combined option.
  ['--baz.qux -f -bq --foo bar', { options: { f: true, b: true, q: true, foo: 'bar', baz: { qux: true } }, args: [] }],

])('should parse %j to %j is parsed', (argv, expected) => {
  const result = parseArgv(argv)
  expect(result).toEqual(expected)
})
