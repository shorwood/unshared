import { expect, it, vi } from 'vitest'
import { importInline } from './importInline'

it('should import the default export from an inline CommonJS script', async() => {
  vi.unmock('node:fs/promises')
  const script = 'module.exports = { foo: "bar" }'
  const result = await importInline<any>(script)
  expect(result.foo).toStrictEqual('bar')
  expect(result.default).toEqual({ foo: 'bar' })
})

it('should import the default export from an inline ES module script', async() => {
  const script = 'export default { foo: "bar" }'
  const result = await importInline<any>(script)
  expect(result.default).toStrictEqual({ foo: 'bar' })
})

it('should import the default export from an inline ES module script with multiple exports', async() => {
  const script = 'export const foo = "bar"; export default { foo }'
  const result = await importInline<any>(script)
  expect(result.foo).toStrictEqual('bar')
  expect(result.default).toStrictEqual({ foo: 'bar' })
})

it('should import export objects from an inline ES module script', async() => {
  const script = 'const foo = "bar"; const baz = "qux"; export { foo, baz }'
  const result = await importInline<any>(script)
  expect(result.foo).toStrictEqual('bar')
  expect(result.baz).toStrictEqual('qux')
})
