import { expect, it } from 'vitest'
import { parseArgv } from './parseArgv'

it.each([

  // --- Simple option.
  ['foo bar', { options: {}, args: ['foo', 'bar'] }],
  ['--foo bar', { options: { foo: 'bar' }, args: [] }],
  ['--foo --bar', { options: { foo: true, bar: true }, args: [] }],

  // --- Flags
  ['-fbq', { options: { f: true, b: true, q: true }, args: [] }],
  ['-f -b -q', { options: { f: true, b: true, q: true }, args: [] }],
  ['foo -fbq', { options: { f: true, b: true, q: true }, args: ['foo'] }],
  ['foo -f -b -q', { options: { f: true, b: true, q: true }, args: ['foo'] }],

  // --- Combined option.
  ['--baz.qux -f -bq --foo bar', { options: { baz: { qux: true }, f: true, b: true, q: true, foo: 'bar' }, args: [] }],

])('should parse %j to %j is parsed', (argv, expected) => {
  const wrappedArgv = ['/usr/local/bin/node', 'index.js', ...argv.split(' ')]
  const wrappedExpected = { ...expected, nodePath: '/usr/local/bin/node', scriptPath: 'index.js' }
  const result = parseArgv(wrappedArgv)
  expect(result).toEqual(wrappedExpected)
})
