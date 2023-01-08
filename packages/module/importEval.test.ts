import { expect, it } from 'vitest'
import { importEval } from './importEval'

it('should import the default export from an inline CommonJS script', () => {
  const script = 'module.exports = { foo: "bar" }'
  const result = importEval(script)
  expect(result).toEqual({ foo: 'bar' })
})

it('should import the default export from an inline ES module script', () => {
  const script = 'export default { foo: "bar" }'
  const result = importEval(script)
  expect(result).toEqual({ default: { foo: 'bar' } })
})

it('should import the default export from an inline ES module script with multiple exports', () => {
  const script = 'export const foo = "bar"; export default { foo }'
  const result = importEval(script)
  expect(result).toEqual({ foo: 'bar', default: { foo: 'bar' } })
})

it('should import export objects from an inline ES module script', () => {
  const script = 'export { foo: "bar", baz: "qux" }'
  const result = importEval(script)
  expect(result).toEqual({ foo: 'bar', baz: 'qux' })
})
